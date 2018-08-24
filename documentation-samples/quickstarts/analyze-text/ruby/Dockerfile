# BUILD IMAGE
# $ docker build --no-cache -t luis-endpoint-ruby .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-endpoint-ruby luis-endpoint-ruby
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-endpoint-ruby luis-endpoint-ruby

FROM ruby:2.5

WORKDIR /usr/src/app

COPY . .

RUN ls

CMD [ "ruby", "./endpoint-call.rb" ]