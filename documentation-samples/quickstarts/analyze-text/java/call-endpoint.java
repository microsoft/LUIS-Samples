// This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)

// You need to add the following Apache HTTP client libraries to your project:
// httpclient-4.5.3.jar
// httpcore-4.4.6.jar
// commons-logging-1.2.jar

import java.net.URI;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class LuisGetRequest {

    public static void main(String[] args) 
    {
        HttpClient httpclient = HttpClients.createDefault();

        try
        {

            // The ID of a public sample LUIS app that recognizes intents for turning on and off lights
            String AppId = "df67dcdb-c37d-46af-88e1-8b97951ca1c2";
            
            // Add your endpoint key 
            // You can use the authoring key instead of the endpoint key. 
            // The authoring key allows 1000 endpoint queries a month.
            String EndpointKey = "YOUR-KEY";

            // Begin endpoint URL string building
            URIBuilder endpointURLbuilder = new URIBuilder("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/" + AppId + "?");

            // query text
            endpointURL.setParameter("q", "turn on the left light");

            // create URL from string
            URI endpointURL = endpointURL.build();

            // create HTTP object from URL
            HttpGet request = new HttpGet(endpointURL);

            // set key to access LUIS endpoint
            request.setHeader("Ocp-Apim-Subscription-Key", EndpointKey);

            // access LUIS endpoint - analyze text
            HttpResponse response = httpclient.execute(request);

            // get response
            HttpEntity entity = response.getEntity();


            if (entity != null) 
            {
                System.out.println(EntityUtils.toString(entity));
            }
        }

        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
