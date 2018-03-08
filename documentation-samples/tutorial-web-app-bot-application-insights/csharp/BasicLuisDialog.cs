using System;
using System.Configuration;
using System.Threading.Tasks;

using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Luis;
using Microsoft.Bot.Builder.Luis.Models;

using System.Collections.Generic;
using System.Text;
// LUIS Tutorial - add dependencies
using Microsoft.ApplicationInsights;

namespace Microsoft.Bot.Sample.LuisBot
{
    // LUIS Tutorial - For more information about this template visit https://aka.ms/tut-csharp-appinsights
    [Serializable]
    public class BasicLuisDialog : LuisDialog<object>
    {
        // LUIS Tutorial - CONSTANTS        
        // LUIS Tutorial - Entity
        public const string Entity_Device = "HomeAutomation.Device";
        public const string Entity_Room = "HomeAutomation.Room";
        public const string Entity_Operation = "HomeAutomation.Operation";
        
        // LUIS Tutorial - Intents
        public const string Intent_TurnOn = "HomeAutomation.TurnOn";
        public const string Intent_TurnOff = "HomeAutomation.TurnOff";
        public const string Intent_None = "None";

        // LUIS Tutorial - grab App Settings
        public BasicLuisDialog() : base(new LuisService(new LuisModelAttribute(
            ConfigurationManager.AppSettings["LuisAppId"], 
            ConfigurationManager.AppSettings["LuisAPIKey"], 
            domain: ConfigurationManager.AppSettings["LuisAPIHostName"])))
        {
            
        }

        // LUIS Tutorial - Entities found in result
        public string BotEntityRecognition(LuisResult result)
        {
            StringBuilder entityResults = new StringBuilder();
        
            if(result.Entities.Count>0)
            {
                foreach (EntityRecommendation item in result.Entities)
                {
                    // Query: Turn on the [light]
                    // item.Type = "HomeAutomation.Device"
                    // item.Entity = "light"
                    entityResults.Append(item.Type + "=" + item.Entity + ",");
                }
                // remove last comma
                entityResults.Remove(entityResults.Length - 1, 1);
            }
        
            return entityResults.ToString();
        }

        // LUIS Tutorial
        public void LogToApplicationInsights(LuisResult result)
        {
            // Create Application Insights object
            TelemetryClient telemetry = new TelemetryClient();
            
            // Set Application Insights Instrumentation Key from App Settings
            telemetry.Context.InstrumentationKey = ConfigurationManager.AppSettings["BotDevAppInsightsKey"];

            // Collect information to send to Application Insights
            Dictionary<string, string> logProperties = new Dictionary<string, string>();
            logProperties.Add("LUIS_query", result.Query);
            logProperties.Add("LUIS_topScoringIntent", result.TopScoringIntent.Intent);
            logProperties.Add("LUIS_topScoringIntentScore", result.TopScoringIntent.Score.ToString());


            // Add entities to collected information
            int i=1;
            if(result.Entities.Count>0)
            {
                foreach (EntityRecommendation item in result.Entities)
                {
                    // Query: Turn on the [light]
                    // item.Type = "HomeAutomation.Device"
                    // item.Entity = "light"
                    logProperties.Add("LUIS_entities_" + i++ + "_" + item.Type, item.Entity);
                }
            }

            // Send to Application Insights
            telemetry.TrackTrace("LUIS", ApplicationInsights.DataContracts.SeverityLevel.Information, logProperties);
        }

        [LuisIntent(Intent_None)]
        public async Task NoneIntent(IDialogContext context, LuisResult result)
        {
            await this.ShowLuisResult(context, result);
        }

        [LuisIntent(Intent_TurnOn)]
        public async Task OnIntent(IDialogContext context, LuisResult result)
        {
            await this.ShowLuisResult(context, result);
        }
        
        [LuisIntent(Intent_TurnOff)]
        public async Task OffIntent(IDialogContext context, LuisResult result)
        {
            await this.ShowLuisResult(context, result);
        }

        private async Task ShowLuisResult(IDialogContext context, LuisResult result) 
        {
            // LUIS Tutorial - Process result to ApplicationInsights
            LogToApplicationInsights(result);
            
            // get recognized entities
            string entities = this.BotEntityRecognition(result);
            
            // round number
            string roundedScore =  result.Intents[0].Score != null ? (Math.Round(result.Intents[0].Score.Value, 2).ToString()) : "0";

            await context.PostAsync($"**Query**: {result.Query}, **Intent**: {result.Intents[0].Intent}, **Score**: {roundedScore}. **Entities**: {entities}");
            context.Wait(MessageReceived);
        }
    }
}