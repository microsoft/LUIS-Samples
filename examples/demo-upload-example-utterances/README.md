# Upload utterances in various formats

These two demo applications take utterances in different formats and parse them into the format required for the LUIS authoring API. The utterances are saved in the `./utterances.json` file. This file is read and sent to the [LUIS examples batch add labels API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09).

Each demo application's README.md states where the data came from and the format of the files being read.

- [demo-upload-utterances-from-exported-luis-app](./demo-upload-utterances-from-exported-luis-app/README.md)
- [demo-upload-utterances-from-exported-querylog](./demo-upload-utterances-from-exported-querylog/README.md)

Each demo application's main file is the [index.js]('./index.js). This file contains the configuration settings. Two additional files contain the code that converts the data to the required format and uploads it.

- [`_parse.js`](./_parse.js) : convert to batch upload API format
- [`_upload.js`](./_upload) : upload JSON to batch label API

Each demo application creates files associated with each step:

- [`utterances.json`](./demo-upload-utterances-from-exported-luis-app/example-files/utterances.json) : batch labels to upload
- [`utterances.upload.json`](./demo-upload-utterances-from-exported-luis-app/example-files/utterances.upload.json) : final response body from upload API

Examples of the files used and produced in the demonstration are in each demo's ./example-files subdirectory.

### Batching Utterances
The demo applications send batches of utterances. Utterances are grouped into pages, then each page is sent. Each batch sent and received are numbered with an "ExampleId" between 0-99. When an utterance fails to be uploaded, this helps you find where the trouble is.

### Prerequisites
The minimum prerequisites to run this sample are:
* Latest Node.js with NPM. [Download it here](https://nodejs.org/en/download/) for free.
* A [trained](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/train-test) and [published](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/publishapp) LUIS Application. 
* We recommend Visual Studio Code for IntelliSense and debugging. [Download it here](https://code.visualstudio.com/) for free.

### Install
Install the Node.js dependencies from NPM in the terminal/command line.

````
> npm install
````

### Change Configuration Settings
In order to use this application, you need to change the values in the index.js file to your own subscription key, app ID, and version ID. 

Open the index.js file, and change these values at the top of the file.


````JavaScript
// TBD: CHANGE THESE VALUES
const LUIS_subscriptionKey = "YOUR_SUBSCRIPTION_KEY"; 
const LUIS_appId = "YOUR_APP_ID";
const LUIS_versionId = "0.1";
````
### Run the application
Run the application from a terminal/command line with Node.js.

````
> node index.js
````
or
````
> npm start
````

### Application progress
While the application is running, the terminal/command line will show progress.

````
> node index.js
intents: ["TurnAllOn","TurnAllOff","None","TurnOn","TurnOff"]
parse done
upload done
process done
````

### LUIS APIs used in this sample
These demo applications use the following LUIS APIs:
- [download query log](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c36) API
- [batch add labels](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) API.

### Format of the JSON for the batch upload
The format of the JSON for the batch upload is noted in the [batch add labels](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) API. It is important to note that the format of the download for query logs is different both in content and format. 

### Use your own private apps
If you incorrectly use an app ID that you do not have permission to upload to, such as any public apps, you will receive an error.

### Intent And Entities are not created if NOT found
Any intent or entity uploaded that is not found in your LUIS app will cause an error. It is important that all intents and entities used in the batch already exist in the app.

### Errors in output file of the application
The final response body from upload API is in the 'utterances.upload.json' file. This file will be an array of responses, one response for each item in the batch. 

Each item in the batch can succeed or fail independent of any other item, so it is important to check the response. 

#### Examples of correctly formatted items:

````JavaScript
// successfully formated item
    {
        "row": 1,
        "text": "go to paris",
        "intentName": "BookFlight",
        "entityLabels": [
            {
                "entityName": "Location::LocationTo",
                "startCharIndex": 6,
                "endCharIndex": 10
            }
        ]
    }
````

#### An example of a successful item upload response:

````JavaScript
// successfully uploaded item
{
    "value": {
        "UtteranceText": "go to paris",
        "ExampleId": -175128
    },
    "hasError": false
}
````

#### Examples of successful request (HTTP 200+) with failed items in the response body:

````JavaScript
// failed uploaded item - don't upload built-ins
{
    "value": null,
    "hasError": true,
    "error": {
        "code": "FAILED",
        "message": "ticket to seattle tomorrowtimezoneOffset=0. Error: The entity extractor builtin.number doesn't exist in the selected application"
    }
}
````

````JavaScript
// failed uploaded item - missing intent
{
    "value": null,
    "hasError": true,
    "error": {
        "code":"FAILED","message":"turn on the left light. Error: The intent classifier TurnOn does not exist in the selected application"
    }
}
````
 
#### Reasons for failed requests (HTTP 400+) other than malformed items
A batch upload may fail for general reasons not related to the batch itself. You will need to investigate the error returned to fix the problem. A list of common issues include:

- public subscription id - you are not allowed to write a batch to this subscription
- incorrect app id
- incorrect version id
- incorrect LUIS API URI

#### Examples of failed requests (HTTP 400+) because of malformed items

Batch upload items (or the whole batch) can result in parsing errors in the LUIS API. These errors are generally returned as HTTP 400 status errors instead of returning a successful response with an array of items, some of which failed.

A list of common issues include for a well-formed batch:

- batch has too many items
- batch includes intent that doesn't exist in app
- batch includes entity that doesn't exist in app
- batch includes prebuilt entity provided by LUIS Prebuilt domains

A malformed batch will also be refused because the JSON can not be parsed as it is. The following JSON examples show some malformed JSON you should avoid.

````JavaScript
// malformed item - entityLabels first array item is present but empty
// fix - should remove {}, empty entityLabels array is fine
{
    "row": 2,
    "text": "ticket to paris",
    "intentName": "BookFlight",
    "entityLabels": [
        {
            
        }
    ]
}
```` 

````JavaScript
// malformed item - malformed JSON - no comma
// fix - add comma after every key:value pair
[
    {
        "text": "Hello"
        "intent": "Greetings"
    },
    {
        "text": "I want bread"
        "intent": "Request"
    }
]
```` 

````JavaScript
// malformed item - malformed JSON - extra comma at end of key:value pair
// while Node.js will ignore this, the LUIS API will not
// fix - remove extra comma
[
    {
        "text": "Hello",
        "intent": "Greetings",
    },
    {
        "text": "I want bread",
        "intent": "Request"
    }
]
````
