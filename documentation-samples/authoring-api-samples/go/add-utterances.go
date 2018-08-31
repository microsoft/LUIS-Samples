
// dependencies
package main
import (
	"fmt"
	"net/http"
	"io/ioutil"
	"log"
	"strings"
)

// generic HTTP request
// includes setting header with authoring key
func httpRequest(httpVerb string, url string, authoringKey string, body string){

		client := &http.Client{}
	
		request, err := http.NewRequest(httpVerb, url, strings.NewReader(body))
		request.Header.Add("Ocp-Apim-Subscription-Key", authoringKey)

		fmt.Println("body")
		fmt.Println(body)

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

// main function
func main() {

	// NOTE: change to your app ID
	var appID = "YOUR-APP-ID"

	// NOTE: change to your authoring key
	var authoringKey = "YOUR-AUTHORING-KEY"

	var version = "0.1"

	var exampleUtterances = "utterances.json"

	fmt.Println("add example utterances requested")
	addUtterance(authoringKey, appID, version, exampleUtterances)

	fmt.Println("training selected")
	requestTraining(authoringKey, appID,  version)

	fmt.Println("training status selected")
	getTrainingStatus(authoringKey, appID, version)

}

// get utterances from file and add to model
func addUtterance(authoringKey string, appID string,  version string, fileOfLabeledExampleUtterances string){

    exampleUtterancesAsBytes, err := ioutil.ReadFile(fileOfLabeledExampleUtterances) // just pass the file name
    if err != nil {
        fmt.Print(err)
	}
	fmt.Println(string(exampleUtterancesAsBytes))


	// NOTE: region is westus
	var authoringUrl = fmt.Sprintf("https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/%s/versions/%s/examples", appID, version)

	httpRequest("POST", authoringUrl, authoringKey, (string(exampleUtterancesAsBytes)))
}
func requestTraining(authoringKey string, appID string,  version string){

	trainApp("POST", authoringKey, appID, version)
}
func trainApp(httpVerb string, authoringKey string, appID string,  version string){

	var authoringUrl = fmt.Sprintf("https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/%s/versions/%s/train", appID, version)

	httpRequest(httpVerb,authoringUrl, authoringKey, "")
}
func getTrainingStatus(authoringKey string, appID string, version string){

	trainApp("GET", authoringKey, appID, version)
}