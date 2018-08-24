# BUILD IMAGE
# $ docker build --no-cache -t luis-endpoint-py2 .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ winpty docker run -it --rm --name luis-endpoint-py2 luis-endpoint-py2
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-endpoint-py2 luis-endpoint-py2

FROM python:2

WORKDIR /usr/src/app

RUN pip install requests

COPY . .

CMD [ "python", "./quickstart-call-endpoint-2-7.py" ]