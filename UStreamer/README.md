## Fork From

https://github.com/pikvm/ustreamer

https://manpages.ubuntu.com/manpages/jammy/man1/ustreamer.1.html

- List of available video devices:
  v4l2-ctl --list-devices.

- List available control settings:
  v4l2-ctl -d /dev/video0 --list-ctrls.

- List available video formats:
  v4l2-ctl -d /dev/video0 --list-formats-ext.

- Read the current setting:
  v4l2-ctl -d /dev/video0 --get-ctrl=exposure_auto.

- Change the setting value:
  v4l2-ctl -d /dev/video0 --set-ctrl=exposure_auto=1.
