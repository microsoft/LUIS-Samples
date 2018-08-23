using System;
using System.Net.Http;

/*

	You can use the authoring key instead of the endpoint key. 
	The authoring key allows 1000 endpoint queries a month.

*/

namespace ConsoleLuisEndpointSample
{
    class Program
    {
        static void Main(string[] args)
        {
            MakeRequest();
            Console.WriteLine("Hit ENTER to exit...");
            Console.ReadLine();
        }

        static async void MakeRequest()
        {
            var client = new HttpClient();

            // This app ID is for a public sample app that recognizes requests to turn on and turn off lights
            var luisAppId = "df67dcdb-c37d-46af-88e1-8b97951ca1c2";
            var endpointKey = "YOUR-KEY";

            // The request header contains your subscription key
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", endpointKey);

            // The "q" parameter contains the utterance to send to LUIS
            var endpointUri = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/" + luisAppId + "?q=" + "turn on the left light";
            var response = await client.GetAsync(endpointUri);

            var strResponseContent = await response.Content.ReadAsStringAsync();
            
            // Display the JSON result from LUIS
            Console.WriteLine(strResponseContent.ToString());
        }
    }
}
