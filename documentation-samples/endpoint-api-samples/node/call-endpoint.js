require('dotenv').config();

var request = require('request');
var querystring = require('querystring');

function getLuisIntent(utterance) {
    var endpoint =
        "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";

    // Set the LUIS_APP_ID environment variable 
    // to df67dcdb-c37d-46af-88e1-8b97951ca1c2, which is the ID
    // of a public sample application.    
    var luisAppId = process.env.LUIS_APP_ID;

    // Set the LUIS_SUBSCRIPTION_KEY environment variable
    // to the value of your Cognitive Services subscription key
    var queryParams = {
        "subscription-key": process.env.LUIS_SUBSCRIPTION_KEY,
        "timezoneOffset": "0",
        "verbose":  true,
        "q": utterance
    }

    var luisRequest =
        endpoint + luisAppId +
        '?' + querystring.stringify(queryParams);

    request(luisRequest,
        function (err,
            response, body) {
            if (err)
                console.log(err);
            else {
                var data = JSON.parse(body);

                console.log(`Query: ${data.query}`);
                console.log(`Top Intent: ${data.topScoringIntent.intent}`);
                console.log('Intents:');
                console.log(data.intents);
            }
        });
}

// Pass an utterance to the sample LUIS app
getLuisIntent('turn on the left light');


