var path = require('path');

const parse = require('./_parse');
const upload = require('./_upload');

// TBD: CHANGE THESE VALUES
//const LUIS_subscriptionKey = "YOUR_SUBSCRIPTION_KEY";
//const LUIS_appId = "YOUR_APP_ID";

const LUIS_subscriptionKey = "e237d6bc86cd4562bf67b09dff44d2e6";
const LUIS_appId = "693c3051-cbb3-4271-bf51-c9f3543fa37e";

const LUIS_versionId = "LightsOnly";

// NOTE: final output of upload api named utterances.upload.json
const iotFile= "./IoT Lights 1.0.json";
const uploadFile = "./utterances.json"

/* upload configuration */
var configUpload = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    batchSize: 100,
    inFile: path.join(__dirname, uploadFile),
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};

/* parse configuration */
var configParse = {
    inFile: path.join(__dirname, iotFile),
    outFile: path.join(__dirname, uploadFile)
}; 

var output = {};
/*
parse(configParse)
.then(output => {
    output.convert = output;
    return upload(configUpload);
}).then(output => {
    output.upload = output;
    console.log("process done");  
});
*/
// single step - uncomment 1 line only
//parse(configParse);
upload(configUpload)