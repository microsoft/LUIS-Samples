/*-----------------------------------------------------------------------------
This template demonstrates how to use list entities
. 
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/
-----------------------------------------------------------------------------*/

// NPM Dependencies
var argv = require('yargs').argv;
var request = require('request-promise');

// To run this sample, change these constants.

// endpointKey key, available in luis.ai on Publish page
const endpointKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" || argv.endpointKey;

// ID of your LUIS app to which you want to add an utterance
const appId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" || argv.appId;

// Region of app
const region = "westus" || argv.region;

// Get query from command line
// you do NOT need to add quotes around query phrase
// example: node query.js turn on the lights
// q: "turn on the lights"
// verbose: true means results return all intents, not just top intent
const q = argv._.join(" ");
const uri= `https://${region}.api.cognitive.microsoft.com/luis/v2.0/apps/${appId}?q=${q}&verbose=true`;

// query endpoint with endpoint key
var query = async () => {

    try {

        var myHTTPrequest = request({
            uri: uri,
            method: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': endpointKey
            }
        });

        return await myHTTPrequest;

    } catch (err) {
        throw err;
    }
}

// MAIN
query().then( (response) => {
    // return verbose results (all intents, all entities)
    console.log(response);
}).catch(err => {
    console.log(`Error querying:  ${err.message} `);
});