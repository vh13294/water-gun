<!-- Main -->

```
nmcli con add type wifi ifname wlan0 con-name Hostspot autoconnect yes ssid Hostspot
nmcli con modify Hostspot 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared
nmcli con modify Hostspot wifi-sec.key-mgmt wpa-psk
nmcli con modify Hostspot wifi-sec.psk "rock1234"
nmcli con up Hostspot
```

```
pass: rock1234, rock/rock login
router ip: 10.42.0.1
```

<!-- Extra -->

```
nmcli con mod "CONNECTION NAME" ipv4.method auto
nmcli con mod "CONNECTION NAME" ipv4.gateway ""
nmcli con mod "CONNECTION NAME" ipv4.address ""
nmcli con down "CONNECTION NAME"
nmcli con up "CONNECTION NAME"
```

<!-- Docs -->

```
IP configuration method. NMSettingIP4Config and NMSettingIP6Config both support "disabled", "auto", "manual", and "link-local".

See the subclass-specific documentation for other values. In general, for the "auto" method, properties such as "dns" and "routes" specify information that is added on to the information returned from automatic configuration.

The "ignore-auto-routes" and "ignore-auto-dns" properties modify this behavior.

For methods that imply no upstream network, such as "shared" or "link-local", these properties must be empty.

For IPv4 method "shared", the IP subnet can be configured by adding one manual IPv4 address or otherwise 10.42.x.0/24 is chosen.

Note that the shared method must be configured on the interface which shares the internet to a subnet, not on the uplink which is shared.
```
