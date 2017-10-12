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

        return getApi(config)
        .then(writeFile)
        .then(response => {
          console.log("download done");
          return response;
        });

     } catch(err){
        return err;
    }
}

const writeFile = async (config) => {

  try { 
    config.response.success.writeFile = await fs.writeFile(config.outFile,config.response.success.getApi, 'utf-8');
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
  

module.exports = download;