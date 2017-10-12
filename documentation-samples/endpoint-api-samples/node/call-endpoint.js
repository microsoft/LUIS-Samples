require('dotenv').config();

var request =
    require('request');

var querystring =
    require('querystring');

function
getLuisIntent(utterance) {

    var endpoint =
        "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";

    var luisAppId =
        process.env.LUIS_APP_ID;

    var queryParams = {

        "subscription-key":
        process.env.LUIS_SUBSCRIPTION_KEY,

        "timezoneOffset":
        "0",

        "verbose":
        true,

        "q":
        utterance

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

                var data =
                    JSON.parse(body);


                console.log(`Query:
${data.query}`);

                console.log(`Top Intent:
${data.topScoringIntent.intent}`);

                console.log('Intents:');

                console.log(data.intents);
            }
        });
}

//
getLuisIntent('turn on the left light');


