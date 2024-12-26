const command = new Deno.Command("crontab", { args: ["-l"], stdout: "piped", stderr: "piped" });

console.log(new TextDecoder().decode((await command.spawn().output()).stdout));
