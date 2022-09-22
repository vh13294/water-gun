FROM ubuntu:22.04

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y \
    build-essential \
    cmake libjpeg8-dev \
    gcc g++ \
    git

# Create app directory
WORKDIR /usr/src/streamer

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./build/* ./

RUN make
RUN make install

RUN export LD_LIBRARY_PATH=.

ENTRYPOINT ["/bin/bash", "./entrypoint.sh"]
