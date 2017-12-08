require('dotenv').config();
const request = require("requestretry");
//const request = require('request-promise');

const LUIS_SUBSCRIPTION_KEY = process.env.LUIS_SUBSCRIPTION_KEY;
var LUIS_APPLICATION_ID = null; // returned from createNoteApp

// time delay between requests
const delayMS = 500;

// retry recount
const retry = 5;

// we don't want fail or inprogress
var isTrained = (trainingStatus) => {
    var untrainedModels = trainingStatus.filter(model => model.details.status in ['Fail','InProgress'] );
    return (untrainedModels.length===0) ? true : false;
}

// retry reqeust if error or 429 received
var retryStrategy = function (err, response, body) {
    let trained = isTrained(JSON.parse(body));
    console.log("isTrained = " + trained);
    let shouldRetry = err || (response.statusCode === 429) || !isTrained;
    return shouldRetry;
  }

var createNoteApp = async () => {

    try {
        var endpoint = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/customprebuiltdomains";
        
        var body = {
            "domainName": "Note", 
            "culture": "en-us"
        };
        
        var options = {
            uri: endpoint,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': LUIS_SUBSCRIPTION_KEY
            },
            json: true,
            body: body                
        };
        return await request(options);
    
    } catch (err) {
        throw err;
    }    
}
var train = async () => {
    
    try {
        var endpoint = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + LUIS_APPLICATION_ID + "/versions/0.1/train";
        
        var options = {
            uri: endpoint,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': LUIS_SUBSCRIPTION_KEY
            }
        };
        return await request(options);
    
    } catch (err) {
        throw err;
    }    
}

var getTrainStatus = async () => {
    
    try {
        var endpoint = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + LUIS_APPLICATION_ID + "/versions/0.1/train";
        
        var options = {
            uri: endpoint,
            method: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': LUIS_SUBSCRIPTION_KEY
            },
            maxAttempts: retry,
            retryDelay: delayMS,
            retryStrategy: retryStrategy
        };
        return await request(options);
    
    } catch (err) {
        throw err;
    }    
}
var publish = async () => {
    
    try {
        var endpoint = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + LUIS_APPLICATION_ID + "/publish";
        
        var body = {
            "versionId": "0.1",
            "isStaging": false,
            "region": "westus"
         };

        var options = {
            uri: endpoint,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': LUIS_SUBSCRIPTION_KEY,
                "Content-Type":"application/json"
            },
            body:body
        };
        return await request(options);
    
    } catch (err) {
        throw err;
    }    
}
console.log("createapp " + new Date());
createNoteApp()
.then(response => {
    LUIS_APPLICATION_ID = response.body;
    console.log("train " +  new Date());
    return train();
}).then(response => {
    // use retry logic
    console.log("trainstatus " +  new Date());
    return getTrainStatus();
}).then( () => {
    console.log("publish " +  new Date());
    return publish();
}).then( () => {
    console.log("app published"  +  new Date());
}).catch(err => {
    console.log(err);
});