# NOCR

Schedule and execute Deno scripts.

Current scripts:

- 3DJake: Scrape the outlet page of 3D Jake and send me a push notification about the deals

## Setup

Run:

- `nano ~/.config/systemd/user/nocr.service`

```shell
[Unit]
Description=NOCR
After=network.target
After=tailscaled.service
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=3
WorkingDirectory=/home/pi/NOCR
ExecStart=/home/pi/.deno/bin/deno task run

[Install]
WantedBy=default.target
```

- `systemctl --user daemon-reload`
- `systemctl --user enable nocr --now`
