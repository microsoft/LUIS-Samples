/*-----------------------------------------------------------------------------
Node.js example of finding region when given app ID and subscription key.
-----------------------------------------------------------------------------*/

// NPM Dependencies
var request = require('request-promise');

// To run this sample, change these constants.
const subscriptionKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const appId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

const regions = [
    "eastasia",
    "southeastasia",
    "australiaeast",
    "northeurope",
    "westeurope",
    "eastus",
    "eastus2",
    "southcentralus",
    "westcentralus",
    "westus",
    "westus2",
    "brazilsouth"    
];

var searchRegions = async() => {

    for (var i in regions) {
        try{
            let response =  await request(`https://${regions[i]}.api.cognitive.microsoft.com/luis/v2.0/apps/${appId}?subscription-key=${subscriptionKey}&q=hi`);
            return Promise.resolve(regions[i]);
        }catch(ex){
            //console.log(ex.options.uri);
        }
      }
}

searchRegions().then( (response) => {
    console.log(response);
}).catch(err => {
    console.log(`Error finding region:  ${err.message} `);
});