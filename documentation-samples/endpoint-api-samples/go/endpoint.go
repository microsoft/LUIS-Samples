/*
	build endpoint.go from command line
	> go build endpoint.go

	run endpoint from command line
	> endpoint -appID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -endpointKey xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -utterance "turn on the lights" -region westus


	output

	appID has value be402ffc-57f4-4e1f-9c1d-f0d9fa520aa4
	endpointKey has value xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
	region has value westus
	utterance has value turn on the lights
	{
	"query": "turn on the lights",
	"topScoringIntent": {
		"intent": "Utilities.Stop",
		"score": 0.457045376
	},
	"entities": []
	}

*/

package main

import (
	"fmt"
	"flag"
	"net/http"
	"net/url"
	"io/ioutil"
	"log"
)

func endpointPrediction(appID string, endpointKey string, region string, utterance string) {

	var endpointUrl = fmt.Sprintf("https://%s.api.cognitive.microsoft.com/luis/v2.0/apps/%s?subscription-key=%s&verbose=false&q=%s", region, appID, endpointKey, url.QueryEscape(utterance))
	
	response, err := http.Get(endpointUrl)

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

func main() {
	
	var appID = flag.String("appID", "", "LUIS appID")
	var endpointKey = flag.String("endpointKey", "", "LUIS endpoint key")
	var region = flag.String("region", "", "LUIS app publish region")
	var utterance = flag.String("utterance", "", "utterance to predict")

	flag.Parse()
	
	fmt.Println("appID has value", *appID)
	fmt.Println("endpointKey has value", *endpointKey)
	fmt.Println("region has value", *region)
	fmt.Println("utterance has value", *utterance)

	endpointPrediction(*appID, *endpointKey, *region, *utterance)

}