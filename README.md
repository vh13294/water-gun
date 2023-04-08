1. Main compute board

- Mjpeg stream https://github.com/pikvm/ustreamer

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
 portainer/portainer-ce:2.17.1

5. Running
   cp .env for NestJs
   Svelte & Vite automatically select .env.production
   docker-compose up -d
   docker-compose up -d --build
   docker-compose build
   docker-compose build --no-cache

6. Initialization

   - Create WiFi hot-spot
   - Setup HomeAssistant
   - Create API Key (Long-Lived Access Tokens)
   - Setup ESPHome (port 6052)
   - Copy HomeAssistant API Key

7. Remote reboot host server

   - sudo visudo (add line below to the file)
   - panha ALL=(ALL) NOPASSWD: /sbin/poweroff, /sbin/reboot, /sbin/shutdown

8. Home Assistant / ESPHome will slow down after running 1h-2h +
