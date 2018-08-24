# BUILD IMAGE
# $ docker build --no-cache -t luis-authoring-node .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-authoring-node luis-authoring-node 
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-authoring-node luis-authoring-node tail 

FROM node:latest
COPY . /usr/src/LUIS
WORKDIR /usr/src/LUIS
RUN npm install
ENTRYPOINT [ "npm", "start" ]