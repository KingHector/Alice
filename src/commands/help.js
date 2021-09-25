const fs = require('fs')
const config = require('../config.json')
const { MessageEmbed } = require('discord.js')

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'help',
    description: 'Show a list of all commands and their descriptions.',

    async execute(client, message, args, Discord)
    {
        var commandsList = ''

        const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

        for (const file of commandFiles)
        {
            commandsList += prefix + file.replace('.js', '') + '\n'
        }

        const helpEmbed = new MessageEmbed()
        .setColor('#cec4ff')
        .setTitle('HELP')
        .setFields
        (
            { name: 'Command', value: commandsList, inline: true},
            { name: 'Description', value: 'desc', inline: true},
        )
        .setFooter('Developed by King_Hector for The Yawning Portal')

        message.channel.send({ embeds: [helpEmbed] })
    }
}