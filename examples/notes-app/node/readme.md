# LUIS Notes app with Node.js

This example creates a LUIS app using the prebuilt domain "Note", then it trains, publishes, and queries the endpoint for the new app.

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
> node@1.0.0 start C:\Users\v-geberr\repos\LUIS-Samples\LUIS-Samples\examples\notes-app\node
> node notes.js

createapp Fri Dec 08 2017 14:11:04 GMT-0800 (Pacific Standard Time)
train Fri Dec 08 2017 14:12:00 GMT-0800 (Pacific Standard Time)
trainstatus Fri Dec 08 2017 14:12:00 GMT-0800 (Pacific Standard Time)
Fri, 08 Dec 2017 22:12:00 GMT shouldRetry = true
Fri, 08 Dec 2017 22:12:01 GMT shouldRetry = true
Fri, 08 Dec 2017 22:12:03 GMT shouldRetry = true
Fri, 08 Dec 2017 22:12:04 GMT shouldRetry = true
Fri, 08 Dec 2017 22:12:05 GMT shouldRetry = true
Fri, 08 Dec 2017 22:12:07 GMT shouldRetry = false
publish Fri Dec 08 2017 14:12:07 GMT-0800 (Pacific Standard Time)
create grocery listFri Dec 08 2017 14:12:12 GMT-0800 (Pacific Standard Time)
{
  "query": "create grocery list",
  "topScoringIntent": {
    "intent": "Note.Create",
    "score": 0.8651035
  },
  "intents": [
    {
      "intent": "Note.Create",
      "score": 0.8651035
    },
    {
      "intent": "None",
      "score": 0.0163443815
    },
    {
      "intent": "Note.ReadAloud",
      "score": 0.009816828
    },
    {
      "intent": "Note.AddToNote",
      "score": 0.00560676353
    },
    {
      "intent": "Note.DeleteNoteItem",
      "score": 0.00371645321
    },
    {
      "intent": "Note.Delete",
      "score": 0.00330672273
    },
    {
      "intent": "Note.CheckOffItem",
      "score": 0.00189848093
    },
    {
      "intent": "Note.Confirm",
      "score": 0.00120945717
    },
    {
      "intent": "Note.ShowNext",
      "score": 0.0003310441
    },
    {
      "intent": "Note.Clear",
      "score": 5.698773E-05
    }
  ],
  "entities": []
}
add eggs to grocery listFri Dec 08 2017 14:12:13 GMT-0800 (Pacific Standard Time)
{
  "query": "add eggs to grocery list",
  "topScoringIntent": {
    "intent": "Note.AddToNote",
    "score": 0.9712683
  },
  "intents": [
    {
      "intent": "Note.AddToNote",
      "score": 0.9712683
    },
    {
      "intent": "None",
      "score": 0.0210856944
    },
    {
      "intent": "Note.ReadAloud",
      "score": 0.008423261
    },
    {
      "intent": "Note.DeleteNoteItem",
      "score": 0.00475714169
    },
    {
      "intent": "Note.Delete",
      "score": 0.00197099545
    },
    {
      "intent": "Note.CheckOffItem",
      "score": 0.0010897282
    },
    {
      "intent": "Note.Confirm",
      "score": 0.000608205737
    },
    {
      "intent": "Note.Create",
      "score": 0.0003649412
    },
    {
      "intent": "Note.ShowNext",
      "score": 0.000338386919
    },
    {
      "intent": "Note.Clear",
      "score": 0.000153648682
    }
  ],
  "entities": []
}
check off eggs from grocery listFri Dec 08 2017 14:12:15 GMT-0800 (Pacific Standard Time)
{
  "query": "check off eggs from grocery list",
  "topScoringIntent": {
    "intent": "Note.DeleteNoteItem",
    "score": 0.462626785
  },
  "intents": [
    {
      "intent": "Note.DeleteNoteItem",
      "score": 0.462626785
    },
    {
      "intent": "Note.CheckOffItem",
      "score": 0.0225065779
    },
    {
      "intent": "None",
      "score": 0.0153339384
    },
    {
      "intent": "Note.ReadAloud",
      "score": 0.0103968615
    },
    {
      "intent": "Note.AddToNote",
      "score": 0.0067200684
    },
    {
      "intent": "Note.Confirm",
      "score": 0.00180193642
    },
    {
      "intent": "Note.Delete",
      "score": 0.001723963
    },
    {
      "intent": "Note.Create",
      "score": 0.0006193882
    },
    {
      "intent": "Note.ShowNext",
      "score": 0.000392203976
    },
    {
      "intent": "Note.Clear",
      "score": 0.0003031583
    }
  ],
  "entities": []
}
done
```