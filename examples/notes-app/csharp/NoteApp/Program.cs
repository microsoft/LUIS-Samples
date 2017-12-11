using Newtonsoft.Json;
using Polly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace notes_app_core
{
    class LuisAppDefinition
    {
        public string culture = "en-us";
        public string domainName = "Note";
        public string appName = "MyNoteApp";
    }
    class LuisTrainStatusModelDetails
    {
        public int statusId=0;
        public string status="";
        public int exampleCount=0;
    }
    class LuisTrainStatus
    {
        public string modelId="";
        public LuisTrainStatusModelDetails details=new LuisTrainStatusModelDetails();
    }
    class LuisPublishRequest
    {
        public string versionId = "0.1";
        public bool isStaging = false;
        public string region = "westus";
    }
    class LUISTrainingStatusException : Exception { }
    class HTTPTooManyRequests : Exception { }

    class Program
    {
        static string subscriptionID = "";
        static string appID = "";
        static string versionID = "0.1";
        static string host = "https://westus.api.cognitive.microsoft.com";
        static string auth_path = "/luis/api/v2.0/";
        static string endpoint_path = "/luis/v2.0/";

        static LuisAppDefinition note_app = new LuisAppDefinition();
        static LuisPublishRequest publishBody = new LuisPublishRequest();

        static int polly_retry_count = 3;
        static TimeSpan polly_pauseBetweenFailures = TimeSpan.FromSeconds(2);

        // HTTP GET
        async static Task<HttpResponseMessage> SendGet(string uri)
        {
            Console.WriteLine(uri);
            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Get;
                request.RequestUri = new Uri(uri);
                request.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionID);
                return await client.SendAsync(request);
            }
        }
        // HTTP POST
        async static Task<HttpResponseMessage> SendPost(string uri, string requestBody)
        {
            Console.WriteLine(uri);
            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(uri);
                request.Content = new StringContent(requestBody, Encoding.UTF8, "text/json");
                request.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionID);
                return await client.SendAsync(request);
            }
        }
        // CREATE APP - may take up to a minute - do NOT time out
        async static Task<string> CreateApp(string requestBody)
        {
            string uri = host + auth_path + "apps/customprebuiltdomains";

            var response = await SendPost(uri, requestBody);
            return await response.Content.ReadAsStringAsync();
        }
        // TRAIN
        async static Task<string> Train(string requestBody)
        {
            string uri = host + auth_path + "apps/" + appID + "/versions/" + versionID + "/train";

            var response = await SendPost(uri, requestBody);
            return await response.Content.ReadAsStringAsync();
        }
        // TRAIN STATUS
        async static Task<HttpResponseMessage> TrainStatus()
        {
            string uri = host + auth_path + "apps/" + appID + "/versions/" + versionID + "/train";
            return await SendGet(uri);
        }
        // RETRY UNTIL TRAINING SUCCEEDS OR QUIT AFTER 'polly_retry_count' TIMES
        async static Task<List<LuisTrainStatus>> TrainStatusWithRetry()
        {
            List<LuisTrainStatus> TrainingStatusResultsList = new List<LuisTrainStatus>();

            // Define our policy:
            // return 'polly_retry_count' times
            // wait 'polly_pauseBetweenFailures' seconds
            Policy policy = Policy.Handle<Exception>()
            .WaitAndRetryAsync(polly_retry_count, i => polly_pauseBetweenFailures,
            (exception, timeSpan, context) =>
            {

                Console.WriteLine("retrying");

            });

            // execute 
            await policy.ExecuteAsync(async () =>
            {
                // call train status
                var response = await TrainStatus();

                // get results - each model can have different training status
                var status = await response.Content.ReadAsStringAsync();

                // HTTP 2xx
                if (response.IsSuccessStatusCode)
                {
                    // Make sure every model is trained
                    TrainingStatusResultsList = JsonConvert.DeserializeObject<List<LuisTrainStatus>>(status);
                    var allTrained = TrainingStatusResultsList.All(x => ((x.details.status == "InProgress") || (x.details.status == "Fail"))) ? false : true;

                    // If not trained, throw exception
                    if (!allTrained)
                    {
                        throw new LUISTrainingStatusException();
                    }
                    else // done
                    {
                        Console.WriteLine("Training Status complete");
                    }
                }
                else if (response.StatusCode == (HttpStatusCode)429)
                {
                    throw new HTTPTooManyRequests();
                }
                else // HTTP not 2xx
                {
                    // don't want to check every status so just throw if not successful
                    throw new Exception();
                }

            });

            return TrainingStatusResultsList;
        }
        // PUBLISH
        async static Task<HttpResponseMessage> Publish(string publishBody)
        {
            string uri = host + auth_path + "apps/" + appID + "/publish";
            return await SendPost(uri, publishBody);
        }
        // QUERY
        async static Task<HttpResponseMessage> Query(string q)
        {
            string uri = host + endpoint_path + "apps/" + appID + "?q=" + q;
            return await SendGet(uri);
        }
        static void Main(string[] args)
        {
            // 1. CREATE APP AND GET APP ID
            string requestBody = JsonConvert.SerializeObject(note_app, Formatting.Indented);
            appID = CreateApp(requestBody).Result.Replace("\"", "");
            Console.WriteLine("appID = " + appID);

            // 2. TRAIN
            var trainResult = Train("").Result;
            Console.WriteLine("train result");
            Console.WriteLine(trainResult);

            //// 3. GET TRAIN STATUS
            List<LuisTrainStatus> list = TrainStatusWithRetry().Result;

            // 4. PUBLISH
            string requestPublishBody = JsonConvert.SerializeObject(publishBody, Formatting.Indented);
            Console.WriteLine(requestPublishBody);
            var publishResult = Publish(requestPublishBody).Result;
            Console.WriteLine("publish Result");
            Console.WriteLine(publishResult + "\n\r");

            // 5. QUERY
            var q1 = "create grocery list";
            var q1Result = Query(q1).Result;
            Console.WriteLine(q1Result);

            var q2 = "add eggs to grocery list";
            var q2Result = Query(q2).Result;
            Console.WriteLine(q2Result);

            var q3 = "check off eggs from grocery list";
            var q3Result = Query(q3).Result;
            Console.WriteLine(q3Result);

            Console.WriteLine("done");
        }
    }
}
