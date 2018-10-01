# LUIS Notes app with CSharp

This .Net 2.0 Core example creates a LUIS app using the prebuilt domain "Note", then it trains, publishes, and queries the endpoint for the new app.

If you run this example more than once, you need to delete the Note app before running this example again. 

## Prerequisites
* Change the `subscriptionID` value in `Program.cs` to your own LUIS subscription key found under your User account in [LUIS.ai](https://www.luis.ai). 
* Either [Visual Studio Community 2017](https://www.visualstudio.com/downloads/) or the [.Net Core 2.0 cli](https://docs.microsoft.com/dotnet/core/tools/?tabs=netcore2x). 

## Retry logic with Polly
Most of the HTTP calls will only be made once. However, after you train the app, you need to check the training status. The train status will return an array of items, each having a different status value. The app isn't trained until the entire array returns with a train status of `Success` or `UpToDate`. In order to continue polling until the entire array returns either of these values, this example uses [**Polly**](https://github.com/App-vNext/Polly/blob/master/README.md) with a WaitAndRetry strategy. You may find that your app needs different settings for the wait time and the retry limit. Both of these values are controlled by the variables `polly_retry_count` and `polly_pauseBetweenFailures`.

## Build and Run 
You can build / run this example with either [Visual Studio Community 2017](https://www.visualstudio.com/downloads/) or the [.Net Core 2.0 cli](https://docs.microsoft.com/dotnet/core/tools/?tabs=netcore2x). 
