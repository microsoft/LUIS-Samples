// This code snippet demonstrates how to add an utterance to a LUIS app programmatically.
// See https://aka.ms/add-utterance-api for more information.

var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');

// To run this sample, change these constants.

// This is your authoring key, available in luis.ai under Account Settings
const LUIS_authoringKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// The ID of your LUIS app to which you want to add an utterance
const LUIS_appId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
// The version number of your LUIS app
const LUIS_versionId = "0.1";

// uploadFile is the file containing JSON for an utterance to add to the LUIS app.
// The contents of the file must be in this format: 
/*
[
    {
        "text": "go to Seattle",
        "intentName": "BookFlight",
        "entityLabels": [
            {
                "entityName": "Location",
                "startCharIndex": 6,
                "endCharIndex": 12
            }
        ]
    }
]
*/
const uploadFile = "./utterance-to-upload.json"


/* upload configuration */
var configUpload = {
    LUIS_authoringKey: LUIS_authoringKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    inFile: path.join(__dirname, uploadFile),
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};


// main function to call
var upload = async (config) => {

    try {

        // read in utterances
        

        // Extract the JSON for the request body
        // The contents of the file to upload need to be in this format described in the comments above.
        var jsonUtterance = await fse.readJson(config.inFile);

        // Add an utterance
        var utterancePromise = sendUtteranceToApi({
            uri: config.uri,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': config.LUIS_authoringKey
            },
            json: true,
            body: jsonUtterance
        });

        let results = await utterancePromise;
        let response = await fse.writeJson(config.inFile.replace('.json', '.results.json'), results);

        console.log("upload done");

    } catch (err) {
        throw err;
    }

}

// Upload the utterance
upload(configUpload)
.then(()=> {
    console.log("Process done");
});

// send JSON utterance as post.body to API
var sendUtteranceToApi = async (options) => {
    try {

        var response =  await rp.post(options);
        return {page: options.body, response:response};

    }catch(err){
        throw err;
    }   
}   
