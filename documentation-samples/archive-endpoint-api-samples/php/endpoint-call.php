<?php

// NOTE: Be sure to uncomment the following line in your php.ini file.
// ;extension=php_openssl.dll

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// The ID of a public sample LUIS app that recognizes intents for turning on and off lights
$appId = "df67dcdb-c37d-46af-88e1-8b97951ca1c2";

// Replace the subscriptionKey string value with your valid Azure Subscription key.
$subscriptionKey = "YOUR-SUBSCRIPTION-KEY";

// The endpoint URI below is for the West US region.
// If your subscription is in a different region, update accordingly.
$endpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";

// The LUIS query term
$term = "turn on the left light";

function LuisQuery($url, $app, $key, $query) {
    // Prepare HTTP request
    // NOTE: Use the key 'http' even if you are making an HTTPS request. See:
    // http://php.net/manual/en/function.stream-context-create.php
    $headers = "Ocp-Apim-Subscription-Key: $key\r\n";
    $options = array ( 'http' => array (
                           'header' => $headers,
                           'method' => 'GET',
                           'ignore_errors' => true));

    // build query string
    $qs = http_build_query( array (
        "q" => $query,
        "timezoneOffset" => 0,
        "verbose" => "false",
        "spellCheck" => "false",
        "staging" => "false"
      )
    );

    $url = $url . $app . "?" . $qs;
    print($url);

    // Perform the Web request and get the JSON response
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    return $result;
}

if (strlen($subscriptionKey) == 32) {

    print("LUIS Query: " . $term . "\n");

    $json = LuisQuery($endpoint, $appId, $subscriptionKey, $term);

    print("\nJSON Response:\n\n");
    print(json_encode(json_decode($json), JSON_PRETTY_PRINT));

} else {

    print("Invalid LUIS API subscription key!\n");
    print("Please paste yours into the source code.\n");

}
?>
