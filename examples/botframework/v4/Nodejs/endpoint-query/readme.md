This sample uses the [botframework-luis](https://www.npmjs.com/package/botframework-luis) NPM package.

This sample uses a Jest test framework to query an endpoint.

Modify the settings to include your own app ID and endpoint Key. Modify the query to be relevant to your LUIS app. 

## Sample Jest test code

```
// index.test.ts
const LuisClient = require("botframework-luis");

test('gets LUIS endpoint obj', (done) => {
  var baseUri = "https://westus.api.cognitive.microsoft.com/luis/";
  var luis = new LuisClient(baseUri);


  var luisAppId = "<appID>";
  var luisEndpointKey = "<endpointKey>";
  var q = "turn on the lights";
  var options = {
    verbose: true
  };

    luis.getIntentsAndEntitiesV2(luisAppId, luisEndpointKey, q, options).then(results => {
      console.log(results);
      done();
    }).catch(err => {
      done(err);
    });

});
```

## To Run

```
> npm install
> npm test
```

## Results

```
$ npm test

> LUIS-js@1.0.0 test LUIS-js
> jest

 PASS  ./index.test.ts
  ✓ gets LUIS endpoint obj (435ms)

  console.log index.test.ts:13
    { query: 'turn on the lights',
      topScoringIntent: { intent: 'TurnAllOn', score: 0.999995232 },
      intents: 
       [ { intent: 'TurnAllOn', score: 0.999995232 },
         { intent: 'None', score: 0.1150317 },
         { intent: 'TurnAllOff', score: 0.00000375459967 },
         { intent: 'TurnOn', score: 0.00000183897771 },
         { intent: 'GetCurrentWeather', score: 3.65018252e-7 },
         { intent: 'GetSunriseTime', score: 1.16294039e-7 },
         { intent: 'GetCurrentTemperature', score: 1.12170873e-7 },
         { intent: 'GetSunsetTime', score: 7.983227e-8 },
         { intent: 'TurnOff', score: 1.57682556e-9 },
         { intent: 'GetWeatherForecast', score: 7.013206e-11 } ],
      entities: [] }

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.336s, estimated 3s
Ran all test suites.
```