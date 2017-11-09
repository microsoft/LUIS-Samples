
/*-----------------------------------------------------------------------------

This bot use dialogs with a LuisRecognizer that integrates with a LUIS app.
The LUIS app identifies intents and entities from user messages, or utterances.

Intents map utterances to functionality in your bot.
In this example, the intents provide the following mappings:
 * The App.Create intent maps to the CreateApp dialog
 * The App.Delete intent maps to the DeleteApp dialog
 * The App.ListApps intent maps to the ListApps dialog

-----------------------------------------------------------------------------*/
var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');


const authoring = require('./_authoring');
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});


// Create chat connector for communicating with the Bot Framework Service
// See https://aka.ms/node-env-var for information on setting environment variables in launch.json if you are using VSCode
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());


// Create your bot with a function to receive messages from the user.
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send("Hi... I'm the LUIS Authoring Bot. Here are some things I understand: \n * List my apps \n * Create an app. \n * Create an intent \n * Add an utterance \n * train");

    // If the object for storing notes in session.userData doesn't exist yet, initialize it
    if (!session.userData.newApps) {
        session.userData.newApps = {};
        console.log("initializing userData.newApps in default message handler");
    }
});

// Add global LUIS recognizer to bot
var luisAppUrl = process.env.LUIS_APP_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/<YOUR_APP_ID>?subscription-key=<YOUR_KEY>';
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));


// *************************************************************************************************************
// Add first run dialog that loads the list of apps.
// *************************************************************************************************************

bot.dialog('firstRun', [

    function (session, args, next) {
        // Update version number and start Prompts
        // - The version number needs to be updated first to prevent re-triggering 
        //   the dialog. 
        session.userData.version = 1.0;
        if (!process.env.LUIS_PROGRAMMATIC_KEY) {
            builder.Prompts.text(session, "Hello... I'm the LUIS Authoring Bot. Tell me your Programmatic key and we can get started. You can find your programmatic key at https://www.luis.ai under Account settings.");                        
        } else {
            session.send("I'm looking up your list of apps...");
            next();
        }
    },

    function (session, results) {
        // We'll save the user's key and send them an initial greeting. All 
        // future messages from the user will be routed to other dialogs based on the intent detected, or the default dialog if no dialog matches the intent.
        session.userData.programmaticKey = results.response;

        // Get the user's list of apps from LUIS
        authoring.listApps().then(
            response => {
                session.userData.luisAppList = response;
                console.log(`Found ${appCount(response)} apps.`);
                session.endDialog("I've loaded your list of apps, so we can get started. Here are some things I understand: \n * List my apps \n * Create an app. \n * Delete an app \n * Add an intent \n * Add an utterance", session.userData.programmaticKey);

            },
            error => {
                session.endDialog(`error: ${error.message}`);
            }
        )
    }
]).triggerAction({
    onFindAction: function (context, callback) {
        // Trigger dialog if the users version field is less than 1.0
        // - When triggered we return a score of 1.1 to ensure the dialog is always triggered.
        var ver = context.userData.version || 0;
        var score = ver < 1.0 ? 1.1 : 0.0;
        callback(null, score);
    },
    onInterrupted: function (session, dialogId, dialogArgs, next) {
        // Prevent dialog from being interrupted.
        session.send("Sorry... We need you to provide your Programmatic key first.");
    }
});


/*****************************************************************************************************************
// CreateNewApp dialog
 *****************************************************************************************************************/
bot.dialog('CreateNewApp', [
    function (session, args, next) {

        // Resolve and store any App.Name entity passed from LUIS.
        var intent = args.intent;
        var name = builder.EntityRecognizer.findEntity(intent.entities, 'App.Name');

        var newLuisApp = session.dialogData.newLuisApp = {
            name: name ? name.entity : null,
        };

        // Prompt for title
        if (!newLuisApp.name) {
            builder.Prompts.text(session, 'What would you like to call your app?');
        } else {
            next();
        }
    },
    function (session, results, next) {
        var newLuisApp = session.dialogData.newLuisApp;
        if (results.response) {
            newLuisApp.name = results.response;
        }

        // Prompt for the app culture -- TODO: get from API
        cultures = ["en-us", "zh-cn", "fr-fr", "fr-ca", "es-es", "es-mx", "it-it", "de-de", "ja-jp", "pt-br", "ko-kr", "nl-nl"];
        if (!newLuisApp.culture) {
            builder.Prompts.choice(session, 'Choose a culture for your app', cultures);
        } else {
            next();
        }
    },
    function (session, results) {
        var newLuisApp = session.dialogData.newLuisApp;
        if (results.response) {
            newLuisApp.culture = results.response.entity;
        }

        // If the object for storing app data in session.userData doesn't exist yet, initialize it
        if (!session.userData.newApps) {
            session.userData.newApps = {};
            console.log("initializing session.userData.newApps in CreateNewApp dialog");
        }

        // Call the Authoring API to create the app
        authoring.createApp(newLuisApp.name, newLuisApp.culture).then(
            response => {
                if (response.statusCode) {
                    session.endDialog(`Error ${response.statusCode}: ${response.message}`)
                }
                if (response.error) {
                    session.endDialog(`Couldn\'t add app ${newLuisApp.name}: ` + response.error.message);
                } else {
                    // body contains an App ID for the newly created LUIS App
                    newLuisApp.id = response;
                    session.userData.currentAppName = newLuisApp.name;
                    session.userData.currentAppId = newLuisApp.id;
                    session.endDialog(`Created app named ${newLuisApp.name} with App ID = ${newLuisApp.id} \n * [open app in luis.ai](https://www.luis.ai/applications/${newLuisApp.id}/versions/0.1/overview)`);
                }
            },
            error => {
                session.endDialog(`error: ${error.message}`);
            }
        )
    }
]).triggerAction({
    matches: 'App.Create',
    confirmPrompt: "This will cancel the creation of the app you started. Are you sure?"
}).cancelAction('cancelCreateNote', "Create app canceled.", {
    matches: /^(cancel|nevermind)/i,
    confirmPrompt: "Are you sure?"
});

/*****************************************************************************************************************
// DeleteApp dialog
 *****************************************************************************************************************/
bot.dialog('DeleteApp', [
    function (session, args, next) {
        if (appCount(session.userData.newApps) > 0) {
            // Resolve and store any App.Name entity passed from LUIS.
            var name;
            var intent = args.intent;
            var entity = builder.EntityRecognizer.findEntity(intent.entities, 'App.Name');
            if (entity) {
                // Verify that the title is in our set of notes.
                name = builder.EntityRecognizer.findBestMatch(session.userData.newApps, entity.entity);
            }

            // Prompt for name of app to delete
            // TODO: Get from API
            if (!name) {
                builder.Prompts.choice(session, 'Which app would you like to delete?', session.userData.newApps);
            } else {
                next({ response: name });
            }
        } else {
            session.endDialog("No apps to delete.");
        }
    },
    function (session, results) {
        delete session.userData.newApps[results.response.entity];
        session.endDialog("Deleted the '%s' app.", results.response.entity);
    }
]).triggerAction({
    matches: 'App.Delete'
}).cancelAction('cancelDeleteApp', "Ok - canceled app deletion.", {
    matches: /^(cancel|nevermind)/i
});

/*****************************************************************************************************************
// ListApps dialog
 *****************************************************************************************************************/
bot.dialog('ListApps', [
    function (session, args, next) {
        if (appCount(session.userData.luisAppList) > 0) {
            stringToPrint = "";
            session.userData.luisAppList.forEach(function (element) {
                stringToPrint += `* ${element.name}\n`;
            });
            session.endDialog(stringToPrint);
        } else {
            session.endDialog("No apps to list.");
        }
    }
]).triggerAction({
    matches: 'App.ListApps'
}).cancelAction('cancelListApps', "Ok.", {
    matches: /^(cancel|nevermind)/i
});


/*****************************************************************************************************************
// Helper functions
 *****************************************************************************************************************/
// Helper function to count the number of apps stored in session.userData.luisAppList
function appCount(Apps) {

    var i = 0;
    for (var name in Apps) {
        i++;
    }
    return i;
}

// Helper function to create list of app names stored in session.userData.luisAppList
function getAppListNames(luisAppList) {

    var appNames = [];
    luisAppList.forEach(function (element) {
        appNames.push(element.name);
    });
    return appNames;
}

// Helper function to get the ID of the app with the specifed name
function getAppIdFromList(appName, luisAppList) {
   var id = "";
    luisAppList.forEach(function(element) {
        if (element.name === appName ) {
            id = element.id;
        }
    }, this);

    if (id != "") {
        return id;
    } else {
        console.log(`I couldn't find an app named "${appName}".`);
    }

}

/*****************************************************************************************************************
// AddIntent dialog
 *****************************************************************************************************************/
bot.dialog('AddIntent', [
    function (session, args, next) {

        // Resolve and store any Intent.Name entity passed from LUIS.
        var intentName;
        var intent = args.intent;
        var entity = builder.EntityRecognizer.findEntity(intent.entities, 'Intent.Name');
        if (entity) {
            intentName = entity;
            session.dialogData.intentName = intentName;

        }
        var listOfAppNames = getAppListNames(session.userData.luisAppList);
        builder.Prompts.choice(session, "Which app do you want to add an intent to?", listOfAppNames);

    },
    function (session, results, next) {
        session.userData.currentAppName = results.response.entity;
        // Get the app id based on the name we got.
        session.userData.currentAppId = getAppIdFromList(session.userData.currentAppName, session.userData.luisAppList);
        builder.Prompts.text(session, "What's the name of the intent to add?");
    },
    function (session, results, next) {
        // We have a name of an intent so call the Authoring API to add the intent
        authoring.addIntent(results.response, session.userData.currentAppId, "0.1").then(  // TODO: don't hardcode "0.1"
            response => {
                if (response.statusCode) {
                    session.endDialog(`Error ${response.statusCode}: ${response.message}`)
                }
                if (response.error) {
                    session.endDialog(`Couldn\'t add intent ${results.response}: ` + response.error.message);
                } else {
                    // body contains an ID for the newly created intent
                    session.userData.lastAddedIntentID = response;
                    session.endDialog(`Added intent named ${results.response} to app **${session.userData.currentAppName}**\n * [open app in luis.ai](https://www.luis.ai/applications/${session.userData.currentAppId}/versions/0.1/intents/${session.userData.lastAddedIntentID})`);
                }
            },
            error => {
                session.endDialog(`error: ${error.message}`);
            }
        )
    }
]).triggerAction({
    matches: 'Intents.Add'
}).cancelAction('cancelListApps', "Ok.", {
    matches: /^(cancel|nevermind)/i
});

/*****************************************************************************************************************
// AddUtterance dialog
 *****************************************************************************************************************/
bot.dialog('AddUtterance', [
    function (session, args, next) {

        // Resolve and store any Intent.Name entity passed from LUIS.
        var intentName;
        var intent = args.intent;
        var entity = builder.EntityRecognizer.findEntity(intent.entities, 'Intent.Name');
        if (entity) {
            intentName = entity;
            session.dialogData.intentName = intentName;
            next({ response: intentName });
        }

        //if (!session.userData.currentAppName) {
        // They need to be asked which app they want to add the intent to. So launch another dialog which will end with an app picked as a result.
        //    builder.Prompts.choice(session, "Which app do you want to add it to?", session.userData.luisAppList)
        //} else {
        // Assume we've used that app so we're going to write an intent to it. 
        // Prompt for intent name.
        builder.Prompts.text(session, "What's the name of the intent to add the utterance to?");
        //}

    },
    function (session, results, next) {
        // We have a name of an intent, so prompt for the utterance the utterance to it.
        session.dialogData.intentName = results.response;
        // Prompt for the utterance text
        builder.Prompts.text(session, "What's the text of the utterance?");
    },
    function (session, results, next) {
        //  add the utterance to it.
        session.dialogData.utteranceText = results.response;

        // Call the Authoring API to create the app
        authoring.addUtterance(session.dialogData.intentName, session.dialogData.utteranceText, session.userData.currentAppId, "0.1").then(  // TODO: don't hardcode "0.1"
            response => {
                if (response.statusCode) {
                    session.endDialog(`Error ${response.statusCode}: ${response.message}`)
                }
                if (response.error) {
                    session.endDialog(`Couldn\'t add utterance ${results.response}: ` + response.error.message);
                } else {
                    // body contains an ID for the newly created intent
                    session.userData.lastAddedUtteranceID = response.ExampleId;
                    session.endDialog(`Added utterance with text "${response.UtteranceText}" to intent **${session.dialogData.intentName}** in the app **${session.userData.currentAppName}**\n * [open app in luis.ai](https://www.luis.ai/applications/${session.userData.currentAppId}/versions/0.1/intents/${session.userData.lastAddedIntentID})`);
                }
            },
            error => {
                session.endDialog(`error: ${error.message}`);
            }
        )
    }
]).triggerAction({
    matches: 'Utterance.Add'
}).cancelAction('cancelAddUtterance', "Ok.", {
    matches: /^(cancel|nevermind)/i
});


/********************************************************************************************************************************** */
// Dialog to ask to choose a LUIS app to work with
bot.dialog('chooseLUISApp', [
    function (session) {
        builder.Prompts.choice(session, "Please choose one of the following LUIS apps in your subscription.", getAppListNames());
    },
    function (session, results) {
        session.endDialogWithResult(results.response.entity);
    }
]);