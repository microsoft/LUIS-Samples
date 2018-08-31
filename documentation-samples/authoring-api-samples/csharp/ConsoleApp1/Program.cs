using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

// 3rd party NuGet packages
using JsonFormatterPlus;
using CommandLine;


namespace AddUtterances
{

    class Program
    {
        // NOTE: Replace this example LUIS application ID with the ID of your LUIS application.
        static string appID = "YOUR-APP-ID";

        // NOTE: Replace this example LUIS application version number with the version number of your LUIS application.
        static string appVersion = "0.1";

        // NOTE: Replace this example LUIS authoring key with a valid key.
        static string authoringKey = "YOUR-AUTHORING-KEY";

        // Uses westus region
        static string host = "https://westus.api.cognitive.microsoft.com";
        static string path = "/luis/api/v2.0/apps/" + appID + "/versions/" + appVersion + "/";

        // parse command line options 
        public class Options
        {
            [Option('v', "verbose", Required = false, HelpText = "Set output to verbose messages.")]
            public bool Verbose { get; set; }

            [Option('t', "train", Required = false, HelpText = "Train model.")]
            public bool Train { get; set; }

            [Option('s', "status", Required = false, HelpText = "Get training status.")]
            public bool Status { get; set; }

            [Option('a', "add", Required = false, HelpText = "Add example utterances to model.")]
            public IEnumerable<string> Add{ get; set; }
        }


        async static Task<HttpResponseMessage> SendGet(string uri)
        {
            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Get;
                request.RequestUri = new Uri(uri);
                request.Headers.Add("Ocp-Apim-Subscription-Key", authoringKey);
                return await client.SendAsync(request);
            }
        }
        async static Task<HttpResponseMessage> SendPost(string uri, string requestBody)
        {
            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(uri);

                if (!String.IsNullOrEmpty(requestBody))
                {
                    request.Content = new StringContent(requestBody, Encoding.UTF8, "text/json");
                }

                request.Headers.Add("Ocp-Apim-Subscription-Key", authoringKey);
                return await client.SendAsync(request);
            }
        }
        async static Task AddUtterances(string input_file)
        {
            string uri = host + path + "examples";
            string requestBody = File.ReadAllText(input_file);

            var response = await SendPost(uri, requestBody);
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Added utterances.");
            Console.WriteLine(JsonFormatter.Format(result));
        }
        async static Task Train()
        {
            string uri = host + path + "train";

            var response = await SendPost(uri, null);
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Sent training request.");
            Console.WriteLine(JsonFormatter.Format(result));

        }
        async static Task Status()
        {
            var response = await SendGet(host + path + "train");
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Requested training status.");
            Console.WriteLine(JsonFormatter.Format(result));
        }
        static void Main(string[] args)
        {

            // Parse commandline options
            // For example: 
            // ConsoleApp1.exe --add utterances.json --train --status
            Parser.Default.ParseArguments<Options>(args)
                               .WithParsed<Options>(o =>
                               {
                                   
                                   // add example utterances
                                   if (o.Add != null && o.Add.GetEnumerator().MoveNext())
                                   {
                                       AddUtterances(o.Add.FirstOrDefault()).Wait();
                                   }

                                   // request training
                                   if (o.Train)
                                   {
                                       Train().Wait();

                                   }

                                   // get training status
                                   if (o.Status)
                                   {
                                       Status().Wait();

                                   }
                               });

        }
    }
}







































