// node 7.x
// uses async/await - promises

var rp = require('request-promise');
var fs = require('fs-extra');
var path = require('path');

const download = async (config) => {

    try{

      config.options = {
        uri: config.uri,
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
        }
      };
      
        config.response = {
            success: {},
            error: {}
        };

        let responseCSV = await rp(config.options);
        await fs.writeFile(config.outFile, responseCSV,"utf-8");
/*
        return getApi(config)
        .then(writeFile)
        .then(response => {
          console.log("download done");
          return response;
        });
        */
        console.log("download done");
        return;
     } catch(err){
        return err;
    }
}
/*
const writeFile = async (config) => {

  try { 
    config.response.success.writeFile = await fs.writeJson(config.outFile,{ "downloaded": new Date().toLocaleString(),"utterances": utterances}
      config.response.success.getApi, 'utf-8');
    return config;
  }
  catch (err) {
    config.response.error.writeFile = err;
    return config;
  }
}

const getApi = async (config) => {
  try {
    config.response.success.getApi = await rp(config.options);
    return config;
  }
  catch (err) {
    config.response.error.getApi = err;
    return config;
  }
}
*/  

module.exports = download;