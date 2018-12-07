# LUIS Notes app with Node.js

This example creates a LUIS app using the prebuilt domain "Note", then it trains, publishes, and queries the endpoint for the new app.

If you run this example more than once, you need to delete the Note app before running this example again. 

## Prerequisites
* In .env, change the `LUIS_SUBSCRIPTION_KEY` value to your own LUIS subscription key found under your User account in [LUIS.ai](https://www.luis.ai). 
* [Docker](https://www.docker.com/) or [Nodejs](https://nodejs.org)

## Run via Docker
You can run this example from a Docker container.

1. On the command-line, build the Docker image:

```
docker build --no-cache -t notes-app-node .
```

2. On the command-line, run the Docker image:

```
docker run -it --rm --name notes-app-node notes-app-node tail  
```

## Run via Node
You can run this example from Node.js.

1. On the command-line, install dependencies:

```
npm install
```

3. On the command-line, run the file:

```
npm start
```

4. App output

The [notes.log](notes.log) file has a log of the app running including the three LUIS endpoint queries: 

```
npm start

> node@1.0.0 start /Users/piotrblazejewicz/git/LUIS-Samples/examples/notes-app/node
> node notes.js

createapp Wed Dec 05 2018 21:02:11 GMT+0100 (CET)
train Wed Dec 05 2018 21:02:39 GMT+0100 (CET)
trainstatus Wed Dec 05 2018 21:02:40 GMT+0100 (CET)
Wed, 05 Dec 2018 20:02:41 GMT shouldRetry = true
Wed, 05 Dec 2018 20:02:42 GMT shouldRetry = true
Wed, 05 Dec 2018 20:02:44 GMT shouldRetry = true
Wed, 05 Dec 2018 20:02:46 GMT shouldRetry = false
publish Wed Dec 05 2018 21:02:47 GMT+0100 (CET)
create grocery list Wed Dec 05 2018 21:02:49 GMT+0100 (CET)
{
    "id": "47d98fde-ec6e-4aa2-acce-7e5e8692ad70",
    "name": "Note",
    "description": "The Note domain provides intents and entities related to finding, editing and creating notes.",
    "culture": "en-us",
    "usageScenario": "",
    "domain": "",
    "versionsCount": 1,
    "createdDateTime": "2018-12-05T20:02:12Z",
    "endpoints": {
        "PRODUCTION": {
            "versionId": "0.1",
            "isStaging": false,
            "endpointUrl": "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/47d98fde-ec6e-4aa2-acce-7e5e8692ad70",
            "region": null,
            "assignedEndpointKey": null,
            "endpointRegion": "westus",
            "publishedDateTime": "2018-12-05T20:02:48Z",
            "failedRegions": null
        }
    },
    "endpointHitsCount": 0,
    "activeVersion": "0.1",
    "ownerEmail": "peter.blazejewicz@example.com"
}
add eggs to grocery list Wed Dec 05 2018 21:02:50 GMT+0100 (CET)
{
    "id": "47d98fde-ec6e-4aa2-acce-7e5e8692ad70",
    "name": "Note",
    "description": "The Note domain provides intents and entities related to finding, editing and creating notes.",
    "culture": "en-us",
    "usageScenario": "",
    "domain": "",
    "versionsCount": 1,
    "createdDateTime": "2018-12-05T20:02:12Z",
    "endpoints": {
        "PRODUCTION": {
            "versionId": "0.1",
            "isStaging": false,
            "endpointUrl": "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/47d98fde-ec6e-4aa2-acce-7e5e8692ad70",
            "region": null,
            "assignedEndpointKey": null,
            "endpointRegion": "westus",
            "publishedDateTime": "2018-12-05T20:02:48Z",
            "failedRegions": null
        }
    },
    "endpointHitsCount": 0,
    "activeVersion": "0.1",
    "ownerEmail": "peter.blazejewicz@example.com"
}
check off eggs from grocery list Wed Dec 05 2018 21:02:51 GMT+0100 (CET)
{
    "id": "47d98fde-ec6e-4aa2-acce-7e5e8692ad70",
    "name": "Note",
    "description": "The Note domain provides intents and entities related to finding, editing and creating notes.",
    "culture": "en-us",
    "usageScenario": "",
    "domain": "",
    "versionsCount": 1,
    "createdDateTime": "2018-12-05T20:02:12Z",
    "endpoints": {
        "PRODUCTION": {
            "versionId": "0.1",
            "isStaging": false,
            "endpointUrl": "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/47d98fde-ec6e-4aa2-acce-7e5e8692ad70",
            "region": null,
            "assignedEndpointKey": null,
            "endpointRegion": "westus",
            "publishedDateTime": "2018-12-05T20:02:48Z",
            "failedRegions": null
        }
    },
    "endpointHitsCount": 0,
    "activeVersion": "0.1",
    "ownerEmail": "peter.blazejewicz@example.com"
}
done
```