// node 7.x
// uses async/await - promises

var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');



// main function to call
// Call Apps_Create
var createApp = async (config) => {
    
        try {
    
            // JSON for the request body
            // { "name": MyAppName, "culture": "en-us"}
            var jsonBody = { 
                "name": config.appName, 
                "culture": config.culture
            };
    
            // Create a LUIS app
            var createAppPromise = callCreateApp({
                uri: config.uri,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: jsonBody
            });
    
            let results = await createAppPromise;

            // Create app returns an app ID
            let appId = results.response;  
            console.log(`Called createApp, created app with ID ${appId}`);
            return appId;

    
        } catch (err) {
            console.log(`Error creating app:  ${err.message} `);
            throw err;
        }
    
    }

// Send JSON as the body of the POST request to the API
var callCreateApp = async (options) => {
    try {

        var response; 
        if (options.method === 'POST') {
            response = await rp.post(options);
        } else if (options.method === 'GET') { // TODO: There's no GET for create app
            response = await rp.get(options);
        }
        // response from successful create should be the new app ID
        return { response };

    } catch (err) {
        throw err;
    }
} 

module.exports = createApp;