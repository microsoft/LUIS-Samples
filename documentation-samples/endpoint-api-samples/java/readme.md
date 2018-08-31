# LUIS Endpoint query with Java

This example calls into the LUIS endpoint of the public IoT LUIS application and returns a query.

## Prerequisites
* In call-endpoint.java, change the `SubscriptionKey` value to your own LUIS subscription key found under your User account in [LUIS.ai](https://www.luis.ai).
* [Docker](https://www.docker.com/) or [Java](https://www.java.com/en/)

The dependency libraries are in the `lib` subdirectory.

## Run via Docker
You can run this example from a Docker container.

1. On the command-line, build the Docker image:

```
docker build --no-cache -t luis-endpoint-java .
```

2. On the command-line, run the Docker image:

```
docker run -it --rm --name luis-endpoint-java luis-endpoint-java tail
```

![Example of Docker commands and output](./command-line.png)

## Run via Java
You can run this example from Java.

1. Rename `call-endpoint.java` to `LuisGetRequest.java`.

2. On the command-line, compile the file:

```
javac -cp ":lib/*" LuisGetRequest.java
```

3. On the command-line, run the file:

```
java -cp :lib/* LuisGetRequest
```

4. LUIS Response

```
{
  "query": "turn on the left light",
  "topScoringIntent": {
    "intent": "HomeAutomation.TurnOn",
    "score": 0.933549
  },
  "entities": [
    {
      "entity": "left",
      "type": "HomeAutomation.Room",
      "startIndex": 12,
      "endIndex": 15,
      "score": 0.540835142
    }
  ]
}
```