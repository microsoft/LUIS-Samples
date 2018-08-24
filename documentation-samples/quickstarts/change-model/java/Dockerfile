# BUILD IMAGE
# $ docker build --no-cache -t luis-authoring-java .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-authoring-java luis-authoring-java 
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-authoring-java luis-authoring-java tail 

FROM openjdk:7
COPY . /usr/src/LUIS

COPY lib/ /lib/

WORKDIR /usr/src/LUIS

RUN ls

# linux moby syntax
RUN javac -cp ":lib/*" AddUtterances.java

ENTRYPOINT ["java", "-cp",":lib/*", "AddUtterances"]
