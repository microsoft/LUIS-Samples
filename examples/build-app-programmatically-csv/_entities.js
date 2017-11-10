// node 7.x
// uses async/await - promises

const request = require("requestretry");
var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');

// time delay between requests
const delayMS = 1000;

// retry recount
const maxRetry = 5;

// retry request if error or 429 received
var retryStrategy = function (err, response, body) {
    let shouldRetry = err || (response.statusCode === 429);
    if (shouldRetry) console.log("retrying add entity...");
    return shouldRetry;
}

// main function to call
// Call add-entities
var addEntities = async (config) => {
    var entityPromises = [];
    config.uri = config.uri.replace("{appId}", config.LUIS_appId).replace("{versionId}", config.LUIS_versionId);

    config.entityList.forEach(function (entity) {
        try {
            config.entityName = entity;
            // JSON for the request body
            // { "name": MyEntityName}
            var jsonBody = {
                "name": config.entityName,
            };

            // Create an app
            var addEntityPromise = callAddEntity({
                url: config.uri,
                fullResponse: false,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: jsonBody,
                maxAttempts: maxRetry,
                retryDelay: delayMS,
                retryStrategy: retryStrategy
            });
            entityPromises.push(addEntityPromise);

            console.log(`called addEntity for entity named ${entity}.`);

        } catch (err) {
            console.log(`Error in addEntities:  ${err.message} `);
            //throw err;
        }
    }, this);
    let results = await Promise.all(entityPromises);
    console.log(`Results of all promises = ${JSON.stringify(results)}`);
    let response = results;// await fse.writeJson(createResults.json, results);


}

// Send JSON as the body of the POST request to the API
var callAddEntity = async (options) => {
    try {

        var response;        
        response = await request(options);
        return { response: response };

    } catch (err) {
        console.log(`error in callAddEntity: ${err.message}`);
    }
}

module.exports = addEntities;