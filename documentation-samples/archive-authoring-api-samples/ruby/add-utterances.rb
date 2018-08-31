require 'json'
require 'net/https'
require 'uri'

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# NOTE: Replace this with LUIS application ID.
appID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# NOTE: Replace this example LUIS application version number with the version number of your LUIS application.
appVersion = "0.1"

# NOTE: Replace this with LUIS AUTHORING KEY.
$key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

host = "https://westus.api.cognitive.microsoft.com"
path = "/luis/api/v2.0/apps/" + appID + "/versions/" + appVersion + "/"
$uri = host + path;

usage = "Usage:
add-utterances <input file>
add-utterances -train <input file>
add-utterances -status

The contents of <input file> must be in the format described at: https://aka.ms/add-utterance-json-format
"

def SendGet(uri)
	uri = URI(uri)
	request = Net::HTTP::Get.new(uri)
	request['Ocp-Apim-Subscription-Key'] = $key

	response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
		http.request (request)
	end

	return response.body
end

def SendPost(uri, body)
	uri = URI(uri)
	request = Net::HTTP::Post.new(uri)
	request['Content-type'] = 'text/json'
	request['Ocp-Apim-Subscription-Key'] = $key
	request.body = body

	response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
		http.request (request)
	end

	return response.body
end

def AddUtterances(input_file)
	content = File.read(input_file)
	puts "Added utterances."
	result = SendPost($uri+"examples",content)
	puts JSON.pretty_generate(JSON(result))
end

def Train(input_file)
	content = File.read(input_file)
	puts "Sent training request."
	result = SendPost($uri+"train",content)
    puts JSON.pretty_generate(JSON(result))
	Status()
end

def Status()
	puts "Requested training status."
	result = SendGet($uri+"train")
    puts JSON.pretty_generate(JSON(result))
end

args = ARGV

if (args.length < 1) then
	puts(usage)
else
	if (0 == args[0].casecmp("-train"))
		if (args.length > 1) then
			Train(args[1])
		else
			puts(usage)
		end
	elsif (0 == args[0].casecmp("-status")) then
		Status()
	else
		AddUtterances(args[0])
	end
end
