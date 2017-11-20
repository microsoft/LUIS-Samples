// Add Utterances to LUIS Application - AddUtterances.java
// Language Understanding Intelligent Service
// Microsoft Cognitive Services, a part of Microsoft Azure
//
// Requires JDK 1.7 or later
//
// Package required: Google's GSON JSON library
// Download latest JAR from GitHub: https://github.com/google/gson
// and place it in the same directory as AddUtterances.java
//
// Paste your LUIS application ID, version, and subscription key in the
// variables LUIS_APP_ID, LUIS_APP_VERSION, and LUIS_PROGRAMMATIC_KEY below.
//
// To compile from command line:
//
//      javac -classpath gson-2.8.2.jar AddUtterances.java
//      java -classpath .;gson-2.8.2.jar AddUtterances
// (substitute the correct name of the GSON JAR file)
//
// The utterances in the file ./utterances.json are added to your LUIS app.
// The JSON response from the action is in the file utterances.results.json.
//
// You may add the following flags to the end of the run command:
// -train   Adds the utterances, starts training, and gets the training status
// -status  Gets the current training status (training may take a while)

import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;

//
// AddUtterances container class.  Holds LuisClient, LuisResponse, StatusException
//
public class AddUtterances {

    // Enter information about your LUIS application and key below
    static final String LUIS_APP_ID      = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
    static final String LUIS_APP_VERSION = "0.1";
    static final String LUIS_PROGRAMMATIC_KEY  = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

    // Update the host if your LUIS subscription is not in the West US region
    static final String LUIS_BASE        = "https://westus.api.cognitive.microsoft.com";

    // File names for utterance and result files
    static final String UTTERANCE_FILE   = "./utterances.json";
    static final String RESULTS_FILE     = "./utterances.results.json";
    
    static final String UTF8 = "UTF-8";

    //
    // LUIS Client class
    // Contains the functionality for adding utterances to a LUIS application
    //
    static class LuisClient{

        private final String PATH = "/luis/api/v2.0/apps/{app_id}/versions/{app_version}";
        
        // endpoint method names
        private final String TRAIN    = "/train";
        private final String EXAMPLES = "/examples";
        private final String APP_INFO = "/";

        // HTTP verbs
        private final String GET  = "GET";
        private final String POST = "POST";
        
        // Null string value for use in resolving method calls
        private final String NO_DATA = null;
        
        // Member variables
        private String key;
        private String host;
        private String path;
        
        LuisClient(String host, String app_id, String app_version, String key) throws Exception {
            this.path = PATH.replace("{app_id}", app_id).replace("{app_version}", app_version);
            this.host = host;
            this.key = key;
            
            // Test configuration by getting the application info
            this.get(APP_INFO).raiseForStatus();
        }
        
        LuisResponse call(String endpoint, String method, byte[] data) throws Exception {
            
            // initialize HTTP connection
            URL url = new URL(this.host + this.path + endpoint);
            System.out.println(url + "\n\r");
             
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();           
            conn.setRequestMethod(method);
            conn.setRequestProperty("Ocp-Apim-Subscription-Key", key);

            // handle POST request
            if (method.equals(POST) && data != null) {
                System.out.println(new String(data, UTF8));
                conn.setDoOutput(true);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setRequestProperty("Content-Length", Integer.toString(data.length));
                OutputStream ostream = conn.getOutputStream();
                ostream.write(data, 0, data.length);
                ostream.close();
            }

            // Get response from API call.  If response is an HTTP error, the JSON
            // response is on the error string.  Otherwise, it's on the input string.
            InputStream stream = null;
            try {
                stream = conn.getInputStream();
            } catch (IOException ex) {
                stream = conn.getErrorStream();
            }
            String body = new Scanner(stream, UTF8).useDelimiter("\\A").next();

            return new LuisResponse(body, conn.getResponseCode(), conn.getResponseMessage());

        }

        // Overload of call() with String data paramater
        LuisResponse call(String endpoint, String method, String data) throws Exception {
            byte[] bytes = null;
            if (data != null)
                bytes = data.getBytes(UTF8);
            return call(endpoint, method, bytes);
        }
        
        // Overload of call() with InputStream data paramater
        LuisResponse call(String endpoint, String method, InputStream stream) throws Exception {
            String data = new Scanner(stream, UTF8).useDelimiter("\\A").next();
            return call(endpoint, method, data);
        }

        // Shortcut for GET requests
        LuisResponse get(String endpoint) throws Exception {
            return call(endpoint, GET, NO_DATA);
        }
        
        // Shortcut for POST requests -- byte[] data
        LuisResponse post(String endpoint, byte[] data) throws Exception {
            return call(endpoint, POST, data);
        }

        // Shortcut for POST requests -- String data
        LuisResponse post(String endpoint, String data) throws Exception {
            return call(endpoint, POST, data);
        }

        // Shortcut for POST requests -- InputStream data
        LuisResponse post(String endpoint, InputStream data) throws Exception {
            return call(endpoint, POST, data);
        }

        // Shortcut for POST requests -- no data
        LuisResponse post(String endpoint) throws Exception {
            return call(endpoint, POST, NO_DATA);
        }
        
        // Call to add utterances
        public LuisResponse addUtterances(String filename) throws Exception {
            try (FileInputStream stream = new FileInputStream(filename)) {
                return post(EXAMPLES, stream);
            }
        }
        
        public LuisResponse train() throws Exception {
            return post(TRAIN);
        }
        
        public LuisResponse status() throws Exception {
            return get(TRAIN);
        }
        
    }
    
    //
    // LUIS Response class
    // Represents a response from the LUIS client.  All methods return
    // the instance so method calls can be chained.
    //
    static class LuisResponse {

        private String      body;
        private int         status;
        private String      reason;
        private JsonElement data;
        
        LuisResponse(String body, int status, String reason) {
            JsonParser parser = new JsonParser();
            try {
                this.data = parser.parse(body);
            }
            catch (JsonSyntaxException ex) {
                this.data = parser.parse("{ \"message\": \"Invalid JSON response\" }");
            }
            this.body   = new GsonBuilder().setPrettyPrinting().create().toJson(data);
            this.status = status;
            this.reason = reason;
        }

        LuisResponse write(String filename) throws Exception {
            File file = new File(filename);
            if (!file.exists()) file.createNewFile();
            try (FileOutputStream stream = new FileOutputStream(file)) {
                stream.write(this.body.getBytes(UTF8));
                stream.flush();
            }
            return this;
        }
        
        LuisResponse print() {
            System.out.println(this.body);
            return this;
        }
        
        LuisResponse raiseForStatus() throws StatusException {
            if (this.status < 200 || this.status > 299) {
                throw new StatusException(this);
            }
            return this;
        }
    }
    
    //
    // LUIS Status Exception class
    // Represents an exception raised by the LUIS client for HTTP status errors
    // Includes details extracted from the JSON response and the HTTP status
    //
    static class StatusException extends Exception {

        private String details = "";
        private int status;
        
        StatusException(LuisResponse response) {
            super(String.format("%d %s", response.status, response.reason));
            JsonObject jsonInfo = (JsonObject)response.data;
            if (jsonInfo.has("error"))
                jsonInfo = (JsonObject)jsonInfo.get("error");
            if (jsonInfo.has("message")) 
                this.details = jsonInfo.get("message").getAsString();
            this.status = response.status;
        }

        String getDetails() {
            return this.details;
        }
        
        int getStatus() {
            return this.status;
        }
       
    }
    
    static void printInvalidMsg(StatusException ex, String what, String variable) {
        String message = "Invalid %s. Set the variable %s to a valid LUIS %s";
        System.out.println(String.format(message, what, variable, what));
        System.out.println("in the Java source file " + ex.getStackTrace()[0].getFileName());
    }
    
    static void printExceptionMsg(Exception ex) {
        System.out.println(String.format("%s: %s", 
                ex.getClass().getSimpleName(), ex.getMessage()));

        StackTraceElement caller = ex.getStackTrace()[1];
        System.out.println(String.format("    in %s (line %d?)", 
                caller.getFileName(), caller.getLineNumber()));
        if (ex instanceof StatusException)
           System.out.println(((StatusException)ex).getDetails());        
    }
    
    // ------------------------------------------------------------------------
    //
    // Command-line entry point
    //
    public static void main(String[] args) {

        // uncomment a line below to simulate command line options 
        // args = new String[]{args[0], "-train"};
        // args = new String[]{args[0], "-status"};

        LuisClient luis = null;
        
        try {
            luis = new LuisClient(LUIS_BASE, LUIS_APP_ID, 
                    LUIS_APP_VERSION,LUIS_PROGRAMMATIC_KEY);
        } catch (StatusException ex) {
            int status = ex.getStatus();
            if (status == 401) {
                printInvalidMsg(ex, "app ID", "LUIS_APP_ID");
            }
            else if (status == 400) {
                printInvalidMsg(ex, "app ID", "LUIS_APP_ID");
            } else {
                printExceptionMsg(ex);
            }
            System.exit(0);
        } catch (Exception ex) {
            printExceptionMsg(ex);
            System.exit(0);
        }

        // We shouldn't get here
        if (luis == null) {
            System.out.println("Unable to initialize LUIS client class.");
            System.exit(0);
        }
        
        try {
            
            if (args.length > 1) {  // handle command line flags
                String option = args[1].toLowerCase();
                if (option.startsWith("-"))     // strip leading hyphens
                    option = option.substring(option.lastIndexOf('-') + 1);
                if (option.equals("train")) {
                    System.out.println("Adding utterance(s).");
                    luis.addUtterances(UTTERANCE_FILE)
                            .write(RESULTS_FILE)
                            .raiseForStatus();
                    System.out.println("Added utterance(s). Requesting training.");
                    luis.train()
                            .write(RESULTS_FILE)
                            .raiseForStatus();
                    System.out.println("Requested training. Requesting training status.");
                    luis.status()
                            .write(RESULTS_FILE)
                            .raiseForStatus();
                } else if (option.equals("status")) {
                    System.out.println("Requesting training status.");
                    luis.status()
                            .write(RESULTS_FILE)
                            .raiseForStatus();
                }
            } else {
                System.out.println("Adding utterance(s).");
                luis.addUtterances(UTTERANCE_FILE)
                        .write(RESULTS_FILE)
                        .raiseForStatus();
            }
            
            System.out.println("Success! Results in " + RESULTS_FILE);
            
        } catch (Exception ex) {
            printExceptionMsg(ex);
        }
    }
    
}
