########### Python 3.6 #############
# -*- coding: utf-8 -*-

import http.client, sys, os.path, json

# Authoring key, available in luis.ai under Account Settings
LUIS_authoringKey  = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ID of your LUIS app to which you want to add an utterance
LUIS_APP_ID      = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# The version number of your LUIS app
LUIS_APP_VERSION = "0.1"

# Update the host if your LUIS subscription is not in the West US region
LUIS_HOST       = "westus.api.cognitive.microsoft.com"

# uploadFile is the file containing JSON for utterance(s) to add to the LUIS app.
# The contents of the file must be in this format described at: https://aka.ms/add-utterance-json-format
UTTERANCE_FILE   = "./utterances.json"
RESULTS_FILE     = "./utterances.results.json"

# LUIS client class for adding and training utterances
class LUISClient:
    
    # endpoint method names
    TRAIN    = "train"
    EXAMPLES = "examples"

    # HTTP verbs
    GET  = "GET"
    POST = "POST"

    # Encoding
    UTF8 = "UTF8"

    # path template for LUIS endpoint URIs
    PATH     = "/luis/api/v2.0/apps/{app_id}/versions/{app_version}/"

    # default HTTP status information for when we haven't yet done a request
    http_status = 200
    reason = ""
    result = ""

    def __init__(self, host, app_id, app_version, key):
        if len(key) != 32:
            raise ValueError("LUIS subscription key not specified in " +
                             os.path.basename(__file__))
        if len(app_id) != 36:
            raise ValueError("LUIS application ID not specified in " +
                             os.path.basename(__file__))
        self.key = key
        self.host = host
        self.path = self.PATH.format(app_id=app_id, app_version=app_version)

    def call(self, luis_endpoint, method, data=""):
        path = self.path + luis_endpoint
        headers = {'Ocp-Apim-Subscription-Key': self.key}
        conn = http.client.HTTPSConnection(self.host)
        conn.request(method, path, data.encode(self.UTF8) or None, headers)
        response = conn.getresponse()
        self.result = json.dumps(json.loads(response.read().decode(self.UTF8)),
                                 indent=2)
        self.http_status = response.status
        self.reason = response.reason
        return self

    def add_utterances(self, filename=UTTERANCE_FILE):
        with open(filename, encoding=self.UTF8) as utterance:
            data = utterance.read()
        return self.call(self.EXAMPLES, self.POST, data)
        
    def train(self):
        return self.call(self.TRAIN, self.POST)

    def status(self):
        return self.call(self.TRAIN, self.GET)

    def write(self, filename=RESULTS_FILE):
        if self.result:
            with open(filename, "w", encoding=self.UTF8) as outfile:
                outfile.write(self.result)
        return self

    def print(self):
        if self.result:
            print(self.result)
        return self

    def raise_for_status(self):
        if 200 <= self.http_status < 300:
            return self
        raise http.client.HTTPException("{} {}".format(
            self.http_status, self.reason))

if __name__ == "__main__":

    # uncomment a line below to simulate command line options
    # sys.argv.append("-train")
    # sys.argv.append("-status")

    luis = LUISClient(LUIS_HOST, LUIS_APP_ID, LUIS_APP_VERSION,
                      LUIS_authoringKey)

    try:
        if len(sys.argv) > 1:
            option = sys.argv[1].lower().lstrip("-")
            if option == "train":
                print("Adding utterance(s).")
                luis.add_utterances()   .write().raise_for_status()
                print("Added utterance(s). Requesting training.")
                luis.train()            .write().raise_for_status()
                print("Requested training. Requesting training status.")
                luis.status()           .write().raise_for_status()
            elif option == "status":
                print("Requesting training status.")
                luis.status().write().raise_for_status()
        else:
            print("Adding utterance(s).")
            luis.add_utterances().write().raise_for_status()
    except Exception as ex:
        luis.print()    # JSON response may have more details
        print("{0.__name__}: {1}".format(type(ex), ex))
    else:
        print("Success: results in", RESULTS_FILE)
        
