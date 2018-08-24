
# BUILD IMAGE
# $ docker build --no-cache -t luis-authoring-php .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-authoring-php luis-authoring-php
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-running-authoring-php luis-authoring-php tail 

FROM php:7.2-apache
WORKDIR /go/src/LUIS
COPY . .

ENTRYPOINT ["php","add-utterances.php"]