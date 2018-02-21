/*-----------------------------------------------------------------------------
This template demonstrates how to use list entities.
. 
For a complete walkthrough, see the article at
https://aka.ms/luis-tutorial-list-entity

-----------------------------------------------------------------------------*/

// NPM Dependencies
var request = require('request-promise');
const Promise = require("bluebird");
const promiseRetry = require('promise-retry');
const promiseDelay = require('sleep-promise');

// To run this sample, change these constants.

// Authoring/starter key, available in www.luis.ai under Account Settings
const authoringKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ID of your LUIS app to which you want to add an utterance
const appId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

// Version number of your LUIS app
const versionId = "0.1";

// Region of app
const region = "westus";

// Construct HTTP uri
const uri= `https://${region}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${versionId}/train`;

// times to request training status
const retryCount = 10;

// wait time between training status requests
const retryInterval = 2000;

// current count of retries
let count = 0;

// determine if complete model, all entities, is trained
var isTrained = (trainingStatus) => {

    var untrainedModels = trainingStatus.filter(model => {
        return model.details.status == 'Fail' || model.details.status == 'InProgress';
    });
    return (untrainedModels.length===0);
}

// request training (POST)
var train = async (config) => {

    try {

        var body = undefined;

        // Add an utterance
        var myHTTPrequest = request({
            uri: uri,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': authoringKey
            },
            json: true,
            body: body
        });

        return await myHTTPrequest;

    } catch (err) {
        throw err;
    }
}
// request training status (GET)
var getTrainStatus = async (config) => {

    try {

        var body = undefined;

        var myHTTPrequest = request({
            uri: uri,
            method: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': authoringKey
            }
        });

        return await myHTTPrequest;

    } catch (err) {
        throw err;
    }
}
// retry if not trained
var manageRetries = (client) => {

    count += 1;

    return promiseRetry((retry, number) => {

        return promiseDelay(retryInterval)
        .then( () => {
            return getTrainStatus();
        }).then(response => {

            // response is a string
            // convert it to an array of JSON
            response = JSON.parse(response);

            // 2xx http response 
            let trained = isTrained(response);

            console.log(number + " trained = " + trained);

            if (count < retryCount && !trained) retry("not trained");
            
            return response;
        })
        .catch((err) => {
            throw err;
        });
    });  
}
// wait until model is trained -- may take a few moments
var waitUntilTrained = async () => {
    let setTraining = await train();
    let trained = await manageRetries();
    return trained;
}

// MAIN
waitUntilTrained().then( (response) => {
    console.log(response);
}).catch(err => {
    console.log(`Error adding list entity:  ${err.message} `);
});