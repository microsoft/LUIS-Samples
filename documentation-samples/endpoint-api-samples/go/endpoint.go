/*

	CLI INSTRUCTIONS

	You can use the authoring key instead of the endpoint key. 
	The authoring key allows 1000 endpoint queries a month.


	build endpoint.go from command line
	> go build endpoint.go

	run endpoint from command line for your own app and utterance
	> endpoint -appID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -endpointKey xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -utterance "turn on the lights" -region westus

	run endpoint from command line for the IoT app and utterance
	> endpoint -endpointKey xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -region westus


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

/* Do dependencies */
import (
	"fmt"
	"flag"
	"net/http"
	"net/url"
	"io/ioutil"
	"log"
)

/* 
	Analyze text

	appID = public app ID = be402ffc-57f4-4e1f-9c1d-f0d9fa520aa4
	endpointKey = Azure Language Understanding key, or Authoring key if it still has quota
	region = endpoint region
	utterance = text to analyze

*/
func endpointPrediction(appID string, endpointKey string, region string, utterance string) {

	var endpointUrl = fmt.Sprintf("https://%s.api.cognitive.microsoft.com/luis/v2.0/apps/%s?subscription-key=%s&verbose=false&q=%s", region, appID, endpointKey, url.QueryEscape(utterance))
	
	response, err := http.Get(endpointUrl)

	// 401 - check value of 'subscription-key' - do not use authoring key!
	if err!=nil {
		// handle error
		fmt.Println("error from Get")
		log.Fatal(err)
	}
	
	response2, err2 := ioutil.ReadAll(response.Body)

	if err2!=nil {
		// handle error
		fmt.Println("error from ReadAll")
		log.Fatal(err2)
	}

	fmt.Println("response")
	fmt.Println(string(response2))
}

func main() {
	
	var appID = flag.String("appID", "df67dcdb-c37d-46af-88e1-8b97951ca1c2", "LUIS appID")
	var endpointKey = flag.String("endpointKey", "", "LUIS endpoint key")
	var region = flag.String("region", "", "LUIS app publish region")
	var utterance = flag.String("utterance", "turn on the bedroom light", "utterance to predict")

	flag.Parse()
	
	fmt.Println("appID has value", *appID)
	fmt.Println("endpointKey has value", *endpointKey)
	fmt.Println("region has value", *region)
	fmt.Println("utterance has value", *utterance)

	endpointPrediction(*appID, *endpointKey, *region, *utterance)

}