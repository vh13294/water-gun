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
      libjpeg62-turbo-dev \
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
      libevent-2.1 \
      libevent-pthreads-2.1-6 \
      libjpeg62-turbo \
      libbsd0 \
      libgpiod2 \
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
CMD ["--host=0.0.0.0", "--port=8080", "--allow-origin=\*", ""]


# --format=uyvy \ # Device input format
# --encoder=omx \ # Hardware encoding with OpenMAX
# --workers=3 \ # Maximum workers for OpenMAX
# --persistent \ # Don´t re-initialize device on timeout (for example when HDMI cable was disconnected)
# --dv-timings \ # Use DV-timings
# --drop-same-frames=30 # Save the traffic
ustreamer --help