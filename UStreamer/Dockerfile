## Get Code and make
FROM ubuntu:22.04 as build

ARG REPO=https://github.com/pikvm/ustreamer
ARG VERSION=master

WORKDIR /opt

RUN apt-get update \
 && apt-get install -y \
      ca-certificates \
      make \
      gcc \
      git \
      libevent-dev \
      libjpeg-dev \
      libbsd-dev \
      libgpiod-dev \
 && apt-get clean

RUN git clone ${REPO} ustreamer \
 && cd ustreamer \
 && git checkout ${VERSION}

RUN cd ustreamer \
 && make

## Runtime Image
FROM ubuntu:22.04 as run

RUN apt-get update \
 && apt-get install -y \
      ca-certificates \
      libevent-dev \
      libevent-pthreads-2.1-7 \
      libjpeg-dev \
      libbsd-dev \
      libgpiod-dev \
      v4l-utils \
 && apt-get clean

WORKDIR /opt
COPY --from=build /opt/ustreamer ./ustreamer

RUN groupadd ustreamer --gid 1000 \
 && useradd ustreamer --uid 1000 --gid ustreamer \
 && usermod ustreamer --append --groups video \
 && chown -R ustreamer:ustreamer /opt/*

## Start ustreamer
USER ustreamer
EXPOSE 8080
ENTRYPOINT [ "/opt/ustreamer/ustreamer"]
CMD ["--host=0.0.0.0", \
     "--port=8080", \
     "--allow-origin=*", \
     "--device=/dev/video0", \
     "--resolution=1280x720", \
     "--desired-fps=30", \
     "--format=MJPEG", \
     "--quality=100", \
     # 5000byte = 5kb
     "--min-frame-size=5000", \
     # Compare CPU mode vs HW mode
     "--encoder=CPU", \
     # "--encoder=HW", \
     "--image-default" \
]
