require("dotenv").config();
const request = require("requestretry");
const querystring = require("querystring");

const LUIS_SUBSCRIPTION_KEY = process.env.LUIS_SUBSCRIPTION_KEY;
let LUIS_APPLICATION_ID = null; // returned from createNoteApp
const LUIS_API = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps";
// time delay between requests
const delayMS = 1000;

// retry recount
const retry = 20;

// we don't want fail or inprogress
const isTrained = trainingStatus => {
  return trainingStatus.some(model => {
    return (
      model.details.status !== "Fail" && model.details.status !== "InProgress"
    );
  });
};

// retry reqeust if error or 429 received
const retryStrategy = (err, response, body) => {
  let trained = isTrained(JSON.parse(body));
  let shouldRetry = err || response.statusCode === 429 || !trained;
  console.log(`${response.headers.date} shouldRetry = ${shouldRetry}`);
  return shouldRetry;
};

const createNoteApp = async () => {
  try {
    const endpoint = `${LUIS_API}/customprebuiltdomains`;

    const body = {
      domainName: "Note",
      culture: "en-us"
    };

    const options = {
      uri: endpoint,
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": LUIS_SUBSCRIPTION_KEY
      },
      json: true,
      body
    };
    return await request(options);
  } catch (err) {
    throw err;
  }
};
const train = async () => {
  try {
    const endpoint = `${LUIS_API}/${LUIS_APPLICATION_ID}/versions/0.1/train`;

    const options = {
      uri: endpoint,
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": LUIS_SUBSCRIPTION_KEY
      }
    };
    return await request(options);
  } catch (err) {
    throw err;
  }
};

const getTrainStatus = async () => {
  try {
    const endpoint = `${LUIS_API}/${LUIS_APPLICATION_ID}/versions/0.1/train`;

    const options = {
      uri: endpoint,
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": LUIS_SUBSCRIPTION_KEY
      },
      maxAttempts: retry,
      retryDelay: delayMS,
      retryStrategy
    };
    return await request(options);
  } catch (err) {
    throw err;
  }
};
const publish = async () => {
  try {
    const endpoint = `${LUIS_API}/${LUIS_APPLICATION_ID}/publish`;

    const body = {
      versionId: "0.1",
      isStaging: false,
      region: "westus"
    };

    const options = {
      uri: endpoint,
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": LUIS_SUBSCRIPTION_KEY
      },
      json: true,
      body
    };
    return await request(options);
  } catch (err) {
    throw err;
  }
};
const query = async utterance => {
  try {
    const queryParams = {
      "subscription-key": LUIS_SUBSCRIPTION_KEY,
      timezoneOffset: "0",
      verbose: true,
      q: utterance
    };

    const endpoint = `${LUIS_API}/${LUIS_APPLICATION_ID}?${querystring.stringify(
      queryParams
    )}`;

    const options = {
      uri: endpoint,
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": LUIS_SUBSCRIPTION_KEY
      }
    };
    return await request(options);
  } catch (err) {
    throw err;
  }
};
// run the application code
(async function main() {
  try {
    console.log("createapp " + new Date());
    let response = await createNoteApp();
    LUIS_APPLICATION_ID = response.body;
    console.log("train " + new Date());
    const trainedResponse = await train();
    console.log("trainstatus " + new Date());
    const status = await getTrainStatus();
    console.log("publish " + new Date());
    const published = await publish();
    console.log("create grocery list " + new Date());
    response = await query("create grocery list");
    console.log(response.body);
    console.log("add eggs to grocery list " + new Date());
    response = await query("add eggs to grocery list");
    console.log(response.body);
    console.log("check off eggs from grocery list " + new Date());
    response = await query("check off eggs from grocery list");
    console.log(response.body);
    console.log("done");
  } catch (err) {
    console.log(err);
  }
})();
