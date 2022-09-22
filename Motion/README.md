## Camera module

- Configure camera stream using https://motion-project.github.io/
- USB webcam vs CSI camera (USB longer cable!)

# Start at boot

sudo apt install cron

crontab -e

@reboot sleep 20 && motion -c /home/rock/water-gun/Motion/video0.conf
@reboot sleep 30 && motion -c /home/rock/water-gun/Motion/video1.conf

# Driver

Some only support one usb at a time.
Some only support usb 2.0 instead of 3.0
