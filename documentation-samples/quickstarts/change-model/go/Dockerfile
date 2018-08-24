# BUILD IMAGE
# $ docker build --no-cache -t luis-authoring-go .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-authoring-go luis-authoring-go
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-running-authoring-go luis-authoring-go tail 

FROM golang:latest
WORKDIR /go/src/LUIS
COPY . .
RUN go get -d -v ./...
RUN go install -v ./...

RUN go build add-utterances.go

RUN ls

ENTRYPOINT ["./add-utterances"]