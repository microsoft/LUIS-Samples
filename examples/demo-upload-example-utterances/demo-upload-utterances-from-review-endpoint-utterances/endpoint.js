/*

    This file sends utterances from the endpoint-utterances-Human-Resources.json file to the endpoint. This is useful if you want to reconstruct an app. The 
    app has two pieces of data to reconstruct the state. The first is the exported JSON file that defines the app model. The second is any endpoint 
    utterances for review. 

    1. API to get app: 
        https://{region}.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appID}/versions/{versionID}/export?subscription-key={authoringKey}

    2. API to get reviewable endpoing utterances:
        https://{ergion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appID}/versions/{versionID}/examples[?skip][&take] 

    Once you have the app imported (from step 1 above) into LUIS, trained, and published as well as a JSON file of the reviewable endpoint utterances (from step 2 above), 
    you need the appID, versionID, region, and endpoint key for this script. This script takes the JSON file of reviewable endpoint
    uttances and submits them to the endpoint. 

    This script uses the retry logic in case you are using the F0 tier for Language Understand that has a limit of 5 queries per second. 
*/

var querystring = require('querystring');
const request = require("requestretry");
const https = require("https");

// Step 2 from above - get list and save as JSON 
var endpointUtteraces = require("./endpoint-utterances-Human-Resources.json");

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
const appID = "1bba985f-d416-40a4-a25e-7638a1aacbea";

// NOTE: Replace this example LUIS application version number with the version number of your LUIS application.
const appVersion = "0.1";

// NOTE: Replace this example LUIS endpoint key with a valid key.
const endpointKey = "85a91a11db924332b4beee0b3ac083be";

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
        // push utterance text into array
        const utteranceArray = endpointUtteraces.map(endpointUtterance => {
            return endpointUtterance.text
        })

        // send each utterance to endpoint
        for (const utterance of utteranceArray) {
            var queryResponse = await sendQueryToEndpoint(utterance);
            responseArray.push(queryResponse.body);
        }

        console.log(responseArray);

    }catch(err){
        console.log(err);
    }
}

main();

