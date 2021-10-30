const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')
const logsPlugin = require('../../Configuration/Plugins/logs.json')
const index = require('../alice')

let punishment

//Server Selector        
const serverSelector = new MessageActionRow()
const serverComponent = new MessageSelectMenu().setCustomId('serverSelector').setPlaceholder('Select Server')
const server = logsPlugin['Minecraft-Logs']['Servers']

for (const s of server)
{
    serverComponent.addOptions
    ([{
        label: s,
        value: s
    }])
}

serverSelector.addComponents(serverComponent)

module.exports = (Discord, client, interaction) =>
{
    if (interaction.isSelectMenu())
    {
        const message = require('../../src/commands/punish').getMsg
        const username = require('../../src/commands/punish').getUsername
        const uuid = require('../../src/commands/punish').getUUID

        switch (interaction.customId)
        {
            case 'punishmentSelector':
                punishment = interaction.values[0]
                interaction.deferUpdate()

                if (server.length > 0)
                {
                    message.edit({ embeds: [index.embed(username, uuid, punishment, '-', '-', server)], components: [serverSelector] })
                }
                else
                {
                    message.edit({ embeds: [index.embed(username, uuid, punishment, '-', '-', server)], components: [] })
                    module.exports = { getMessage: message, getPunishment: punishment }  
                }  
                break

            case 'serverSelector':
                const servetType = interaction.values[0] 
                message.edit({ embeds: [index.embed(username, uuid, punishment, servetType, '-', server)], components: [] })
                module.exports = { getMessage : message, getPunishment : punishment, getServer : servetType }
                break
        }
    }
}