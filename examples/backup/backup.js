// This file takes a programmatic key and returns all information for all 
// applications associated with that key except for querylog.
//

const request = require("requestretry");
const async = require('async');
const fs = require('fs-extra');
const moment = require('moment');
const path = require("path");

// Change to your programmatic key
const programmaticKey = "PROGRAMMATIC KEY";

// time delay between requests
const delayMS = 500;

// retry recount
const retry = 5;

// retry reqeust if error or 429 received
var retryStrategy = function (err, response, body) {
  let shouldRetry = err || (response.statusCode === 429);
  if (shouldRetry) console.log("retry");
  return shouldRetry;
}

// HTTP REQUEST - get list of apps associated with programmatic key
var appListRequest = function (done) {

  let requestOptions = {
    method: "GET",
    url: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps?take=500",
    headers: {
      "Ocp-Apim-Subscription-Key": programmaticKey
    },
    maxAttempts: retry,
    retryDelay: delayMS,
    retryStrategy: retryStrategy
  };

  request(requestOptions, function (err, response, body) {
    if (err || response.statusCode != 200) done();
    done({ apps: JSON.parse(response.body) });
  });
}

// build HTTP URL list
// get list of all app infos for all apps in appList
// NOT organized by app, that will be done in fixAppList
var appListInfosUrls = (appList, done) => {
  var urls = [];

  appList.apps.forEach(app => {

    console.log("app " + app.name);

    urls.push({ name: app.name, appId: app.id, "Ocp-Apim-Subscription-Key": programmaticKey, route: "appInfo", url: ("https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + app.id) });
    urls.push({ name: app.name, appId: app.id, "Ocp-Apim-Subscription-Key": programmaticKey, route: "versions", url: ("https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + app.id + "/versions?take=500") });
    urls.push({ name: app.name, appId: app.id, "Ocp-Apim-Subscription-Key": programmaticKey, route: "settings", url: ("https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + app.id + "/settings") });
    urls.push({ name: app.name, appId: app.id, "Ocp-Apim-Subscription-Key": programmaticKey, route: "endpoints", url: ("https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + app.id + "/endpoints") });
  });
  done(urls);
}

// HTTP Request - get app info such as settings or endpoints
// result is put back into 'eachUrlObj' 
var appInfoRequest = function (eachUrlObj, done) {

  console.log("request app " + eachUrlObj.url + ' ' + new moment().format("HH:mm:ss"));

  let requestOptions = {
    method: "GET",
    url: eachUrlObj.url,
    headers: {
      "Ocp-Apim-Subscription-Key": programmaticKey
    },
    maxAttempts: retry,
    retryDelay: delayMS,
    retryStrategy: retryStrategy
  };
  request(requestOptions, function (error, response, body) {

    if (error || response.statusCode != 200) done();
    console.log("response app " + response.request.href + " " + response.statusCode);

    let json = JSON.parse(body);
    let route = response.request.href.substr(response.request.href.lastIndexOf('/') + 1).replace('?take=500', '');

    let myresponse = {
      appId: eachUrlObj.appId,
      route: route,
      name: eachUrlObj.name,
      url: response.request.href,
      status: response.statusCode,
      body: json
    };

    // put response back into object
    eachUrlObj[route] = {
      response: myresponse,
      status: response.statusCode
    };

    // not returning anything because response is inside eachUrlObj now
    done();
  });

}

// HTTP Request - get app version info for each version in app
// result is put back into 'eachUrlObj' 
var appInfoVersionRequest = function (eachUrlObj, done) {

  console.log("request version " + eachUrlObj.version + ' ' + new moment().format("HH:mm:ss"));

  let requestOptions = {
    method: "GET",
    url: eachUrlObj.url,
    headers: {
      "Ocp-Apim-Subscription-Key": eachUrlObj["Ocp-Apim-Subscription-Key"]
    },
    maxAttempts: retry,
    retryDelay: delayMS,
    retryStrategy: retryStrategy
  };
  request(requestOptions, function (error, response, body) {

    console.log("response version " + response.request.href + " " + response.statusCode);

    // not returning anything because response is inside eachUrlObj now
    eachUrlObj.response = JSON.parse(body);
    eachUrlObj.responseStatus = response.statusCode;
    done();
  });

}

// build HTTP URL list to get all version infos for app
let getVersionUrlsForThisApp = (progKey, appName, appId, versionList, done) => {
  let versionUrls = []
  versionList.forEach(version => {
    versionUrls.push({ "Ocp-Apim-Subscription-Key": progKey, name: appName, id: appId, version: version.version, info: JSON.parse(JSON.stringify(version)), url: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${version.version}/export` });
  });
  done(versionUrls);
}

// http request - in series
// don't call done until they are all returned
let getVersionInfos = (appUrls, versionUrls, done) => {
  async.eachSeries(versionUrls, appInfoVersionRequest, (versionsResponse) => {
    done(versionsResponse);
  });
}

// put app infos children into main JSON object in right spot
var fixAppList = (appList, children) => {

  appList.forEach(app => {
    var properties = children.filter(x => x.appId === app.id);
    var bodies = properties.map(x => {
      let info = {};
      if (x.route === "appInfo") {
        info = { route: "appInfo", values: x[x.appId].response.body };
      } else {
        info = { route: x.route, values: x[x.route].response.body };
      }
      return info;
    });
    app.properties = bodies;
  });
}

// put version infos children into main JSON object in right spot
var fixVersionList = (appList, children) => {
  appList.forEach(app => {
    var versionsList = children.filter(x => x.id === app.id);
    var bodies = versionsList.map(x => x.response);
    app.properties.push({ route: "versionExports", values: bodies });
  });

}

// main function
// appUrls is the final JSON that is tweaked as the program progresses
appListRequest((appUrls) => {

  // build app info url array
  appListInfosUrls(appUrls, (appInfoUrls) => {

    // request all app infos, when all returned and done, then proceed
    async.eachSeries(appInfoUrls, appInfoRequest, (response) => {

      // each info is in array but not organized by app
      var appChildrenRoutes = JSON.parse(JSON.stringify(appInfoUrls));

      // get each app's infos
      var appVersionInfoResponses = appChildrenRoutes.filter(x => x.route === "versions");

      // organize app infos back into app's spot in final JSON
      fixAppList(appUrls.apps, appChildrenRoutes);

      // get version infos, an app can have more than one version
      // this array will have all version info urls, not organized by app
      // that organizatio will be done in fixVersionList
      let versionUrls = [];
      appVersionInfoResponses.forEach(app => {
        let listOfVersionsForThisApp = app.versions.response.body;
        getVersionUrlsForThisApp(programmaticKey, app.name, app.appId, listOfVersionsForThisApp, (appVersionUrls) => {
          versionUrls.push(...appVersionUrls);
        });
      });

      // request all version infos, when all returned and done, then proceed
      getVersionInfos(appUrls, versionUrls, (versionsResponse) => {

        // organize version infos back into app's spot in final JSON 
        fixVersionList(appUrls.apps, versionUrls);

        // write to file including programmatic key at top of JSON
        fs.writeFile(path.join(__dirname, "backup.json"), JSON.stringify({ programmaticKey: programmaticKey, apps: appUrls.apps }), "utf-8")
          .then(() => {
            console.log("done");
          }).catch(err => { console.log(err); });

      });
    });
  });
});






