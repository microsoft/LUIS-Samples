# BUILD IMAGE
# $ docker build --no-cache -t notes-app-node .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name notes-app-node notes-app-node 
#
# NON-WINDOWS
# $ docker run -it --rm --name notes-app-node notes-app-node tail 

FROM node:latest
COPY . /usr/src/LUIS
WORKDIR /usr/src/LUIS
RUN npm install
ENTRYPOINT [ "npm", "start" ]