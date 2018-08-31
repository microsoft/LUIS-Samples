# BUILD IMAGE
# $ docker build --no-cache -t luis-endpoint-csharpcore .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-endpoint-csharpcore luis-endpoint-csharpcore 
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-endpoint-csharpcore luis-endpoint-csharpcore tail 

FROM microsoft/dotnet:latest
WORKDIR /app
COPY . /app

RUN ls

# build
RUN dotnet build

ENTRYPOINT ["dotnet", "run"]
