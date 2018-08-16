# LUIS Endpoint query with Node.js

This example calls into the LUIS endpoint of the public IoT LUIS application and returns a query.

## Prerequisites
* In .env, change the `LUIS_ENDPOINT_KEY` value to your own LUIS subscription key found under your User account in [LUIS.ai](https://www.luis.ai). 
* [Docker](https://www.docker.com/) or [Nodejs](https://nodejs.org)

## Run via Docker
You can run this example from a Docker container.

1. On the command-line, build the Docker image:

```
docker build --no-cache -t luis-endpoint-node .
```

2. On the command-line, run the Docker image:

```
docker run -it --rm --name luis-endpoint-node luis-endpoint-node tail 
```

![Example of Docker commands and output](./command-line.png)

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

4. LUIS Response

```
Query: turn on the left light
Top Intent: HomeAutomation.TurnOn
Intents:
[ { intent: 'HomeAutomation.TurnOn', score: 0.933549 },
  { intent: 'None', score: 0.09975206 },
  { intent: 'HomeAutomation.TurnOff', score: 0.0276397187 } ]

```