const config = require('../../Configuration/config.json')
const logsPlugin = require('../../Configuration/Plugins/logs.json')
const { MessageActionRow, MessageSelectMenu } = require('discord.js')
const embedCreators = require('../utilities/embedCreators')
const minecraftAPI = require('minecraft-api')
const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'punish',
    description: 'Log a punishment from your Minecraft Server.',
    
    async execute(client, message, args, discord)
    {
        if (!message.member.permissions.has('ADMINISTRATOR')) return
        if (!logsPlugin['Minecraft-Logs']['Enabled']) return

        if (args.length >= 1)
        {
            punishmentLogger(client, message, args)
        }
        else //No MC user specified
            message.channel.send(`:x: **Invalid usage. Use ${prefix}punish <username>.**`)                  
    }
}

async function punishmentLogger(client, message, args)
{
    try
    {
        const uuid = await minecraftAPI.uuidForName(args[0]) 
        const username = await minecraftAPI.nameHistoryForUuid(uuid)
        const server = logsPlugin['Minecraft-Logs']['Servers']
        
        //Punishment Selector    
        const punishmentSelector = new MessageActionRow()
        const punishmentComponent = new MessageSelectMenu().setCustomId('punishmentSelector').setPlaceholder('Select Punishment')
        const punishmentType = logsPlugin['Minecraft-Logs']['Punishments']
        
        for (const p of punishmentType)
        {
            punishmentComponent.addOptions
                ([{
                    label: p,
                    value: p
                }])
        }      
        
        punishmentSelector.addComponents(punishmentComponent)

        const punishmentEmbed = embedCreators.createPunishmentEmbed(username, uuid, '-', '-', '-', server)

        message.channel.send({ content: ':scales: **Select a punishment.**', embeds: [punishmentEmbed], components: [punishmentSelector] })
            .then(function (message) 
            {
                message.react('❌')
                message.react('✅')

                module.exports = { getMsg : message, getUsername : username, getUUID : uuid }
            })
    } 
    catch(error)
    {
        message.channel.send('**That Minecraft user does not exist.**')
        return
    }
}