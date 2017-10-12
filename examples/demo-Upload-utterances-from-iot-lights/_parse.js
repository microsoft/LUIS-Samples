// node 7.x
// built with streams for larger files

const fse = require('fs-extra');
const path = require('path');
const lineReader = require('line-reader');
const Promise = require('bluebird');


// rewrite each items properties and values
function mapEntity(entities) {

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
}

var utterance = function (i, item) {

    let json = {
        "row": i,
        "text": "",
        "intentName": "",
        "entityLabels": {}
    };

    if (!item) return json;

    try {

        json.intentName = item.intent;
        json.text = item.text;
        json.entityLabels = item.entities && item.entities.length ? mapEntity(item.entities) : [];

        return json;

    } catch (err) {
        // do something with error
        console.log("err " + err);
    }

};

// main function to call
// read stream line at a time
// conversion happens in precess.convert_utterance_map file
const convert = async (config) => {

    try{

        var i = 0;

        // get inFile json
        inFileJSON = await fse.readFile(config.inFile, 'utf-8');

        // create out file
        var myOutFile = await fse.createWriteStream(config.outFile, 'utf-8');
        myOutFile.write('[');

        // read 1 utterance
        inFileJSON.utterances.forEach( (item) => {

            // transform utterance from original json to LUIS batch json
            jsonUtterance = utterance(++i, item);

            // write to out stream
            if (i > 1) myOutFile.write(",");
            myOutFile.write(JSON.stringify(jsonUtterance));

        });
        
        myOutFile.write(']');
        myOutFile.end();
        console.log("parse done");
        return config;

    }catch (err) {
        return err;
    }

}

module.exports = convert;