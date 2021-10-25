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
        var commandsList = ''
        var descriptionList = ''

        const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

        for (const file of commandFiles)
        {
            commandsList += prefix + file.replace('.js', '') + '\n'
            descriptionList += client.commands.get(file.replace('.js', '')).description + '\n' 
        }

        const helpEmbed = new MessageEmbed()
            .setColor('#cec4ff')
            .setTitle('Commands')
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