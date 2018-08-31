# BUILD IMAGE
# $ docker build --no-cache -t luis-authoring-ruby .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-authoring-ruby luis-authoring-ruby
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-authoring-ruby luis-authoring-ruby

FROM ruby:2.5

WORKDIR /usr/src/app

COPY . .

RUN ls

CMD [ "ruby", "./add-utterances.rb" ]