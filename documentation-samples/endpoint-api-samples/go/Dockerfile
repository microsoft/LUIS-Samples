# NOTE: replace YOUR-KEY with your endpoint key
#       you can use your authoring key if it still has available request quota 
#
# BUILD IMAGE
# $ docker build --no-cache -t luis-endpoint-go .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-running-endpoint-go luis-endpoint-go
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-running-endpoint-go luis-endpoint-go tail 

FROM golang:latest
WORKDIR /go/src/LUIS
COPY . .
RUN go get -d -v ./...
RUN go install -v ./...

RUN go build endpoint.go

RUN ls

ENTRYPOINT ["./endpoint","-endpointKey", "YOUR-KEY", "-region", "westus"]