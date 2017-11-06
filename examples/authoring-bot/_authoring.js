var request = require('request');
module.exports = {

    /*********************************************************************************************************** */
    // returns the App ID of the newly created app if successful.
    /*********************************************************************************************************** */
    createApp: function (name, culture) {
        let payload = {
            "name": name,
            "culture": culture
        }

        return new Promise(function (resolve, reject) {
            request.post(
                'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/',
                {
                    "headers": {
                        "Ocp-Apim-Subscription-Key": process.env.LUIS_PROGRAMMATIC_KEY,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    "body": JSON.stringify(payload)
                }, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    } else {
                        console.log(`Response status code = ${response.statusCode}, status mesage = ${response.statusMessage}`);
                        console.log(body);
                        return resolve(JSON.parse(body));
                    }
                }
            )
        })
    },

    /*********************************************************************************************************** */
    // returns the list of apps the user has in their subscription
    /*********************************************************************************************************** */
    listApps: function () {

        return new Promise(function (resolve, reject) {
            request.get(
                'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/',
                {
                    "headers": {
                        "Ocp-Apim-Subscription-Key": process.env.LUIS_PROGRAMMATIC_KEY,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    "body": null  // no body necessary for GET request
                }, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    } else {
                        console.log(`Response status code = ${response.statusCode}, status mesage = ${response.statusMessage}`);
                        console.log(body);
                        return resolve(JSON.parse(body));
                    }
                }
            )
        })
    },

    /*********************************************************************************************************** */
    // returns the ID of the newly created intent if successful.
    /*********************************************************************************************************** */
    addIntent: function (intentName, appId, appVersion) {
        let payload = {
            "name": intentName
        }

        return new Promise(function (resolve, reject) {
            request.post(
                `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${appVersion}/intents`,
                {
                    "headers": {
                        "Ocp-Apim-Subscription-Key": process.env.LUIS_PROGRAMMATIC_KEY,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    "body": JSON.stringify(payload)
                }, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    } else {
                        console.log(`Response status code = ${response.statusCode}, status mesage = ${response.statusMessage}`);
                        console.log(body);
                        return resolve(JSON.parse(body));
                    }
                }
            )
        })
    },
    /*********************************************************************************************************** */
    // returns the ID of the newly created example utterance if successful. This overload adds an utterance 
    // with no entities.
    /*********************************************************************************************************** */
    addUtterance: function (intentName, utteranceText, appId, appVersion) {
        let payload = {
            "text": `${utteranceText}`,
            "intentName": `${intentName}`,
            "entityLabels": []
        }

        return new Promise(function (resolve, reject) {
            request.post(
                `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${appVersion}/example`,
                {
                    "headers": {
                        "Ocp-Apim-Subscription-Key": process.env.LUIS_PROGRAMMATIC_KEY,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    "body": JSON.stringify(payload)
                }, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    } else {
                        console.log(`Response status code = ${response.statusCode}, status mesage = ${response.statusMessage}`);
                        console.log(body);
                        return resolve(JSON.parse(body));
                    }
                }
            )
        })
    }

};
// module.exports = authoring;