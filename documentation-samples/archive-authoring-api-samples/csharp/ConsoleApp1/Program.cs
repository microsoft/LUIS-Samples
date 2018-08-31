using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace AddUtterances
{
    class Program
    {
        // NOTE: Replace this example LUIS application ID with the ID of your LUIS application.
        static string appID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

        // NOTE: Replace this example LUIS application version number with the version number of your LUIS application.
        static string appVersion = "0.1";

        // NOTE: Replace this example LUIS authoring key with a valid key.
        static string authoringKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

        static string host = "https://westus.api.cognitive.microsoft.com";
        static string path = "/luis/api/v2.0/apps/" + appID + "/versions/" + appVersion + "/";

        static string usage = @"Usage:
add-utterances <input file>
add-utterances -train <input file>
add-utterances -status

The contents of <input file> must be in the format described at: https://aka.ms/add-utterance-json-format
";

        static string JsonPrettyPrint(string json)
        {
            if (string.IsNullOrEmpty(json))
                return string.Empty;

            json = json.Replace(Environment.NewLine, "").Replace("\t", "");

            StringBuilder sb = new StringBuilder();
            bool quote = false;
            bool ignore = false;
            int offset = 0;
            int indentLength = 3;

            foreach (char ch in json)
            {
                switch (ch)
                {
                    case '"':
                        if (!ignore) quote = !quote;
                        break;
                    case '\'':
                        if (quote) ignore = !ignore;
                        break;
                }

                if (quote)
                    sb.Append(ch);
                else
                {
                    switch (ch)
                    {
                        case '{':
                        case '[':
                            sb.Append(ch);
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', ++offset * indentLength));
                            break;
                        case '}':
                        case ']':
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', --offset * indentLength));
                            sb.Append(ch);
                            break;
                        case ',':
                            sb.Append(ch);
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', offset * indentLength));
                            break;
                        case ':':
                            sb.Append(ch);
                            sb.Append(' ');
                            break;
                        default:
                            if (ch != ' ') sb.Append(ch);
                            break;
                    }
                }
            }

            return sb.ToString().Trim();
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
                request.Content = new StringContent(requestBody, Encoding.UTF8, "text/json");
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
            Console.WriteLine(JsonPrettyPrint(result));
        }
        async static Task Train(string input_file)
        {
            string uri = host + path + "train";
            string requestBody = File.ReadAllText(input_file);

            var response = await SendPost(uri, requestBody);
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Sent training request.");
            Console.WriteLine(JsonPrettyPrint(result));
            await Status();
        }
        async static Task Status()
        {
            var response = await SendGet(host + path + "train");
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Requested training status.");
            Console.WriteLine(JsonPrettyPrint(result));
        }
        static void Main(string[] args)
        {
            if (args.Length < 1)
            {
                Console.WriteLine(usage);
            }
            else
            {
                if (true == String.Equals(args[0], "-train", StringComparison.OrdinalIgnoreCase))
                {
                    if (args.Length > 1)
                    {
                        Train(args[1]).Wait();
                    }
                    else
                    {
                        Console.WriteLine(usage);
                    }
                }
                else if (true == String.Equals(args[0], "-status", StringComparison.OrdinalIgnoreCase))
                {
                    Status().Wait();
                }
                else
                {
                    AddUtterances(args[0]).Wait();
                }
            }
        }
    }
}
