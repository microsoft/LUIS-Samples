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
    /* returns the list of apps the user has in their subscription. Each app's info is returned in this format:
    [
        {
          "id": "363187f1-c573-46b3-bc4c-ae01d686e68e",
          "name": "MyFirstDummyApp",
          "description": "This is my first dummy application",
          "culture": "en-us",
          "versionsCount": 3,
          "createdDateTime": "2017-01-31T16:15:54Z",
          "endpoints": {
            "PRODUCTION": {
              "versionId": "0.1",
              "isStaging": false,
              "endpointUrl": "DummyUrl",
              "assignedEndpointKey": "",
              "endpointRegion":"westus",
              "publishedDateTime": "2017-02-19T17:09:14Z"
            }
          },
          "endpointHitsCount": 0
        }
    ]
    */ 
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