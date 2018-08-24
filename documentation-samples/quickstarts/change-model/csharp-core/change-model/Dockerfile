# BUILD IMAGE
# $ docker build --no-cache -t luis-authoring-csharpcore .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-authoring-csharpcore luis-authoring-csharpcore 
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-authoring-csharpcore luis-authoring-csharpcore tail 

FROM microsoft/dotnet:latest
WORKDIR /app
COPY . /app

RUN dotnet add package JsonFormatterPlus --version 1.0.2
RUN dotnet add package CommandLineParser --version 2.3.0
RUN ls

# build
RUN dotnet build

ENTRYPOINT ["dotnet", "run"]
CMD ["--add", "utterances.json", "--train", "--status"]
