// This code snippet demonstrates how to add an utterance to a LUIS app programmatically. 
// See https://aka.ms/add-utterance-api for more information on the API.
// To use it, you must already have an app created at www.luis.ai. This app must have the intents to which to add the utterances.
// You can also import a sample LUIS app to start with at: https://aka.ms/add-utterance-json
// You can find an example of the JSON format for the utterances to add at: https://aka.ms/add-utterance-json-format
// 
// Command line arguments 
// add-utterance
//    Calling add-utterance with no arguments adds an utterance to the app, without training it.
// add-utterance -train 
//    adds an utterance, sends a request to begin training, and requests training status. 
//    The status is generally Queued immediate after training begins. Status details are written to a file.
// add-utterance -status
//    Checks the training status and writes status details to a file.

var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');

// To run this sample, change these constants.

// Programmatic key, available in luis.ai under Account Settings
const LUIS_subscriptionKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
// ID of your LUIS app to which you want to add an utterance
const LUIS_appId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
// The version number of your LUIS app
const LUIS_versionId = "0.1";

// uploadFile is the file containing JSON for utterance(s) to add to the LUIS app.
const uploadFile = "./utterance-to-upload.json"
// The contents of the file must be in this format below, 
// also described at: https://aka.ms/add-utterance-json-format
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
// If your utterance has no entities you must include an empty "entityLabels" field:
/*
[
    {
        "text": "book a flight",
        "intentName": "BookFlight",
        "entityLabels": []
    }
]
*/



var trainAfterAdd = false;
var requestTrainingStatus = false;

// Command line arguments:
// -train to train based on the utterances in uploadFile
// -status to get training status
if (process.argv.length >= 3) {
    if (process.argv[2] === "-train") {
        trainAfterAdd = true;
    } else if (process.argv[2] === "-status") {
        requestTrainingStatus = true;
    }
}


/* upload configuration */
var configAddUtterance = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    inFile: path.join(__dirname, uploadFile),
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};


// Call add-utterance
var addUtterance = async (config) => {

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
                'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
            },
            json: true,
            body: jsonUtterance
        });

        let results = await utterancePromise;
        let response = await fse.writeJson(config.inFile.replace('.json', '.upload.json'), results);

        console.log("Add utterance done");

    } catch (err) {
        console.log(`Error adding utterance:  ${err.message} `);
        //throw err;
    }

}

/* training configuration */
var configTrain = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/train".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId),
    method: 'POST', // POST to request training, GET to get training status
};

// Call train
var train = async (config) => {

    try {

        var trainingPromise = sendUtteranceToApi({
            uri: config.uri,
            method: config.method, // Use POST to request training, GET to get training status 
            headers: {
                'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
            },
            json: true,
            body: null      // The body can be empty for a training request
        });

        let results = await trainingPromise;
        
        if (config.method === 'POST') {
            let response = await fse.writeJson(path.join(__dirname, 'training-results.json'), results);        
            console.log(`Training request sent. The status of the training request is: ${results.response.status}.`);
        } else if (config.method === 'GET') {
            let response = await fse.writeJson(path.join(__dirname, 'training-status-results.json'), results);
            console.log(`Training status saved to file. `);
        }
        

    } catch (err) {
        console.log(`Error in Training:  ${err.message} `);
        // throw err;
    }

}


// send JSON  as post.body to API
var sendUtteranceToApi = async (options) => {
    try {

        var response; 
        if (options.method === 'POST') {
            response = await rp.post(options);
        } else if (options.method === 'GET') {
            response = await rp.get(options);
        }
        
        return { request: options.body, response: response };

    } catch (err) {
        throw err;
    }
}


if (trainAfterAdd) {
    // Add the utterance and train
    addUtterance(configAddUtterance)
        .then(() => {
            console.log("Add utterance complete. About to request training.");
            configTrain.method = 'POST';
            return train(configTrain, false);
        }).then(() => {
            console.log("Training process complete. Requesting training status.");
            configTrain.method = 'GET';
            return train(configTrain, true);
        }).then(() => {
            console.log("process done");
        });

} else if (requestTrainingStatus) {
    configTrain.method = 'GET';
    train(configTrain)
        .then(() => {
            console.log("Requested training status.");
        });
}
else {
    // Add the utterance to the LUIS
    addUtterance(configAddUtterance)
        .then(() => {
            console.log("Add utterance complete.");
        });

}

