// node 7.x
// uses async/await - promises

var rp = require('request-promise');
var fs = require('fs-extra');
var path = require('path');


// main function to call
var upload = async (config) => {

    try{
    // request options
    config.options = {
        uri: config.uri,
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
        },
        json: true
    };

    config.response = {
        success: {},
        error: {}
    };

    return await getBatchFromFile(config)
        .then(sendBatchToApi)
        .then(response => {
            console.log("upload done");
            return response;
        });
        
    } catch(err){
        return err;        
    }

}
// get json from file - already formatted for this api
var getBatchFromFile = async (config) => {
    try {

        var inFile = await fs.readFile(config.inFile, 'utf-8');
        config.options.body = JSON.parse(inFile);
        config.response.success.getBatchFromFile = true;

        return config;

    } catch (err) {
        console.log(err);
        config.response.error.getBatchFromFile = err;
        return config;
    }
}
// send json as post.body to api
var sendBatchToApi = async (config) => {
    try {

        uploadResponse = await rp.post(config.options);       
        writeFileResponse = await fs.writeFile(config.inFile.replace('.json','.upload.json'),JSON.stringify(uploadResponse), 'utf-8');
        
        config.response.success.sendBatchToApi = {};
        config.response.success.sendBatchToApi.upload = uploadResponse;
        config.response.success.sendBatchToApi.writeFile = writeFileResponse;
        
        return config;
    }
    catch (err) {
        config.response.error.sendBatchToApi = err;
        console.log(JSON.stringify(err));
        return err;
    }
}

module.exports = upload;