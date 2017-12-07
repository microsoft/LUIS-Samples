# Azure Function

This example wraps the [LUIS](https://docs.microsoft.com/azure/cognitive-services/LUIS/) endpoint query in an [Azure Function](https://azure.microsoft.com/services/functions/). 

The bot/client app HTTP calls into the [C# HttpTrigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function) function. The Azure function passes the query to LUIS, gets the response, and then inserts the response to a [SQL table](https://azure.microsoft.com/services/sql-database/). 

## Real-time query logging
LUIS currently provides a [30 day log](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c36)  as a single file download. Alternatively, this example captures log information per query and inserts the LUIS response into a SQL table. Since SQL now provides [JSON path queries](https://docs.microsoft.com/sql/relational-databases/json/json-path-expressions-sql-server), you can quickly query into your logs. 

Since you have the request at the point of origin, and the results, you can alter the bot/client app to add even more meaningful information to the log including user information such as location, email, etc. These additional features are not demonstrated in this example.

## Before you begin
* Azure subscription - if you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 
* [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) with table to receive INSERT tsql statement and the connection string.

## Azure SQL Database
The code in this example inserts the JSON response from LUIS as text. You may choose to store it in a different type of database or a different type of column in SQL Server. The code specific to the database INSERT is commented so you can easily replace it with code for your needs.

This example does not use best practices. You should apply your own security and data cleaning before inserting into the table. 

The table used in this example is simple: 

```SQL
CREATE TABLE [dbo].[LUIS](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Endpoint][nvarchar](300) NOT NULL,
	[Subscription][nvarchar](50) NOT NULL,
	[Application][nvarchar](50) NOT NULL,
	[Query] [nvarchar](max) NOT NULL,
	DateCreated DATETIME NOT NULL DEFAULT(GETDATE()),
 CONSTRAINT [PK_LUIS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
```

## Azure Functions
Azure functions allow you to quickly get an HTTP endpoint without dealing with the configuration or management of an Internet server. 

Instead of making an HTTP call to the LUIS endpoint, you will make an HTTP call to the Azure function. You pass the LUIS utterance either in the HTTP GET query string or in the HTTP POST body to the Azure function.  

The Azure function gets the LUIS utterance, as "query", then passes it along to the LUIS endpoint. The Azure function gets the LUIS response, inserts the response into the SQL table, then returns the LUIS response back to the bot or client app. 

This example was written inside the Azure portal for Azure functions. If you want to create the Azure function in Visual Studio and publish, you may need to [take different steps](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-your-first-function-visual-studio). 

## Edit and run the code
Copy the code in [run.csx](./run.csx) into a new C# HTTPTrigger function. Make sure to change the variable values before testing the Azure function in the Azure portal:
* LUISappID - LUIS app ID
* LUISsubscriptionKey - LUIS subscription ID
* SQLconnectionString - SQL connection string including Azure SQL `YOUR_DATABASE_NAME`, `YOUR_CATALOG`, `USER`, `PASSWORD`
