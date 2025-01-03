# NOCR

Schedule the execution of small scripts and programs using simple json files.

Current scripts:

- 3DJake: Scrape the outlet page of 3D Jake and send a push notification if new deals get added

## Adding programs

## Installing

- Install Deno: [https://deno.com/](https://deno.com/)
- Clone repo: `git clone https://github.com/playlogo/NOCR.git`
- Get deno executable path: `which deno`
- Create systemd user service: `nano ~/.config/systemd/user/nocr.service`

```shell
[Unit]
Description=NOCR
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=3
WorkingDirectory=/home/${your username}/NOCR
ExecStart=${deno path} task run

[Install]
WantedBy=default.target
```

- Reload systemd config: `systemctl --user daemon-reload`
- Enable & Start service: `systemctl --user enable nocr --now`
- View logs: `journalctl --user -u nocr -e -f`
