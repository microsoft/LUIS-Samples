/*
    Experimental only


*/

const fs = require('fs');
const request = require("requestretry");
var co = require('co');

const filenameWithPath = "./querylog.csv";

// authoring key, available in luis.ai under Account Settings
const LUIS_authoringKey = "";
// ID of your LUIS app to which you want to add an utterance
const LUIS_appId = "";

const LUIS_region = "westus";

// time delay between requests
const delayMS = 1000;

// retry recount
const retry = 5;

// retry reqeust if error or 429 received
var retryStrategy = function (err, response, body) {
    let shouldRetry = err || (response.statusCode === 429);
    if (shouldRetry) console.log("retry");
    return shouldRetry;
}

// retry reqeust if error or 429 received OR if file is ready
var retryStrategyIsFileReady = function (err, response, body) {
    let shouldRetry = err || (response.statusCode === 429);
    if (shouldRetry) console.log("retry");
    return shouldRetry;
}


var options = {
    uri: `https://${LUIS_region}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${LUIS_appId}/querylogsasync`,
    headers: {
        'Ocp-Apim-Subscription-Key': LUIS_authoringKey
    },
    fullResponse: true,
    maxAttempts: retry,
    retryDelay: delayMS,
    retryStrategy: retryStrategy
};

var requestStartDownload = async () => {
	try {
        console.log("requestStartDownload");
		return await request.post(options);
	} catch (error) {
        console.log("requestStartDownload error " + error);
        throw(error);
	}
}

var waitUntilFileIsReady = async () =>{
	try {
        console.log("waitUntilFileIsReady");
		return await request.get(options);
	} catch (error) {
        console.log("waitUntilFileIsReady error " + error);
        throw(error);
	}
}

var requestDownloadFile = async () => {
    return new Promise(function(resolve, reject) {
        try {
            var stream = fs.createWriteStream(filenameWithPath);
            stream.on('finish', function() {
                console.log("requestDownloadFile pipe finish");
                return resolve(true);
            });
            return request(options).pipe(stream);
        } catch (error) {
            console.log("requestDownloadFile error " + error);
            return reject(error);
        }
    });
}

requestStartDownload().then(responseStartDownload=>{
    return waitUntilFileIsReady();
}).then(requestDownloadStatus => {
    return co(function*() {
        var value = (yield requestDownloadFile());
        return value;
    });
}).then(finalResponse=>{
    console.log("main done");
}).catch(err=>{
    console.log("main error " + err);
});

//400:There's no previous request to prepare query logs. Please send a POST request first.
/*
requestDownloadStatus().then(requestDownloadStatus => {
    return requestDownloadFile();
}).then(finalResponse=>{
    console.log("done");
}).catch(err=>{
    console.log(err);
});
*/
