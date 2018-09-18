# Get intent using C#

This quickstart uses a predefined LUIS app that can take a user query as text and return the best matching intent. This shows you how conversational text is linked to LUIS and its ability to return an intent that then has a task of its own. In this case, that task is turning on or off a light. There are options to try this sample: you can build a Visual Studio app or test the endpoint in a browser.

## Prerequisites

1. Visual Studio 2017

1. The public app ID is included in the Program.cs file as `df67dcdb-c37d-46af-88e1-8b97951ca1c2`.

1. Your LUIS account authoring key.

## Build app in Visual Studio

1. Create a new C# Console app.

1. Add `using System.Net.Http;` and `using System.Web;` at the top of your Program.cs file. Add both of these as a reference, by right-clicking `References` in Solution Explorer. Check the box for the references mentioned.

1. Copy the code from the Program.cs file in this sample into your app's Program.cs.

1. The code from this sample's Program.cs comes with a `luisAppId`, but you need to add the `endpointKey`. This is the same as your `Authoring Key` found in your [LUIS](https://www.luis.ai/user/settings) account. Get it by clicking on your user name in the top right, choose `Settings`, then copy the key. Add to your sample.

### Run the sample

1. Run the sample in Visual Studio and JSON will be returned in the console. The `turn on the left light` query gets matched with the `HomeAutomation.TurnOn` intent and the specific room (entity) it controls.

2. Change the query in the code to `turn off the living room light`. Run the sample and you'll see the `HomeAutomation.TurnOff`  is returned with the living room (entity) it controls.

## Test the sample in a browser

Follow the [Get intent with browser](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-get-started-cs-get-intent#get-intent-with-browser) section of the [Quickstart: Get intent using C#](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-get-started-cs-get-intent) to test in a browser.

## Understanding what LUIS returns

This sample shows how when you add a certain query, LUIS can figure out what intent it belongs to and return the right intent. Since this sample comes with a LUIS app ID, you are unable to view the LUIS intents under the hood, but creating your own LUIS app with a series of intents would work as well. To build your own custom LUIS app, try: [Tutorial 1: Build custom app to determine user intentions](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-quickstart-intents-only).
