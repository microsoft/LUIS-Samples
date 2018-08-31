
# BUILD IMAGE
# $ docker build --no-cache -t luis-endpoint-php .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-running-endpoint-php luis-endpoint-php
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-running-endpoint-php luis-endpoint-php tail 

FROM php:7.2-apache
WORKDIR /go/src/LUIS
COPY . .

ENTRYPOINT ["php","endpoint-call.php"]