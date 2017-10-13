var path = require('path');

const parse = require('./_parse');
const upload = require('./_upload');

// TBD: CHANGE THESE VALUES
const LUIS_subscriptionKey = "YOUR_SUBSCRIPTION_KEY";
const LUIS_appId = "YOUR_APP_ID";

const LUIS_versionId = "LightsOnly";

// NOTE: final output of upload api named utterances.upload.json
const exportFile= "./example-files/exported-luis-app-utterances.json";
const uploadFile = "./utterances.json"

/* parse configuration */
var configParse = {
    inFile: path.join(__dirname, exportFile),
    outFile: path.join(__dirname, uploadFile)
}; 
/* upload configuration */
var configUpload = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    batchSize: 100,
    inFile: configParse.outFile,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};

parse(configParse)
.then( () => {
    return upload(configUpload);
}).then( () => {
    console.log("process done");  
}).catch(err => {
    console.log(err);
});