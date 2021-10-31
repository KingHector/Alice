const { MessageActionRow, MessageSelectMenu } = require('discord.js')
const logsPlugin = require('../../Configuration/Plugins/logs.json')
const embedCreators = require('../utilities/embedCreators')

let punishment
let serverType
let addReason = false

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
                    message.edit({ content: ':desktop: **Select a server.**', embeds: [embedCreators.createPunishmentEmbed(username, uuid, punishment, '-', '-', server)], components: [serverSelector] })
                }
                else
                {
                    message.edit({ content: ':pencil: **Provide a punishment reason.**', embeds: [embedCreators.createPunishmentEmbed(username, uuid, punishment, '-', '-', server)], components: [] }) 
                    addReason = true
                }  
                break

            case 'serverSelector':
                serverType = interaction.values[0] 
                message.edit({ content: ':pencil: **Provide a punishment reason.**', embeds: [embedCreators.createPunishmentEmbed(username, uuid, punishment, serverType, '-', server)], components: [] })
                addReason = true
                break
        }

        module.exports = { getMessage : message, getPunishment : punishment, getServerType : serverType, getServerAmount : server, getAddReason : addReason }
    }
}