# Alice
Moderation Discord Bot made for self hosting it. Works on it's own or with plugins.

## How To Use

### Bot Setup

First things first you need to head over to [Discord Developer Portal](https://discord.com/developers/applications) and create a new application. Set an Name and optionally an Icon and Description (Name and Icon will not be visible to other people this is just a general name, the Description will show up in the bots About Me section).

After you set your application credentials, head over to the **Bot** section and set a Username and Icon for your bot. Your bot **Token** will be used on the config. Make sure you do not share it and keep it hidden. Also make sure you enable **Server Members Intent**.

Now your bot is ready to be invited to your server. Head over to [this](https://discordapi.com/permissions.html#8) site check Administrator and insert your Client ID which is located in the General Information section (Application ID). Now click the generated link and add the bot to the server.

### Configuring The Bot

#### Main Config

Your bot's config is located in **Configuration/config.json** and should look like this. Every single option is tweakable to your needs. If it's missing any lines be sure to add them.

```
{
    "Main-Settings":
    {
        "Bot-Token": "YOUR-BOT-TOKEN",
        "Server-ID": "YOUR-SERVER-ID",
        "Command-Prefix": "!",

        "Status": "ONLINE",
        "Activity-Type": "PLAYING",
        "Activity-Message": "!help"
    },

    "Database":
    {
        "Host": "localhost",
        "User": "root",
        "Password": "",
        "Database": "test"
    }
}
```

#### Plugins

The bot can have optional plugins enabled via the configs in the **Configuration/Plugins** folder. Just like the main config the options are tweakable to your needs.

- [Logs](https://github.com/KingHector/Alice/blob/master/configuration/plugins/logs.md)
- [Moderation](https://github.com/KingHector/Alice/blob/master/configuration/plugins/moderation.md)
- [Welcome](https://github.com/KingHector/Alice/blob/master/configuration/plugins/welcome.md)

### Starting Bot

In order to start the bot you just need to run the start.bat file. Simple as that.
