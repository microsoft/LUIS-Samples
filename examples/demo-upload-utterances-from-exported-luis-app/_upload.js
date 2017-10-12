// node 7.x
// uses async/await - promises

var rp = require('request-promise');
var fs = require('fs-extra');
var path = require('path');


// main function to call
var upload = async (config) => {

    try{
        // request options
        //config.options = 

        config.response = {
            success: {
                pages:[]
            },
            error: {
                pages:[]
            }
        };

        var options = {
            uri: config.uri,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
            },
            json: true
        };        
        var uploadPromises = [];

        var entireBatch = await getBatchFromFile(config);

        var batches = [];

        var currentPage = 0;
        var pageCount = (entireBatch.length % config.batchSize == 0) ? Math.round(entireBatch.length / config.batchSize) : Math.round((entireBatch.length / config.batchSize) + 1);

        // load up promise array
        for (let i = 0;i<pageCount;i++){

            var currentStart = currentPage * config.batchSize;
            var currentEnd = currentStart + config.batchSize;
            var newBatch = entireBatch.slice(currentStart,currentEnd);

            batches.push(newBatch);

            var pagePromise = sendBatchToApi({
                uri: config.uri,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: newBatch
            });

            uploadPromises.push(pagePromise);

            currentPage++;
        }

        //execute promise array
        
        Promise.all(uploadPromises)
        .then(results => {
            return writeResponsesToFile(config.inFile.replace('.json','.upload.json'), results);
        }).then(response => {
            console.log("upload done - success");
        }).catch(err => {
            console.log("upload done - success - failure");
            console.log(err);
        });

    } catch(err){
        throw err;        
    }

}

// get json from file - already formatted for this API
var getBatchFromFile = async (config) => {
    try {

        var inFile = await fs.readFile(config.inFile, 'utf-8');

        return JSON.parse(inFile);

    } catch (err) {
        throw err;
    }
}
// send json batch as post.body to API
var sendBatchToApi = async (options) => {
    try {

        var response =  await rp.post(options);
        console.log(JSON.stringify({body: options.body, response:response}));
        return response;

    }catch(err){
        throw err;
    }   
}   

var writeResponsesToFile = async(outFile, responses)=>{

    try{
        return await fs.writeFile(outFile,JSON.stringify(responses), 'utf-8');
    }
    catch (err) {
        return err;
    }
}


module.exports = upload;