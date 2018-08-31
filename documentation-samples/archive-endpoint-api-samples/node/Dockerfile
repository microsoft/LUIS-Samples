# BUILD IMAGE
# $ docker build --no-cache -t luis-endpoint-node .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-endpoint-node luis-endpoint-node 
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-endpoint-node luis-endpoint-node tail 

FROM node:latest
COPY . /usr/src/LUIS
WORKDIR /usr/src/LUIS
RUN npm install
ENTRYPOINT [ "npm", "start" ]