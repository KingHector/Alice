const Discord = require('discord.js')
const fs = require("fs");
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES']})

//Commands Enabler
const prefix = '!';

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles)
{
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

//Commands Sticher
client.on('messageCreate', message =>
{
    if (message.content.startsWith(prefix) || !message.author.bot) 
    {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        
        for (const file of commandFiles)
        {
            const command_file = require(`./commands/${file}`);
            if (command === command_file.name)
            {
                client.commands.get(command_file.name).execute(message, args);
            }
        }
    }   
})

//OnEnable
client.once('ready', () =>
{
    console.log('Hello World!')
})

client.login('ODc3OTUxMTcxMDU3MzAzNTgz.YR6Fvg.qeHHDzpDEMvd2zosS5QHVmgFXts')