const Discord = require('discord.js')
const fs = require("fs");
const ban = require('./commands/ban');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES']})
const config = require('./config.json');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['commandHandler', 'eventHandler'].forEach(handler => 
    {
        require(`./handlers/${handler}`)(client, Discord)
    })

client.login(config['Main-Settings']['Bot-Token'])