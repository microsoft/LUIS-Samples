<?php

// NOTE: Be sure to uncomment the following line in your php.ini file.
// ;extension=php_openssl.dll

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// NOTE: Replace this example LUIS application ID with the ID of your LUIS application.
$appID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

// NOTE: Replace this example LUIS application version number with the version number of your LUIS application.
$appVersion = "0.1";

// NOTE: Replace this example LUIS authoring key with a valid key.
$key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

$host = "https://westus.api.cognitive.microsoft.com";
$path = "/luis/api/v2.0/apps/" . $appID . "/versions/" . $appVersion . "/";
$uri = $host . $path;

$usage = "Usage:
add-utterances <input file>
add-utterances -train <input file>
add-utterances -status

The contents of <input file> must be in the format described at: https://aka.ms/add-utterance-json-format
";

function SendGet ($uri, $key) {

	echo "GET " . $uri;

	$headers = "Content-type: text/json\r\n" .
		"Ocp-Apim-Subscription-Key: $key\r\n";

	// NOTE: Use the key 'http' even if you are making an HTTPS request. See:
	// http://php.net/manual/en/function.stream-context-create.php
	$options = array (
		'http' => array (
			'header' => $headers,
			'method' => 'GET',
		)
	);
	// Perform the Web request and get the JSON response
	$context  = stream_context_create ($options);
	$result = file_get_contents ($uri, false, $context);
	return $result;
}

function SendPost ($uri, $key, $content) {

	echo "POST " . $uri;

	$headers = "Content-type: text/json\r\n" .
		"Ocp-Apim-Subscription-Key: $key\r\n";

	// NOTE: Use the key 'http' even if you are making an HTTPS request. See:
	// http://php.net/manual/en/function.stream-context-create.php
	$options = array (
		'http' => array (
			'header' => $headers,
			'method' => 'POST',
			'content' => $content
		)
	);
	// Perform the Web request and get the JSON response
	$context  = stream_context_create ($options);
	$result = file_get_contents ($uri, false, $context);
	return $result;
}

function AddUtterances($uri, $key, $input_file) {
	$content = file_get_contents ($input_file);
	echo "Added utterances.\n";
	$result = SendPost ($uri . "examples", $key, $content);
    echo json_encode (json_decode ($result), JSON_PRETTY_PRINT);
}

function Train($uri, $key, $input_file) {
	$content = file_get_contents ($input_file);
	echo "Sent training request.\n";
	$result = SendPost ($uri . "train", $key, $content);
    echo json_encode (json_decode ($result), JSON_PRETTY_PRINT);
	echo "\n";
	Status($uri, $key);
}

function Status($uri, $key) {
	echo "Requested training status.\n";
	$result = SendGet ($uri . "train", $key);
    echo json_encode (json_decode ($result), JSON_PRETTY_PRINT);
}

if ($argc < 2)
{
	echo $usage;
}
else
{
	if (0 === strcasecmp($argv[1], "-train")) {
		if ($argc > 2)
		{
			Train($uri, $key, $argv[2]);
		}
		else
		{
			echo $usage;
		}
	}
	else if (0 === strcasecmp($argv[1], "-status"))
	{
		Status($uri, $key);
	}
	else
	{
		AddUtterances($uri, $key, $argv[1]);
	}
}

?>