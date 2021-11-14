const fs = require('fs')
const config = require('../../Configuration/config.json')
const { MessageEmbed } = require('discord.js')

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'help',
    description: 'Shows a list of all commands and their description.',

    async execute(client, message, args, Discord)
    {
        const helpEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('General Commands')
            .setFields
            (
                { name: 'Command', value: commandsList, inline: true},
                { name: '\u200B', value: '\u200B', inline: true  },
                { name: 'Description', value: descriptionList, inline: true},
            )
            .setFooter(`ID: ${client.user.id} | Project Alice`)

        message.channel.send({ embeds: [helpEmbed] })
    }
}