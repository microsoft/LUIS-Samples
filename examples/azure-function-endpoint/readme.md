# Azure Function

This example wraps the [LUIS](https://docs.microsoft.com/azure/cognitive-services/LUIS/) endpoint query in an [Azure Function](https://azure.microsoft.com/services/functions/). 

The bot/client app query is sent into the C# HttpTrigger Function. The function passes the query to LUIS, gets the response, and then inserts the response to a SQL table. 

## Problem
LUIS currently provides 30 day log downloads as a single file download. This example captures log information a query at a time and inserts into SQL. Since SQL now provides JSON path queries, you can quickly query into your logs without having to download the file from LUIS, insert the CSV, and query. 

Since you have the request as the point of origin, and the results, you can alter the bot/client app to add even more meaningful information to the log including user information such as location, email, etc. These additional features are not demonstrated in this example.


## Before you begin
* Azure subscription - if you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 
* [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) with table to receive INSERT tsql statement and the connection string

## Azure SQL Database
The code in this example inserts the JSON response from LUIS as text. You may choose to store it in a different type of database or a different type of column in SQL Server. The code specific to the database INSERT is commented so you can easily replace it with code for your needs.

This example does not use best practices. You should apply your own security and data cleaning before inserting into the table. 

The table used in this example is simple. 

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
Azure functions allow you to quickly get an HTTP endpoint without dealing with the configuration or management of an internet server. 

Instead of making an HTTP call to the LUIS endpoint, you will make an HTTP call to the Azure function. You pass the LUIS utterance either in the HTTP GET query string or in the HTTP POST body to the Azure function.  

The Azure function gets the LUIS utterance, as "query", then passes it along to the LUIS endpoint. The Azure function gets the LUIS response, inserts the response into the SQL table, then returns the LUIS response back to the bot or client app. 