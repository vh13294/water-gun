https://github.com/lakinduakash/linux-wifi-hotspot/blob/master/src/scripts/README.md

# For ubuntu only

sudo add-apt-repository ppa:lakinduakash/lwh
sudo apt install linux-wifi-hotspot

## Internet sharing from the same WiFi interface:

- create_ap wlp1s0 wlp1s0 Hotspot rock1234 --freq-band 2.4 --daemon

## AP without Internet sharing:

- create_ap -n wlp1s0 Hotspot rock1234

## On boot/startup

- sudo crontab -e
- @reboot sleep 10 && create_ap wlp1s0 wlp1s0 Hotspot rock1234 --freq-band 2.4 --daemon
