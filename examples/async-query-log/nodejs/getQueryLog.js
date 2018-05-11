/*
    Experimental only

    Usage: 

        // full cycle of request download, wait for download, save file to disk
        node getQueryLog.js --appid 123 --authkey 123 

        // full cycle with named file and region
        node getQueryLog.js --file 123.csv --appid 123 --authkey 456 --region westus

        // begin download process on server with region
        node getQueryLog.js --appid 123 --authkey 456 --region westus --step begin

        // request status with region
        node getQueryLog.js --appid 123 --authkey 456 --region westus --step status

        // request download file with region
        node getQueryLog.js --appid 123 --authkey 456 --region westus --step final
*/
const co = require('co');
const fs = require('fs');

const request = require("requestretry");

// time delay between requests
const delayMS = 3000;

// retry recount
const retry = 10;

const argv = require('yargs').usage(
    `Usage: $0
    
    --file       [filename]
    --appid      [LUIS app ID]
    --authkey    [authoring key]
    --region     [authoring region]
    --step       [begin, status, final]

    `).demandOption(["appid","authkey"]).argv;

if(argv.appid.length!=36) {
    console.log("error: appid is not 36 char in length");
    process.exit();
}

if(argv.authkey.length!=32){
    console.log("error: authkey is not 32 char in length");
    process.exit();
}

const filenameWithPath = argv.file || "./querylog.csv";
const LUIS_region = argv.region || "westus";

// authoring key, available in luis.ai under Account Settings
const LUIS_authoringKey = argv.authkey;

// ID of your LUIS app to which you want to add an utterance
const LUIS_appId = argv.appid;


// retry reqeust if error or 429 received
var retryStrategy = function (err, response, body) {
    let shouldRetry = err || (response.statusCode === 429);
    if (shouldRetry) console.log("retry " + err);
    return shouldRetry;
}

// retry reqeust if error or 429 received OR if file is ready
var retryStrategyIsFileReady = function (err, response, body) {
    if (!err) console.log("statusCode = " + JSON.stringify(response.statusCode) + " " + body);

    let shouldRetry = err || (response.statusCode === 429);
    if (shouldRetry) console.log("retryStrategyIsFileReady "  + err);
    return shouldRetry;
}


var options = {
    uri: `https://${LUIS_region}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${LUIS_appId}/querylogsasync`,
    headers: {
        'Ocp-Apim-Subscription-Key': LUIS_authoringKey
    },
    //fullResponse: true,
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
        options.retryStrategy = retryStrategyIsFileReady;
		return await request.get(options);
	} catch (error) {
        console.log("waitUntilFileIsReady error " + error);
        throw(error);
	}
}

var checkStatus = async() =>{
	try {
        let checkStatusoptions = {
            uri: `https://${LUIS_region}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${LUIS_appId}/querylogsasync`,
            headers: {
                'Ocp-Apim-Subscription-Key': LUIS_authoringKey
            },
            maxAttempts:1
        };
		return await request.get(checkStatusoptions);
	} catch (error) {
        throw(error);
	}
}

var requestDownloadFile = async () => {
    return new Promise(function(resolve, reject) {
        try {
            var stream = fs.createWriteStream(filenameWithPath);
            stream.on('pipe', () =>{
                console.log("piping\n\r");
            }).on('error', (error) => {
                console.log("write stream error " + error);
            }).on('finish', function() {
                console.log("file stream finished");
                return resolve(true);
            });
            return request(options).pipe(stream);
        } catch (error) {
            console.log("requestDownloadFile error " + error);
            return reject(error);
        }
    });
}

var all = () => {
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
}

switch (argv.step){
    case "begin" : 
                requestStartDownload().then(status => {
                    if (status.statusCode > 299){
                        console.log("Begin Status: error = " + JSON.parse(status.body).error.message);
                    } else if (status.statusCode > 199 ) {
                        console.log("Begin Status: success = " + status.body);
                    } else {
                        console.log(status);
                    }
                    return;
                }).catch(err => {
                    console.log(err);
                })
                break;
    case "status" : 
                return checkStatus().then(status => {
                    if (status.statusCode > 299){
                        console.log("Check Status: error" + JSON.parse(status.body).error.message);
                    } else if (status.statusCode > 199) {
                        console.log("Begin Status: success = " + status.body);
                    } else {
                        console.log(status);
                    }
                    return;
                }).catch(err => {
                    console.log(err);

                })
                break;
    case "final" : 
                return requestDownloadFile().then(status => {
                    console.log(status);
                    return;
                }).catch(err => {
                    console.log(err);

                });
                break;
    default: all();
            break;
}


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
