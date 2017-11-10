// node 7.x
// uses async/await - promises

var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');
var request = require('requestretry');

// time delay between requests
const delayMS = 500;

// retry recount
const maxRetry = 5;

// retry request if error or 429 received
var retryStrategy = function (err, response, body) {
    let shouldRetry = err || (response.statusCode === 429);
    if (shouldRetry) console.log("retrying add examples...");
    return shouldRetry;
}

// main function to call
var upload = async (config) => {

    try{
      
        // read in utterances
        var entireBatch = await fse.readJson(config.inFile);

        // break items into pages to fit max batch size
        var pages = getPagesForBatch(entireBatch.utterances, config.batchSize);

        var uploadPromises = [];

        // load up promise array
        pages.forEach(page => {
            config.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", config.LUIS_appId).replace("{versionId}", config.LUIS_versionId)
            var pagePromise = sendBatchToApi({
                url: config.uri,
                fullResponse: false,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: page,
                maxAttempts: maxRetry,
                retryDelay: delayMS,
                retryStrategy: retryStrategy
            });

            uploadPromises.push(pagePromise);
        })

        //execute promise array
        
        let results =  await Promise.all(uploadPromises)
        console.log(`\n\nResults of all promises = ${JSON.stringify(results)}`);
        let response = await fse.writeJson(config.inFile.replace('.json','.upload.json'),results);

        console.log("upload done");

    } catch(err){
        throw err;        
    }

}
// turn whole batch into pages batch 
// because API can only deal with N items in batch
var getPagesForBatch = (batch, maxItems) => {

    try{
        var pages = []; 
        var currentPage = 0;

        var pageCount = (batch.length % maxItems == 0) ? Math.round(batch.length / maxItems) : Math.round((batch.length / maxItems) + 1);

        for (let i = 0;i<pageCount;i++){

            var currentStart = currentPage * maxItems;
            var currentEnd = currentStart + maxItems;
            var pagedBatch = batch.slice(currentStart,currentEnd);

            var j = 0;
            pagedBatch.forEach(item=>{
                item.ExampleId = j++;
            });

            pages.push(pagedBatch);

            currentPage++;
        }
        return pages;
    }catch(err){
        throw(err);
    }
}

// send json batch as post.body to API
var sendBatchToApi = async (options) => {
    try {

        var response = await request(options);
        //return {page: options.body, response:response};
        return {response:response};
    }catch(err){
        throw err;
    }   
}   

module.exports = upload;