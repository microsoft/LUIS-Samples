# BUILD IMAGE
# $ docker build --no-cache -t luis-authoring-py3 .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-authoring-py3 luis-authoring-py3
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-authoring-py3 luis-authoring-py3

FROM python:3

WORKDIR /usr/src/app

COPY . .

CMD [ "python", "./add-utterances-3-6.py" ]