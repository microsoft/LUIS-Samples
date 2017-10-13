// node 7.x
// built with streams for larger files

const fse = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');

function listOfIntents(intents){
    return intents.reduce(function (a, d) {
        if (a.indexOf(d.intentName) === -1) {
        a.push(d.intentName);
        }
        return a;
    }, []);

}
// rewrite each items properties and values
function mapEntity(entities) {

    try{

    
    return entities.map(entity => {

        // create new properties
        entity.entityName = entity.entity;
        entity.startCharIndex = entity.startPos;
        entity.endCharIndex = entity.endPos;

        // delete old properties
        delete entity.startPos;
        delete entity.endPos;
        delete entity.entity;

        return entity;

    });
    }catch(err){
        throw(err);
    };
}

// remove 'builtin.' entities
function isNotBuiltin(entity) {
    // only custom entities
    // don't include builtin types 
    if (entity.entityName.indexOf('builtin.',0)==-1){
        return entity;
    }
}

var utterance = function (item) {

    let json = {
        "text": "",
        "intentName": "",
        "entityLabels": {}
    };

    if (!item) return json;

    try {

        json.intentName = item.intent;
        json.text = item.text;
        json.entityLabels = item.entities && item.entities.length ? mapEntity(item.entities) : [];
        if(json.entityLabels.length>0){
            json.entityLabels = json.entityLabels.filter(isNotBuiltin);
        }
        return json;

    } catch (err) {
        // do something with error
        console.log("err " + err);
        throw err;
    }

};

// main function to call
// read stream line at a time
// conversion happens in precess.convert_utterance_map file
const convert = async (config) => {

    try{
        var firstRecord = true;

        // get inFile json
        inFile = await fse.readFile(config.inFile, 'utf-8');
        inFileJSON = JSON.parse(inFile);

        // create out file
        //var myOutFile = await fse.createFile(config.outFile, 'utf-8');
        var utterances = [];

        // read 1 utterance
        inFileJSON.utterances.forEach( (item) => {    

            // transform utterance from original json to LUIS batch json
            utterances.push(utterance(item));
        });

        console.log("intents: " + JSON.stringify(listOfIntents(utterances)));
        
        await fse.writeJson(config.outFile, { "parsed": new Date().toLocaleString(),"utterances": utterances});

        console.log("parse done");
        return config;

    }catch (err) {
        throw err;
    }

}

module.exports = convert;