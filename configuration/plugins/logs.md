# Logs

## Discord Logs

The Discrod Logs plugin allows you to log everything happening in your discord server in a database. It's config should look like this. If it's missing any lines be sure to add them.

```
"Discord-Logs":
{
    "Enabled": true,
    
    "Logging-Channel": "modlog",
    "Table-Name": "discordlogs"
},
```

- **Logging-Channel** is the name of the channel that the bot will log the punishments. If it doesn't exist the bot will automatically create it.
- **Table-Name** is the name of the table that exists in the database.

## Minecraft Logs

The Minecraft Logs plugin allows you to manually log punishments from your minecraft server(s) in a database and it gives you access to the !punish command. It's config should look like this. If it's missing any lines be sure to add them.

```
"Minecraft-Logs":
{
    "Enabled": true,
    "Table-Name": "mclogs",
    "Punishments": ["BAN", "UNBAN", "KICK", "WARN", "MUTE", "UNMUTE"],
    "Servers": []
}
```

- **Table-Name** is the name of the table that exists in the database.
- **Punishments** is a list of punishments that exist on your server and will appear on the selection menu.
- **Servers** is a list of your servers, in case you have more than one and want to log punishments for each one individually. By adding one or more values in the list the server selection menu will be enabled. 