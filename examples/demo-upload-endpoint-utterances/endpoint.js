/*

    This file sends utterances from the endpoint-utterances-Human-Resources.json file to the endpoint. This is useful if you want to reconstruct an app. 

    you need the appID, versionID, region, and endpoint key for this script. This script takes the JSON file of reviewable endpoint
    uttances and submits them to the endpoint. 

    This script uses the retry logic in case you are using the F0 tier for Language Understand that has a limit of 5 queries per second. 
*/

var querystring = require('querystring');
const request = require("requestretry");
const https = require("https");

/* all utterances up through the Sentiment tutorial in series */
const endpointUtterances = [
    "I'm looking for a job with Natural Language Processing",
    "I want to cancel on March 3",
    "When were HRF-123456 and hrf-234567 published in the last year?",
    "shift 123-45-6789 from Z-1242 to T-54672",
    "Please relocation jill-jones@mycompany.com from x-2345 to g-23456",
    "Here is my c.v. for the programmer job",
    "This is the lead welder paperwork.",
    "does form hrf-123456 cover the new dental benefits and medical plan",
    "Jill Jones work with the media team on the public portal was amazing",
];

// time delay between requests
const delayMS = 5000;

// retry recount
const retry = 20;

// retry reqeust if error or 429 received
var retryStrategy = function (err, response, body) {
    let shouldRetry = err || (response.statusCode === 429);
    if (shouldRetry) console.log("retry ");
    return shouldRetry;
}

var httpAgent = new https.Agent()
httpAgent.maxSockets = 1;

// NOTE: Replace this example LUIS application ID with the ID of your LUIS application.
const appID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

// NOTE: Replace this example LUIS application version number with the version number of your LUIS application.
const appVersion = "0.1";

// NOTE: Replace this example LUIS endpoint key with a valid key.
const endpointKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

const region = "westus";

var sendQueryToEndpoint = async(utterance) =>  {

    var queryParams = querystring.stringify({
        "subscription-key": endpointKey,
        "q": utterance
    });

    var luisRequest = `https://${region}.api.cognitive.microsoft.com/luis/v2.0/apps/${appID}?${queryParams}`;

    console.log(luisRequest);

    /*
        additional options allow 
        request to manage F0 pricing tier
        limitations 
    */
    var options = {
        uri: luisRequest,
        headers: {
            'Connection': 'keep-alive'
        },
        maxAttempts: retry,
        retryDelay: delayMS,
        retryStrategy: retryStrategy,
        resolveWithFullResponse: true,
        timeout: 60000, 
        pool: httpAgent 
    };

    return await request.get(options);
}

// capture responses here
var responseArray = [];

var main = async () => {
    try{
        // send each utterance to endpoint
        for (const utterance of endpointUtterances) {
            var queryResponse = await sendQueryToEndpoint(utterance);
            responseArray.push(queryResponse.body);
        }
        console.log(responseArray);

    }catch(err){
        console.log(err);
    }
}

main();

