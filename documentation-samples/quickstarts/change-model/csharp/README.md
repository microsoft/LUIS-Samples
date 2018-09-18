# Travel Agent app

## Prerequisites

1. Visual Studio 2017

1. A free [LUIS](https://www.luis.ai/home) account.

1. In your LUIS account dashboard click `Import new app` to import the [TravelAgent.json](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/change-model/TravelAgent.json) file to create a new app.

1. Double-click the solution file to open the project. Dependencies include: System.Web (added as a reference). Inlcude these NuGet packages: JsonFormatterPlus, and CommandLineParser.

1. Add the LUIS ID, version, and authoring key to the top of the Program.cs file. These can be found under the `Manage` tab of your Travel Agent app in LUIS. Look under the `Application Information`, `Keys and Endpoints`, and `Versions` menus on the left.

## Run the sample

1. Run the application in the Windows Command Prompt from the `\bin\Debug` folder of this project. <br>
Execute this: `ConsoleApp1.exe --add utterances.json --train --status`

1. The resulting JSON responses will appear in the Command Prompt which show: added utterances and the training status.

1. Refer to this quickstart for additional details and JSON interpretation: [Quickstart: Change model using C#](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-get-started-cs-add-utterance)
