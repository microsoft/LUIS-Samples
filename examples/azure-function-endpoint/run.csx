#r "System.Data"
#r "System.Net.Http"

using System;
using System.IO;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

static HttpClient httpClient = new HttpClient();

public static async Task<HttpResponseMessage> Run(HttpRequest req, ILogger log)
{
    // The Application ID from any published app in luis.ai, found in Manage > Application Information 
    var LUISappID = "YOUR_APP_ID";
    // The above LUIS app's authoring/starter key found in Manage > Keys and Endpoints 
    var LUISsubscriptionKey="YOUR_LUIS_SUBSCRIPTION_KEY";
    var LUISendpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";

    // Copy/paste your connection string from your SQL database resource in the Azure portal, found on the Overview page
    // Substitute your username and password, to your SQL database, where indicated
    var SQLconnectionString = "Server=tcp:YOUR_DATABASE_NAME.database.windows.net,1433;Initial Catalog=YOUR_CATALOG;Persist Security Info=False;User ID=USER;Password=PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

    log.LogInformation("Get LUIS query from HTTP Request");

    // Query string
    string query = req.Query["query"];

    // POST Body
    dynamic data = await new StreamReader(req.Body).ReadToEndAsync();

    // Final LUIS Query
    query = query ?? data?.query;

    // If no query, return 204
    if( String.IsNullOrEmpty(query)){
        return new HttpResponseMessage(HttpStatusCode.NoContent);
    }

    log.LogInformation("LUIS QUERY:" + query);

    // LUIS HTTP CALL
    httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", LUISsubscriptionKey);
    var response = await httpClient.GetAsync(LUISendpoint + LUISappID + "/?verbose=true&q=" + query);

    // If LUIS error, return 204 - YOU SHOULD COMMENT THIS OUT! Then build/run again.
    if (!response.IsSuccessStatusCode) {
         return new HttpResponseMessage(HttpStatusCode.NoContent);
    }

    // Get LUIS response content as string
    var contents = await response.Content.ReadAsStringAsync();
    log.LogInformation(contents);

    try
    {
        // SQL DATABASE INSERT
        using (SqlConnection con = new SqlConnection(SQLconnectionString))
        {
            // build up insert statement
            var insert = "insert into LUIS (Endpoint,Subscription,Application,Query) values " +
            "('" + LUISendpoint + "'," +
            "'" + LUISsubscriptionKey + "'," +
            "'" + LUISappID + "'," +
            "'" + contents + "')";

            log.LogInformation(insert);

            using (SqlCommand cmd = new SqlCommand(insert, con))
            {
                cmd.CommandType = CommandType.Text;
                con.Open();

                var countRowsAffected = cmd.ExecuteNonQuery();

                log.LogInformation($"processed SQL command successfully; uploaded {countRowsAffected} rows");
            }
            return response;
        }
    }
    catch (Exception ex)
    {
        log.LogInformation(ex.Message);
        return response;
    }
}


