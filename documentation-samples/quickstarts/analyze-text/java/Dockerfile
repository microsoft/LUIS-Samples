# BUILD IMAGE
# $ docker build --no-cache -t luis-endpoint-java .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-endpoint-java luis-endpoint-java 
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-endpoint-java luis-endpoint-java tail 

FROM openjdk:7
COPY . /usr/src/LUIS

COPY lib/ /lib/

WORKDIR /usr/src/LUIS

# rename file to LuisGetRequest.java
RUN cp ./call-endpoint.java ./LuisGetRequest.java
RUN ls
#RUN rm /call-endpoint.java

# linux moby syntax
RUN javac -cp ":lib/*" LuisGetRequest.java

ENTRYPOINT ["java", "-cp",":lib/*", "LuisGetRequest"]
