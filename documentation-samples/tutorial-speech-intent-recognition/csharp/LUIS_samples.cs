/*
 *
 * The class calls from Speech service to LUIS endpoint.
 * For more info, check out the documentation:
 * https://aka.ms/luis-intent-recognition-tutorial
 * 
*/

using System;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;

namespace MicrosoftSpeechSDKSamples
{
    class LuisSamples
    {

        public static async Task RecognitionWithLUIS()
        {
            // Create a LUIS endpoint key in the Azure portal, add the key on 
            // the LUIS publish page, and use again here. Do not use starter key!
            var luisSubscriptionKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
            var luisRegion = "westus";
            var luisAppId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
            var speechRegion ="";

            // region must be empty string
            // must use same LUIS guid in both places
            var factory = SpeechFactory.FromSubscription(luisSubscriptionKey, speechRegion);

            // Create an intent recognizer using microphone as audio input.
            using (var recognizer = factory.CreateIntentRecognizer())
            {

                // Create a LanguageUnderstandingModel to use with the intent recognizer
                var model = Microsoft.CognitiveServices.Speech.Intent.LanguageUnderstandingModel.FromSubscription(luisSubscriptionKey, luisAppId, luisRegion);

                // Add intents from your LU model to your intent recognizer
                // These intents are based on the Human Resources model imported at
                // ../../quickstarts/HumanResources.json
                recognizer.AddIntent("None", model, "None");
                recognizer.AddIntent("FindForm", model, "FindForm");
                recognizer.AddIntent("GetEmployeeBenefits", model, "GetEmployeeBenefits");
                recognizer.AddIntent("GetEmployeeOrgChart", model, "GetEmployeeOrgChart");
                recognizer.AddIntent("MoveAssetsOrPeople", model, "MoveAssetsOrPeople");

                // Prompt the user to speak
                Console.WriteLine("Say something...");

                // Start recognition; will return the first result recognized
                var result = await recognizer.RecognizeAsync().ConfigureAwait(false);

                // Check the reason returned
                if (result.RecognitionStatus == RecognitionStatus.Recognized)
                {
                    Console.WriteLine($"{result.ToString()}");
                }
                else if (result.RecognitionStatus == RecognitionStatus.NoMatch)
                {
                    Console.WriteLine("We didn't hear you say anything...");
                }
                else if (result.RecognitionStatus == RecognitionStatus.Canceled)
                {
                    Console.WriteLine($"There was an error; reason {result.RecognitionStatus}-{result.RecognizedText}");
                }
            }
        }
    }
}
