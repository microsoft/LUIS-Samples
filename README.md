
# LUIS Samples

Welcome to the Language Understanding ([LUIS](https://azure.microsoft.com/en-us/services/cognitive-services/language-understanding-intelligent-service/)) samples repository. LUIS allows your application to understand what a person wants in their own words. LUIS uses machine learning to allow developers to build applications that can receive user input in natural language and extract meaning from it.

## Create your Azure LUIS service

Use the `Deploy to Azure` button to quickly create an Azure LUIS service. You get one free LUIS service per account. The free service has a sku of `F0`. The basic tier has a sku of `S0`.

[![Create LUIS Service on Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

## Examples by language

|Example| CSharp | Java | Node.js | Javascript | Python | PHP | Ruby| JSON | 
| -- | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
|[*Bot Integration sample - hotel finder](./bot-integration-samples/hotel-finder/) |  ✔ | | ✔ |||||
|[Add an utterance to app model](./documentation-samples/authoring-api-samples/) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ ||
|[Send utterance to endpoint](./documentation-samples/endpoint-api-samples/) | ✔ | ![Docker](./media/docker-logo.png) | ![Docker](./media/docker-logo.png) | ✔ | ✔ | ✔ | ✔ ||
|[Azure function to LUIS endpoint](./examples/azure-function-endpoint/) | ✔ ||||||||
|[Backup all apps in Subscription](./examples/backup/) | |  |✔||||||
|[Build app programmatically](examples/build-app-programmatically-csv) | |  |✔||||||
|[Upload utterances from query log](./examples/demo-upload-example-utterances/demo-Upload-utterances-from-querylog) | |  |✔||||||
|[Upload utterances from exported app](./examples/demo-upload-example-utterances/demo-upload-utterances-from-exported-luis-app/) | |  |✔||||||
|[*Notes app sample ](./examples/notes-app/) | ✔  | | ![Docker](./media/docker-logo.png) |||||
|[App model definition - Bookflight](./documentation-samples/Examples-BookFlight/) |||||||| ✔ |
|[App model definition - Colors](./documentation-samples/Examples-Colors/) |||||||| ✔ |
|[App model definition - IoT](./documentation-samples/examples-IoT) |||||||| ✔ |
|[Phrase lists](./examples/phrase_list) | |  ||||||✔|
|[Bing Spell Check](./examples/bing-spell-check) | |  ||✔|||||

\* = example demonstrates complete cycle: create, train, publish, query

## Examples by usage

|Example|Demonstrates|
|--|--|
|[Bot Integration sample - hotel finder](./bot-integration-samples/hotel-finder/) |Bot Framework SDK, Create-Train-Publish-Query |
|[Add an utterance to app model](./documentation-samples/authoring-api-samples/) |Authoring API |
|[Send utterance to endpoint](./documentation-samples/endpoint-api-samples/) |Endpoint API, Public app |
|[Azure function to LUIS endpoint](./examples/azure-function-endpoint/) |Endpoint API |
|[Backup all apps in Subscription](./examples/backup/) |Authoring API |
|[Build app programmatically](examples/build-app-programmatically-csv) |Authoring API |
|[Upload utterances from query log](./examples/demo-upload-example-utterances/demo-Upload-utterances-from-querylog) |Authoring API |
|[Upload utterances from exported app](./examples/demo-upload-example-utterances/demo-upload-utterances-from-exported-luis-app/) |Authoring API |
|[Notes app sample ](./examples/notes-app/) |Create-Train-Publish-Query, Prebuilt domain |
|[App model definition - Bookflight](./documentation-samples/Examples-BookFlight/) |Hierarchical entity, Composite entity, List entity, datetimeV2 prebuilt entity, number prebuilt entity, upload labeled utterance|
|[App model definition - Colors](./documentation-samples/Examples-Colors/) |Phrase list feature|
|[App model definition - IoT](./documentation-samples/examples-IoT) |Prebuilt domain|
|[Phrase lists](./examples/phrase_list) |Phrase list feature, Hierarchical entity, datetimeV2 prebuilt entity, number prebuilt entity |
|[Bing Spell Check](./examples/bing-spell-check) |Public App |


## Interactive app
Ask LUIS to turn on the lights in this [interactive demonstration](https://azure.microsoft.com/en-us/services/cognitive-services/language-understanding-intelligent-service/).

## References

* [LUIS Docs](https://docs.microsoft.com/azure/cognitive-services/LUIS/)
* [Authoring API docs](https://aka.ms/luis-authoring-api)
* [Endpoint API docs](https://aka.ms/luis-endpoint-apis)
* [Bot Framework](https://docs.microsoft.com/bot-framework/)
* [Bot Builder Samples](https://github.com/Microsoft/BotBuilder-Samples)

## Videos

* [Introduction to LUIS](https://aka.ms/luis-intro-video)
* [Advanced learning with LUIS](https://www.youtube.com/watch?v=39L0Gv2EcSk)
* [Channel 9 Deep Dive into LUIS and Chatbots](https://channel9.msdn.com/Blogs/MVP-Azure/Cognitive-Services-Episode-3-Deep-dive-into-LUIS-and-Chatbots)

## Related Projects

* [Bot Builder Samples](https://github.com/Microsoft/BotBuilder-Samples): Bot Builder samples are organized into groups and designed to illustrate task-focused samples in C# and Node.js to help you build great bots!
* [Azure REST API Specifications](https://github.com/Azure/azure-rest-api-specs)
* [Universal Language Intelligence Service](https://github.com/Microsoft/Universal-Language-Intelligence-Service): A wrapper for the Microsoft LUIS cognitive that provides universal language support (after training) using the bing translate api

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

