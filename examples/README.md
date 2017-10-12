# LUIS Samples - Examples

These samples provide LUIS apps to demonstrate scenarios. You can import the LUIS app in [luis.ai][LUIS] to learn about features of LUIS.

## Examples

* [Phrase List Example][PhraseList]: The phrase list example demonstrates how to use a simple [phrase list feature][PhraseListDoc] to improve a LUIS app's performance. 

  [PhraseList]: ./phrase_list/README.md
  [PhraseListDoc]: https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/add-features#phrase-list-features
  [LUIS]: https://www.luis.ai

* [Batch Upload Utterances Example][BatchUpload]: The batch upload utterances example demonstrates how to download the LUIS query log, parse the log into a batch of utterances, then upload the batch back to LUIS for testing and training purposes. You must provide a LUIS subscription key and LUIS application id.

  [BatchUpload]: ./demo-Upload-utterances-from-querylog/readme.md

* [Batch Upload IOT Lights Example][BatchIOTUpload]: The batch upload utterances example demonstrates how to use queries from other tools, parse the log into a batch of utterances, then upload the batch back to LUIS for testing and training purposes. You must provide a LUIS subscription key and LUIS application id.

  [BatchIOTUpload]: ./demo-Upload-utterances-from-iot-lights/readme.md
