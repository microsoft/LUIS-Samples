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