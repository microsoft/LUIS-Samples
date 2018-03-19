const request = require("request-promise");

// authoring key, available in luis.ai under Account Settings
const LUIS_authoringKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

var createAppFromPrebuiltDomainPromise = async () => {
    try {
        return await request.post({
            uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/customprebuiltdomains",
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': LUIS_authoringKey
            },
            json: true,
            body: {
                "domainName": "Web", 
                "culture": "en-us"
            }
        });
    } catch (err) {
        throw err;
    }
}

var deleteApp = async(appID) => {
    try {

        let uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + appID;
        console.log(uri);
        return await request.post({
            uri: uri,
            method: 'DELETE',
            headers: {
                'Ocp-Apim-Subscription-Key': LUIS_authoringKey
            }
        });
    } catch (err) {
        throw err;
    }
}

createAppFromPrebuiltDomainPromise().then((results)=>{
    console.log(results);
    return deleteApp(results);
}).then(results2 => {
    console.log("done");
}).catch(err => {
    console.log(err);
})
