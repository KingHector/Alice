# TYPDiscordBot
Discord Bot for The Yawning Portal's discord server. Moderates and interacts with IP Logging Minecraft Plugin.

## Commands

- !help `Shows a list of all commands and their description.`
- !ping `Show the latency in milliseconds.`
- !ban &lt;user&gt; &lt;reason&gt; `Bans any user from your server. Reason is optional.`
- !kick &lt;user&gt; &lt;reason&gt; `Kicks any user from your server. Reason is optional.`
- !mute &lt;user&gt; &lt;reason&gt; `Mutes any user in your server. Reason is optional.`
- !unmute &lt;user&gt; `Unmutes any muted user from your server.`
- !warn &lt;user&gt; &lt;reason&gt; `Warns any user in your server.`
- !inquire &lt;user&gt; `Shows all the punishments a user has received.`
- !case &lt;caseNumber&gt; `Shows the punishment case specified.`

## How To Use

### Bot Setup

Fist things first you need to head over to [Discord Developer Portal](https://discord.com/developers/applications) and create a new application. Set an Name and optionally an Icon and Description (Name and Icon will not be visible to other people this is just a general name, the Description will show up in the bots About Me section).

After you set your application credentials, head over to the **Bot** section and set a Username and Icon for your bot. Your bot **Token** will be used on the config. Make sure you do not share it and keep it hidden.

Now your bot is ready to be invited to your server. Head over to [this](https://discordapi.com/permissions.html#8) site check Administrator and insert your Client ID which is located in the General Information section (Application ID). Now click the generated link and add the bot to the server.

### Config Setup

Your bot config should look like this:

```
{
    "Main-Settings":
    {
        "Bot-Token": "ODc3OTUxMTcxMDU3MzAzNTgz.YR6Fvg.qeHHDzpDEMvd2zosS5QHVmgFXts",
        "Server-ID": "883770811083796500",
        "Command-Prefix": "!",

        "Logging-Channel": "modlog",

        "Activity-Type": "PLAYING",
        "Activity-Message": "!help"
    },

    "Database":
    {
        "Host": "localhost",
        "User": "root",
        "Password": "",
        "Database": "test",
        "Table-Name": "discordlogs"
    }
}
```
