const { MessageEmbed } = require('discord.js')
const config = require('../../Configuration/config.json')
const index = require('../alice')

module.exports = (Discord, client, message) =>
{
    //Handlers
    const prefix = config['Main-Settings']['Command-Prefix']

    if (message.content.startsWith(prefix) && !message.author.bot)
    {
        const args = message.content.slice(prefix.length).split(/ +/)
        const cmd = args.shift().toLowerCase()
        
        const command = client.commands.get(cmd)

        if (command)
            command.execute(client, message, args, Discord)
    }

    //Punishment Logger
    const punishmentMessage = require('./interactionCreate').getMessage
    const addReason = require('./interactionCreate').getAddReason

    if (punishmentMessage && addReason)
    {
        const username = require('../../src/commands/punish').getUsername
        const uuid = require('../../src/commands/punish').getUUID
        const punishment = require('./interactionCreate').getPunishment
        const server = require('./interactionCreate').getServerType
        const serverAmount = require('./interactionCreate').getServerAmount

        punishmentMessage.edit({ embeds: [index.embed(username, uuid, punishment, server, message, serverAmount)] })
    }
}