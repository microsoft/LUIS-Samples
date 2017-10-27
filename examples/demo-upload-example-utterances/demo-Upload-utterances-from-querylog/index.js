var path = require('path');

const download = require('./_download');
const parse = require('./_parse');
const upload = require('./_upload');

// TBD: CHANGE THESE VALUES
const LUIS_subscriptionKey = "YOUR_SUBSCRIPTION_KEY";
const LUIS_appId = "YOUR_APP_ID";

const LUIS_versionId = "0.1";

// NOTE: final output of upload api named utterances.upload.json
const downloadFile= "./utterances.csv";
const uploadFile = "./utterances.json"

/* download configuration */
var configDownload = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    outFile: path.join(__dirname, downloadFile),
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/querylogs".replace("{appId}",LUIS_appId)
};

/* upload configuration */
var configUpload = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    inFile: path.join(__dirname, uploadFile),
    batchSize: 100,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};

/* parse configuration */
var configParse = {
    inFile: path.join(__dirname, downloadFile),
    outFile: path.join(__dirname, uploadFile)
}; 

download(configDownload)
.then(() => {
    return parse(configParse);
}).then(() => {
    return upload(configUpload);
}).then(() => {
    console.log("process done");  
}).catch(err => {
    console.log(err);
});