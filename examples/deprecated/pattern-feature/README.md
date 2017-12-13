## Pattern Feature

The __[Pattern feature][LuisFeatures]__ which helped recognize words and phrases that follow a pattern defined by a regular expression, has been deprecated. In the current version of LUIS, if you have entities that follow a pattern, simply label examples of them. The functionality to add pattern features to a LUIS app has been removed. However, if you have existing LUIS apps that implement a pattern feature, they will be supported until December 2018.

You can import a sample LUIS app LUIS app that uses a pattern feature to help recognize hyphenated names [here][SampleHyphenatedNamesModel].

### Add utterances for hyphenated names

Let's say your chatbot has a `MyNameIs` intent that detects when the user tells you their name, and a `Name` entity for detecting this name.

<!-- 
![screenshot of intent][Intents]

![screenshot of name entity][Entity] -->

To recognize names that have a hyphen, like "Ann-Marie", add some utterances to the MyNameIs intent that have names of this type.

<!--

![screenshot of utterances][Utterances]


To add a pattern feature, under **Features**, click **Pattern features** and then click the **Add pattern feature** button. 

Enter `^\w+-\w+$` for the pattern value. The `^` indicates the beginning of the string. The `\w` indicates an alphanumeric character. The `+` indicates one or more occurences of the character preceding it.

![screenshot of adding the pattern][AddPattern]

-->

### Test the app
In the **Train and Test** pane, click **Train Application**. Once your app is trained, you can see how the LUIS app can recognize hyphenated names in utterances.

<!-- 

![screenshot of interactive test][InteractiveTest]
-->

### Publish the app
You can publish the LUIS app and view the results in a web browser.

#### Example results from published LUIS app

Paste a query to your published LUIS app into a web browser. The format of the URL should be similar to the one that follows. 
```
https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY&staging=true&verbose=true&timezoneOffset=0&q=my%20name%20is%20ann-marie
```

When the results are displayed in the browser you can see how the `Name` entity is identified. Note that in the `entity` field, LUIS inserts spaces around the hyphen, but the `startIndex` and `endIndex` fields identify the indexes of the entity in the original utterance.

```
{
  "query": "my name is ann-marie",
  "topScoringIntent": {
    "intent": "MyNameIs",
    "score": 0.9736568
  },
  "intents": [
    {
      "intent": "MyNameIs",
      "score": 0.9736568
    },
    {
      "intent": "None",
      "score": 0.113408491
    }
  ],
  "entities": [
    {
      "entity": "ann - marie",
      "type": "Name",
      "startIndex": 11,
      "endIndex": 19,
      "score": 0.862268746
    }
  ]
}
```
___

The LUIS app used in this example can be found __[here][SampleHyphenatedNamesModel]__. 

Additional reading on __[LUIS Features][LuisFeatures]__ can be found here.


  [Intents]: ./screenshots/intents.png
  [Entity]: ./screenshots/name-entity.png
  [Utterances]: ./screenshots/hyphen-utterances.png
  [PatternFeatures]: ./screenshots/pattern-features.png
  [AddPattern]: ./screenshots/add-pattern.png
  [InteractiveTest]: ./screenshots/interactive-test.png


  [SampleHyphenatedNamesModel]: ./hyphenated-names.json
  [LuisFeatures]: https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-concept-feature