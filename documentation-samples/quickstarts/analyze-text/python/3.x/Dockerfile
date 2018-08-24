# BUILD IMAGE
# $ docker build --no-cache -t luis-endpoint-py3 .
#
# RUN CODE
#
# WINDOWS BASH COMMAND 
# $ docker run -it --rm --name luis-endpoint-py3 luis-endpoint-py3
#
# NON-WINDOWS
# $ docker run -it --rm --name luis-endpoint-py3 luis-endpoint-py3

FROM python:3

WORKDIR /usr/src/app

RUN pip install requests

COPY . .

CMD [ "python", "./quickstart-call-endpoint-3-6.py" ]