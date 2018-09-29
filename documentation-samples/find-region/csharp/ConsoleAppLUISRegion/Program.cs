using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Threading;

namespace ConsoleApp4
{
    static class Luis
    {

        /// <summary>
        /// current regions list
        /// </summary>
        static string[] _hostRegions = new string[] {
                                    "eastasia",
                                    "southeastasia",
                                    "australiaeast",
                                    "northeurope",
                                    "westeurope",
                                    "eastus",
                                    "eastus2",
                                    "southcentralus",
                                    "westcentralus",
                                    "westus",
                                    "westus2",
                                    "brazilsouth"};


        /// <summary>
        /// template for endpoint query
        /// 
        /// 0 = host region
        /// 1 = appId
        /// 2 = subscription key
        /// 3 = query utterance - doensn't matter what it is
        /// </summary>
        public const string ParameterizedPath = "https://{0}.api.cognitive.microsoft.com/luis/v2.0/apps/{1}?subscription-key={2}{3}";

        /// <summary>
        /// Get first region that returns 2xx
        /// </summary>
        /// <param name="appIdLUIS">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</param>
        /// <param name="subscriptionKeyLUIS">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</param>
        /// <returns>string</returns>
        public static string GetRegion(string appIdLUIS, string subscriptionKeyLUIS)
        {
            if (String.IsNullOrEmpty(appIdLUIS) || String.IsNullOrEmpty(subscriptionKeyLUIS)) return string.Empty;

            string appIdWithSubscriptionKey = string.Join("|", appIdLUIS, subscriptionKeyLUIS);

            using (var client = new HttpClient())
            {
                foreach (var currentRegion in _hostRegions)
                {
                    var url = string.Format(ParameterizedPath, currentRegion, appIdLUIS, subscriptionKeyLUIS, "&q=hi");

                    try
                    {
                        using (var response = client.GetAsync(url, HttpCompletionOption.ResponseContentRead, CancellationToken.None).Result)
                        {
                            // region is correct
                            if (response.StatusCode.Equals(HttpStatusCode.OK))
                            {
                                return currentRegion;
                            }
                            else // region is not correct - 401
                            {
                                Debugger.Log(0, "", "401 " + url + "\n\r");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Debugger.Log(0, "exception", ex.Message);
                    }
                }
            }
            
            return String.Empty; 
        }
    }

    /// <summary>
    /// Console app to return region
    /// </summary>
    class Program
    {
        static void Main(string[] args)
        {
            // Change to your LUIS app Id
            string luisAppId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

            // Change to your LUIS subscription key
            string luisSubscriptionKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

            string region = Luis.GetRegion(luisAppId, luisSubscriptionKey);
            Console.Write(string.Format("\n\rLUIS region: {0} \n\r", region));
            Console.Write("\nPress any key to continue...");
			Console.Read(); // to keep the console open
        }
    }
}


