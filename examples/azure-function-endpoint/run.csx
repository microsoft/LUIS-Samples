#r "System.Data"

using System;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Net;

static HttpClient httpClient = new HttpClient();

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    // The Application ID from any published app in luis.ai, found in Manage > Application Information 
    var LUISappID = "YOUR_APP_ID";
    // The above LUIS app's authoring/starter key found in Manage > Keys and Endpoints 
    var LUISsubscriptionKey="YOUR_LUIS_SUBSCRIPTION_KEY";
    var LUISendpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";

    // Copy/paste your connection string from your SQL database resource in the Azure portal, found on the Overview page
    // Substitute your username and password, to your SQL database, where indicated
    var SQLconnectionString = "Server=tcp:YOUR_DATABASE_NAME.database.windows.net,1433;Initial Catalog=YOUR_CATALOG;Persist Security Info=False;User ID=USER;Password=PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

    log.Info("Get LUIS query from HTTP Request");

    // Query string
    string query = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "query", true) == 0)
        .Value;

    // POST Body
    dynamic data = await req.Content.ReadAsAsync<object>();

    // Final LUIS Query
    query = query ?? data?.query;

    // If no query, return 204
    if( String.IsNullOrEmpty(query)){
        return new HttpResponseMessage(HttpStatusCode.NoContent);
    }

    log.Info("LUIS QUERY:" + query);

    // LUIS HTTP CALL
    httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", LUISsubscriptionKey);
    var response = await httpClient.GetAsync(LUISendpoint + LUISappID + "/?verbose=true&q=" + query);

    // If LUIS error, return 204 - YOU SHOULD COMMENT THIS OUT! Then build/run again.
    if (!response.IsSuccessStatusCode) {
         return new HttpResponseMessage(HttpStatusCode.NoContent);
    }

    // Get LUIS response content as string
    var contents = await response.Content.ReadAsStringAsync();
    log.Info(contents);

    // SQL DATABASE INSERT
      using (SqlConnection con = new SqlConnection(SQLconnectionString))
      {
        // Build up insert statement
        var insert = "insert into LUIS (Endpoint,Subscription,Application,Query) values " +
        "('" + LUISendpoint + "'," +
        "'" + LUISsubscriptionKey + "'," + 
        "'" + LUISappID + "'," +            
        "'" + contents + "')";

        using (SqlCommand cmd = new SqlCommand(insert, con)) 
        {
          cmd.CommandType = CommandType.Text;
          con.Open();
           
          var countRowsAffected = cmd.ExecuteNonQuery();
     
          log.Info($"processed SQL command succesfully; uploaded {countRowsAffected} rows");
        }
      }

    return response;
}


