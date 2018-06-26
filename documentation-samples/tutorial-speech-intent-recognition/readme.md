# Speech to intent 
Read more about speech to intent from the [tutorial](https://aka.ms/luis-intent-recognition-tutorial). 

Before using this code, import the [Human Resources app](../../quickstarts/HumanResources.json). This has intents, entities, and example utterances. 

The key piece of LUIS code is found at ./csharp/LUIS.samples.cs.

Instead of using the Speech subscription key, you need to create the speech factory with the LUIS endpoint key. Do not use the free starter key.

If you are interested in more information about the Speech services, read through the [documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/) and download the [SDK](https://github.com/Azure-Samples/cognitive-services-speech-sdk). 