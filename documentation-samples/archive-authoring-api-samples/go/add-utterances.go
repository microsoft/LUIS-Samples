/*

	build endpoint.go from command line
	> go build add-utterance.go

	add utterances from file, train, and get training status from command line
	> add-utterance -authoringKey xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -region westus -appID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -version myversion -utteranceFile utterances.json

	output

	add example utterances requested
	[
		{
			"text": "go lang 1",
			"intentName": "None",
			"entityLabels": []
		}
	,
		{
			"text": "go lang 2",
			"intentName": "None",
			"entityLabels": []
		}
	]
		201
	[{"value":{"ExampleId":72167429,"UtteranceText":"go lang 1"},"hasError":false},{"value":{"ExampleId":72167430,"UtteranceText":"go lang 2"},"hasError":false}]
	training selected
		202
	{"statusId":9,"status":"Queued"}
	training status selected
		200
	[{"modelId":"260e8f9d-d8db-4a2e-a318-a16b3e427be2","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"55cea269-ea12-4c77-9f84-537b6869dbc9","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"623d8fc8-eac2-4278-80f0-b305a1959fde","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"ca77c7a3-f12b-404c-90ac-a94273c57c05","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"6daa6a0c-f531-49cc-ad8a-219cf4e901ce","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"d188d7a4-4e9a-4630-8921-b10ba39aecb0","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"18ceb7f7-85a2-428e-adee-8214c3998dae","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"5ee7ab78-690d-4858-8609-92cb617efab6","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"b2c5d0a4-9737-4806-9ddc-86976902bfb4","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"fe84c388-b9c5-4a99-b655-ba6636129d5d","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"9a89df58-5a00-4ecd-9785-07aece1335a2","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"9604f47c-6ca3-484a-8d24-56c6691e5c57","details":{"statusId":3,"status":"InProgress","exampleCount":123}},{"modelId":"917ab408-32ae-4914-b3dc-88c61b064dbe","details":{"statusId":3,"status":"InProgress","exampleCount":123}}]

*/
package main
import (
	"fmt"
	"flag"
	"net/http"
	"io/ioutil"
	"log"
	"bytes"
)

func httpRequest(httpVerb string, url string, authoringKey string, body string){

		client := &http.Client{}
	
		request, err := http.NewRequest(httpVerb, url, nil)
		request.Header.Add("Ocp-Apim-Subscription-Key", authoringKey)

		response, err := client.Do(request)
		if err != nil {
			log.Fatal(err)
		} else {
			defer response.Body.Close()
			contents, err := ioutil.ReadAll(response.Body)
			if err != nil {
				log.Fatal(err)
			}
			fmt.Println("   ", response.StatusCode)
			fmt.Println(string(contents))
		}
}

func main() {
	
	var appID = flag.String("appID", "", "LUIS appID")
	var authoringKey = flag.String("authoringKey", "", "LUIS authoring key")
	var version = flag.String("version", "", "LUIS app version")
	var region = flag.String("region", "", "LUIS app publish region")

	var exampleUtterances = flag.String("utteranceFile", "utterances.json", "JSON file of utterances to train model")
	var train = flag.Bool("train", true, "train the app")
	var trainStatus = flag.Bool("status", true, "get training status")

	flag.Parse()

	if len(*exampleUtterances) != 0{
		fmt.Println("add example utterances requested")
		addUtterance(*authoringKey, *appID, *region, *version, *exampleUtterances)
	}

	if *train == true {
		fmt.Println("training selected")
		requestTraining(*authoringKey, *appID, *region, *version)
	} 

	if *trainStatus == true {
		fmt.Println("training status selected")
		getTrainingStatus(*authoringKey, *appID, *region, *version)
	}

}
func addUtterance(authoringKey string, appID string, region string, version string, fileOfLabeledExampleUtterances string){

    exampleUtterancesAsBytes, err := ioutil.ReadFile(fileOfLabeledExampleUtterances) // just pass the file name
    if err != nil {
        fmt.Print(err)
	}
	fmt.Println(string(exampleUtterancesAsBytes))

	var authoringUrl = fmt.Sprintf("https://%s.api.cognitive.microsoft.com/luis/api/v2.0/apps/%s/versions/%s/examples", region, appID, version)

	client := &http.Client{}
		
	request, err := http.NewRequest("POST", authoringUrl, bytes.NewBuffer(exampleUtterancesAsBytes))
	request.Header.Add("Ocp-Apim-Subscription-Key", authoringKey)

	response, err := client.Do(request)
	if err != nil {
		log.Fatal(err)
	} else {
		defer response.Body.Close()
		contents, err := ioutil.ReadAll(response.Body)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("   ", response.StatusCode)
		fmt.Println(string(contents))
	}
}
func requestTraining(authoringKey string, appID string, region string, version string){

	trainApp("POST", authoringKey, appID, region, version)
}
func getTrainingStatus(authoringKey string, appID string, region string, version string){

	trainApp("GET", authoringKey, appID, region, version)
}
func trainApp(httpVerb string, authoringKey string, appID string, region string, version string){

	var authoringUrl = fmt.Sprintf("https://%s.api.cognitive.microsoft.com/luis/api/v2.0/apps/%s/versions/%s/train", region, appID, version)

	httpRequest(httpVerb,authoringUrl, authoringKey, "")
}