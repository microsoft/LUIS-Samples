package main

import (
	"net/http"
	"fmt"
	"io/ioutil"
	"log"
)

/*
	build endpoint.go from command line
	> go build endpoint.go

	run endpoint from command line
	> endpoint

*/
func main() {
	

	// IoT Home Automation app ID = df67dcdb-c37d-46af-88e1-8b97951ca1c2
	// Add your LUIS endpoint key (not the authoring key)

	response, err := http.Get("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2?subscription-key=<LUIS-endpoint-key>&verbose=false&q=turn%20on%20the%20bedroom%20light")

	// 401 - check value of 'subscription-key' - do not use authoring key!
	if err!=nil {
		// handle error
		log.Fatal(err)
	}
	
	response2, err2 := ioutil.ReadAll(response.Body)

	if err2!=nil {
		// handle error
		log.Fatal(err2)
	}

	fmt.Println(string(response2))
}

/*
{
  "query": "turn on the bedroom light",
  "topScoringIntent": {
    "intent": "HomeAutomation.TurnOn",
    "score": 0.809439957
  },
  "entities": [
    {
      "entity": "bedroom",
      "type": "HomeAutomation.Room",
      "startIndex": 12,
      "endIndex": 18,
      "score": 0.8065475
    }
  ]
}
*/