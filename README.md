1. Main compute board

- Pi CM4
- Install ubuntu
- Install home assistant
- Link with ESPHome
- Allow websocket api

2. Micro-controller

- ESP32
- Flash ESPHome

3. Camera module

- Configure camera stream using https://motion-project.github.io/
- USB webcam vs CSI camera (USB longer cable!)
- rtsp://192.168.20.4:554/ch0_0.264
- https://motion-project.github.io/3.4.1/motion_guide.html#Options_Stream_Webcontrol
- https://stackoverflow.com/questions/19346775/rendering-mjpeg-stream-in-html5

4. Tensor Flow

- npm i @tensorflow/tfjs @tensorflow/tfjs-backend-cpu @tensorflow/tfjs-backend-webgl @tensorflow/tfjs-converter @tensorflow/tfjs-core @tensorflow-models/pose-detection

- https://github.com/tensorflow/tfjs-models
