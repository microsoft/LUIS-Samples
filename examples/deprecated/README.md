## Deprecated Features

The __[Pattern feature][LuisFeatures]__ which helped recognize words and phrases that follow a pattern defined by a regular expression, has been deprecated. In the current version of LUIS, if you have entities that follow a pattern, simply label examples of them. The functionality to add pattern features to a LUIS app has been removed. However, if you have existing LUIS apps that implement a pattern feature, they will be supported until December 2018.


___



Additional reading on __[LUIS Features][LuisFeatures]__ can be found here.


  [Intents]: ./screenshots/intents.png
  [Entity]: ./screenshots/name-entity.png
  [Utterances]: ./screenshots/hyphen-utterances.png
  [PatternFeatures]: ./screenshots/pattern-features.png
  [AddPattern]: ./screenshots/add-pattern.png
  [InteractiveTest]: ./screenshots/interactive-test.png


  [SampleHyphenatedNamesModel]: ./hyphenated-names.json
  [LuisFeatures]: https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-concept-feature