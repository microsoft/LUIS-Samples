/*-----------------------------------------------------------------------------
This template demonstrates how to use dialogs with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-luis
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// APPINSIGHT: Add underscore for flattening to name/value pairs
var _ = require("underscore");

// APPINSIGHT: Add NPM package applicaitoninsights
let appInsights = require("applicationinsights");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
    
    // APPINSIGHT: Log results to Application Insights
    appInsightsLog(session,args);
    
    session.send('You reached the default message handler. You said \'%s\'.', session.message.text);
});

bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// APPINSIGHT: Set up ApplicationInsights with Web App Bot settings "BotDevAppInsightsKey"
appInsights.setup(process.env.BotDevAppInsightsKey)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true,true)
    .setUseDiskRetryCaching(true)
    .start();

// APPINSIGHT: Get client 
let appInsightsClient = appInsights.defaultClient;

// APPINSIGHT: Log LUIS results to Application Insights
// APPINSIGHT: must flatten as name/value pairs
var appInsightsLog = function(session,args) {
    
    // APPINSIGHT: put bot session and LUIS results into single object
    var data = Object.assign({}, session.message,args);
    
    // APPINSIGHT: ApplicationInsights Trace 
    console.log(data);

    // APPINSIGHT: Flatten data into name/value pairs
    flatten = function(x, result, prefix) {
        if(_.isObject(x)) {
            _.each(x, function(v, k) {
                flatten(v, result, prefix ? prefix + '_' + k : k)
            })
        } else {
            result["LUIS_" + prefix] = x
        }
        return result;
    }

    // APPINSIGHT: call fn to flatten data
    var flattenedData = flatten(data, {})

    // APPINSIGHT: send data to Application Insights
    appInsightsClient.trackEvent({name: "LUIS-results", properties: flattenedData});
}


// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
bot.dialog('TurnOnDialog',
    (session, args) => {
        
        // APPINSIGHT: Log results to Application Insights
        appInsightsLog(session,args);
        
        // Resolve and store any HomeAutomation.Device entity passed from LUIS.
        var intent = args.intent;
        var device = builder.EntityRecognizer.findEntity(intent.entities, 'HomeAutomation.Device');

        // Turn on a specific device if a device entity is detected by LUIS
        if (device) {
            session.send('Ok, turning on the %s.', device.entity);
            // Put your code here for calling the IoT web service that turns on a device
        } else {
            // Assuming turning on lights is the default
            session.send('Ok, turning on the lights');
            // Put your code here for calling the IoT web service that turns on a device
        }
        session.endDialog();
    }
).triggerAction({
    matches: 'HomeAutomation.TurnOn'
})

bot.dialog('TurnOffDialog',
    (session, args) => {

        // APPINSIGHT: Log results to Application Insights
        appInsightsLog(session,args);

        // Resolve and store any HomeAutomation.Device entity passed from LUIS.
        var intent = args.intent;
        var device = builder.EntityRecognizer.findEntity(intent.entities, 'HomeAutomation.Device');

        // Turn off a specific device if a device entity is detected by LUIS
        if (device) {
            session.send('Ok, turning off the %s.', device.entity);
            // Put your code here for calling the IoT web service that turns off a device
        } else {
            // Assuming turning off lights is the default
            session.send('Ok, turning off the lights.');
            // Put your code here for calling the IoT web service that turns off a device
        }
        session.endDialog();
    }
).triggerAction({
    matches: 'HomeAutomation.TurnOff'
})