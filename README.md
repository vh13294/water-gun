1. Main compute board

- Pi CM4
- Mjpeg stream https://github.com/pikvm/ustreamer
- wifi rock1234, rock/rock login
- nmcli to manager wifi-hotspot

2. Micro-controller

- ESP32 with ESPHome

3. Tensor Flow

- npm i @tensorflow/tfjs @tensorflow/tfjs-backend-cpu @tensorflow/tfjs-backend-webgl @tensorflow/tfjs-converter @tensorflow/tfjs-core @tensorflow-models/pose-detection

- https://github.com/tensorflow/tfjs-models

4. Portainer

docker run -d -p 8000:8000 -p 9000:9000 -p 9443:9443 \
 --name=portainer --restart=always \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v /home/rock/portainer:/data \
 portainer/portainer-ce:2.15.0

5. Running
   cp .env files (for svelte & nestJs)
   docker-compose up -d
   docker-compose build
   docker-compose build --no-cache --pull
