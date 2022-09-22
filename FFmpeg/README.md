## Camera module

# Driver

Some only support one usb at a time.
Some only support usb 2.0 instead of 3.0

# https://gist.github.com/peterhellberg/ebfc72147c2009ee720aafe57ce9c141

/usr/local/bin/ffserver -f ffserver.conf

ffmpeg -f avfoundation -framerate 15 -pixel_format yuyv422 -i "0" http://localhost:8090/camera.ffm

http://localhost:8090/camera.mjpeg
