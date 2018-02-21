/*-----------------------------------------------------------------------------
This template demonstrates how to use list entities.
. 
For a complete walkthrough, see the article at
https://aka.ms/luis-tutorial-list-entity
-----------------------------------------------------------------------------*/

// NPM Dependencies
var request = require('request-promise');

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
const uri= `https://${region}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/publish`;

// publish
var publish = async () => {

    try {

        // LUIS publish definition
        var body = {
            "versionId": "0.1",
            "isStaging": false,
            "region": "westus"
         };

        // HTTP request
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
// MAIN
publish().then( (response) => {
    // return GUID of list entity model
    console.log(response);
}).catch(err => {
    console.log(`Error adding list entity:  ${err.message} `);
});