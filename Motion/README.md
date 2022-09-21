## Camera module

- Configure camera stream using https://motion-project.github.io/
- USB webcam vs CSI camera (USB longer cable!)
- https://motion-project.github.io/3.4.1/motion_guide.html#Options_Stream_Webcontrol
- https://stackoverflow.com/questions/19346775/rendering-mjpeg-stream-in-html5

# Run Config file

-b Run in background (daemon) mode.
-n Run in non-daemon mode.
-s Run in setup mode.

- motion -c motion.conf

service motion stop

# SMB Server

https://pimylifeup.com/raspberry-pi-samba/

# Start at boot

sudo apt install cron

crontab -e

@reboot sleep 30 && motion -c /home/rock/motion/motion.conf

# Driver

Some only support one usb at a time.
Some only support usb 2.0 instead of 3.0

sudo apt-get install hwinfo
hwinfo --usb
