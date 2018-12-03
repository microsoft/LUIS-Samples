# LUIS Samples

Welcome to the Language Understanding ([LUIS](https://azure.microsoft.com/en-us/services/cognitive-services/language-understanding-intelligent-service/)) samples repository. LUIS allows your application to understand what a person wants in their own words. LUIS uses machine learning to allow developers to build applications that can receive user input in natural language and extract meaning from it.

## Create your Azure LUIS service

Use the `Deploy to Azure` button to quickly create an Azure LUIS service. You get one free LUIS service per account. The free service has a sku of `F0`. The basic tier has a sku of `S0`.

[![Create LUIS Service on Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

## Examples by language

|Example| CSharp | Java | Node.js | Javascript | Python | PHP | Ruby| JSON | GO |
| -- | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
|[Create and customize a LUIS app (Authoring)](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/LUIS/Authoring)|  ✔ | | ||||||
|[Predict user utterances (Runtime)](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/LUIS/Runtime)|  ✔ | | ||||||
|[Build app programmatically](examples/build-app-programmatically-csv) | |  |✔|||||||
|[Upload utterances from query log](./examples/demo-upload-example-utterances/demo-Upload-utterances-from-querylog) | |  |✔|||||||
|[Upload utterances from exported app](./examples/demo-upload-example-utterances/demo-upload-utterances-from-exported-luis-app/) | |  |✔|||||||
|**[Quickstarts: Change model](./documentation-samples/quickstarts/change-model/)** | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) ||![Docker](./media/docker-logo.png)|
|**[Quickstarts: Analyze text](./documentation-samples/quickstarts/analyze-text/)** | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) ||![Docker](./media/docker-logo.png)|
|[Azure function to LUIS endpoint](./examples/azure-function-endpoint/) | ✔ |||||||||
|[Backup all apps in Subscription](./examples/backup/) | |  |✔|||||||
|[Add list entity](./documentation-samples/tutorial-list-entity/) | |  |✔|||||||
|[*Notes app sample ](./examples/notes-app/) | ✔  | | ![Docker](./media/docker-logo.png) ||||||
|[App model definition - Bookflight](./documentation-samples/Examples-BookFlight/) |||||||| ✔ ||
|[App model definition - Colors](./documentation-samples/Examples-Colors/) |||||||| ✔ ||
|[App model definition - IoT](./documentation-samples/examples-IoT) |||||||| ✔ ||
|[Phrase lists](./examples/phrase_list) | |  ||||||✔||
|[Bing Spell Check](./examples/bing-spell-check) | |  ||✔||||||
|[Azure function with application insights](./examples/azure-function-application-insights-endpoint) |✔ |  ||||||||
|[Download query log asynchronously](./examples/async-query-log/nodejs/)|||✔|||||||
|[Get region from app ID and subscription key](./documentation-samples/find-region/)|✔||✔|||||||
|[*Bot Integration sample - hotel finder](./bot-integration-samples/hotel-finder/) |  ✔ | | ✔ ||||||
|[Bot Integration sample - HomeAutomation](./documentation-samples/tutorial-web-app-bot) |  ✔ | | ✔ ||||||
|[Bot Integration sample - HomeAutomation & Application Insights](./documentation-samples/tutorial-web-app-bot-application-insights) | ✔  | | ✔ ||||||
|[Bot Integration sample - <br>Study Bot](https://github.com/Azure-Samples/cognitive-services-studybot-csharp) | ✔  | | ||||||

\* = example demonstrates complete cycle: create, train, publish, query

## Examples by usage

|Example|Demonstrates|
|--|--|
|[Create and customize a LUIS app (Authoring)](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/LUIS/Authoring) |Uses the LUIS SDK to create then customize an app |
|[Predict user utterances (Runtime)](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/LUIS/Runtime)| Uses the LUIS SDK to show utterance relevancy and intent scores |
|[Build app programmatically](examples/build-app-programmatically-csv) |Authoring API |
|[Upload utterances from query log](./examples/demo-upload-example-utterances/demo-Upload-utterances-from-querylog) |Authoring API |
|[Upload utterances from exported app](./examples/demo-upload-example-utterances/demo-upload-utterances-from-exported-luis-app/) |Authoring API |
|[Add an utterance to app model](./documentation-samples/authoring-api-samples/) |Authoring API |
|[Send utterance to endpoint](./documentation-samples/endpoint-api-samples/) |Endpoint API, Public app |
|[Azure function to LUIS endpoint](./examples/azure-function-endpoint/) |Endpoint API |
|[Backup all apps in Subscription](./examples/backup/) |Authoring API |
|[Notes app sample ](./examples/notes-app/) |Create-Train-Publish-Query, Prebuilt domain |
|[App model definition - Bookflight](./documentation-samples/Examples-BookFlight/) |Hierarchical entity, Composite entity, List entity, datetimeV2 prebuilt entity, number prebuilt entity, upload labeled utterance|
|[App model definition - Colors](./documentation-samples/Examples-Colors/) |Phrase list feature|
|[App model definition - IoT](./documentation-samples/examples-IoT) |Prebuilt domain|
|[Phrase lists](./examples/phrase_list) |Phrase list feature, Hierarchical entity, datetimeV2 prebuilt entity, number prebuilt entity |
|[Bing Spell Check](./examples/bing-spell-check) |Public App |
|[Azure function with application insights](./examples/azure-function-application-insights-endpoint) |Azure function, Application Insights |
|[Add list entity](./documentation-samples/tutorial-list-entity/) |List entity, train, query|
|[Download query log asynchronously](./examples/async-query-log/nodejs/)|Authoring API|
|[Bot Integration sample - hotel finder](./bot-integration-samples/hotel-finder/) |Bot Framework SDK, Create-Train-Publish-Query |
|[Bot Integration sample - HomeAutomation](./documentation-samples/tutorial-web-app-bot) |Web app bot |
|[Bot Integration sample - HomeAutomation & Application Insights](./documentation-samples/tutorial-web-app-bot-application-insights) |Web app bot, Application Insights |
|[Bot Integration sample - Study Bot](https://github.com/Azure-Samples/cognitive-services-studybot-csharp) | Web app bot that integrates QnA Maker and Bing Spell Check |


## Interactive app
Ask LUIS to turn on the lights in this [interactive demonstration](https://azure.microsoft.com/en-us/services/cognitive-services/language-understanding-intelligent-service/).

Tell the [Contoso Health bot](https://healthbotcontainer.azurewebsites.net/) where you are injured and the bot will recommend remedies.

## References
* [LUIS Docs](https://docs.microsoft.com/azure/cognitive-services/LUIS/)
* [FAQs](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/luis-resources-faq), [Regions](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/luis-reference-regions), [limits](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/luis-boundaries), [Supported languages](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/luis-supported-languages)

## APIs
* [Authoring model API V2 docs](https://aka.ms/luis-authoring-apis)
* [Analyze text](https://aka.ms/luis-endpoint-apis)
* [API route changes](./authoring-routes.md) last updated Dec 03, 2018

## SDKs
* [.NET Authoring model](https://aka.ms/luis-sdk-dotnet-authoring)
* [.NET Analyze text](https://aka.ms/luis-sdk-dotnet-runtime)
* [Go](https://aka.ms/luis-sdk-go)
* [Java](https://aka.ms/luis-java-sdk)
* [Node.js Authoring model](http://aka.ms/luis-sdk-node-authoring)
* [Node.js Analyze text](http://aka.ms/luis-sdk-node-endpoint)
* [Python](https://aka.ms/luis-python-sdk)

## Azure REST API
* [Azure REST API Specifications](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/cognitiveservices/data-plane/LUIS): LUIS swagger files

## Azure CLI
* [Cognitive Services](https://aka.ms/az-cli-cognitiveservices)

## Azure RM Powershell
* [Cognitive Services](https://aka.ms/azure-powershell-cognitiveservices)

## Common HTTP response codes
[Http codes](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/luis-reference-response-codes)

## Integrations
* [Bot Framework](https://docs.microsoft.com/bot-framework/)
* BotBuilder v4, [Nodejs](https://github.com/Microsoft/botbuilder-js), [.Net](https://github.com/Microsoft/botbuilder-dotnet). Coming soon: Python & Java
* BotBuilder v4 LUIS libraries: [Nodejs](https://www.npmjs.com/package/botframework-luis) NPM package, [.Net](https://www.nuget.org/packages/Microsoft.Bot.Builder.Ai/) NuGet package
* [Bot Builder Samples](https://github.com/Microsoft/BotBuilder-Samples)
* [Bot Builder Tools](https://github.com/Microsoft/botbuilder-tools)

## Related Services
* [QnA Maker](https://qnamaker.ai/)
* [Bing Speech API](https://azure.microsoft.com/services/cognitive-services/speech/)
* [Bing Spell Check API](https://azure.microsoft.com/services/cognitive-services/spell-check/)

## Dependencies
* [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) for prebuilt entities

## Azure status
[Regional availability](https://azure.microsoft.com/global-infrastructure/services/): LUIS is part of the AI and Machine Learning section.

## Videos

### //BUILD 2018
* [Azure Friday At Build 2018: Cognitive Services - Language (LUIS)](https://channel9.msdn.com/Shows/Azure-Friday/At-Build-2018-Cognitive-Services-Language-LUIS/player)
* [Build 2018 AI Show - What’s New with Language Understanding Service](https://channel9.msdn.com/Shows/AI-Show/Whats-New-with-Language-Understanding-Service-LUIS/player)
* [Build 2018 Session - Bot intelligence, Speech Capabilities, and NLU best practices](https://channel9.msdn.com/events/Build/2018/BRK3208)
* [Build 2018 - LUIS Updates](https://channel9.msdn.com/events/Build/2018/THR3118/player)

### Other videos
* [Introduction to LUIS](https://aka.ms/luis-intro-video)
* [Advanced learning with LUIS](https://www.youtube.com/watch?v=39L0Gv2EcSk)
* [Channel 9 Deep Dive into LUIS and Chatbots](https://channel9.msdn.com/Blogs/MVP-Azure/Cognitive-Services-Episode-3-Deep-dive-into-LUIS-and-Chatbots)
* [Conference Buddy Bot - AI Show](https://www.youtube.com/watch?v=LSlipMoz2vY)

## LUIS with Bot framework Blog
* [blog.botframework.com](https://blog.botframework.com/category/luis/)

## Courses including LUIS

* Mixed reality: [MR and Azure 303: Natural language understanding](https://docs.microsoft.com/windows/mixed-reality/mr-azure-303)

## Related Microsoft Projects

* [Prebuilt entity recognizer](https://github.com/Microsoft/Recognizers-Text)
* [Azure Code Samples for LUIS](https://azure.microsoft.com/resources/samples/?sort=0&term=Luis)
* [Universal Language Intelligence Service - Nodejs](https://github.com/Microsoft/Universal-Language-Intelligence-Service): A wrapper for the Microsoft LUIS cognitive that provides universal language support (after training) using the Bing Translate API
* [Microsoft Cognitive Services control for Microsoft Bot Builder - C# & Nodejs](https://github.com/Microsoft/BotBuilder-CognitiveServices): The cognitive services control makes consuming different Microsoft Cognitive Services easy for bots developed using Microsoft Bot Builder SDK. The control is available for C# and Node.js SDKs.
* [Activate Azure with Intelligent Apps - C#](https://github.com/Microsoft/intelligent-apps): Fabrikam Investment Bank Customer Service uses LUIS
* [LUIS Console Application Sample - C#](https://github.com/Azure-Samples/Cognitive-Services-LUIS-Console-Application)
* [Adaptive Cards](https://github.com/Microsoft/AdaptiveCards/)
* [Octobot from the Sandbox](https://docs.microsoft.com/sandbox/demos/octobot)
* [Microsoft Health Bot](https://docs.microsoft.com/healthbot/)

## Searching docs
* [Azure RSS for 'LUIS'](https://docs.microsoft.com/api/search/rss?search=LUIS&locale=en-us)

## Community Projects
If you find an open-source project or sample using LUIS, submit a PR for the [community-projects.md](community-projects.md) file.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

