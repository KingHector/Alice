const { MessageEmbed } = require('discord.js')
const crafatar = require('crafatar')
const logsPlugin = require('../../Configuration/Plugins/logs.json')

let punishment

module.exports = (Discord, client, interaction) =>
{
    if (interaction.isSelectMenu())
    {
        const message = require('../../src/commands/punish').getMsg
        const serverSelector = require('../../src/commands/punish').getServerSelector
        const username = require('../../src/commands/punish').getUsername
        const uuid = require('../../src/commands/punish').getUUID
        const server = logsPlugin['Minecraft-Logs']['Servers']

        switch (interaction.customId)
        {
            case 'punishmentSelector':
                punishment = interaction.values[0]
                message.edit({ embeds: [embed(username, uuid, punishment, '-', '-', server)] })
                server.length > 0 ? interaction.update({ components: [serverSelector] }) : interaction.update({ components: [] })
                return

            case 'serverSelector':
                message.edit({ embeds: [embed(username, uuid, punishment, interaction.values[0], '-', server)] })
                interaction.update({ components: [] })
                return
        }
    }
}

function embed(username, uuid, Punishment, Server, Reason, server)
{
    const head = crafatar.getHead(uuid) + '?overlay'
    let embedDescription = `**Username:** ${username.at(-1).name} \n **UUID**: ${uuid} \n **Punishment:** ${Punishment} \n`
        
    server.length > 0 ? embedDescription += `**Server:** ${Server} \n` : null
    embedDescription += `**Reason:** ${Reason}`

    const punishmentEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Punishment Logger')
        .setDescription(embedDescription)
        .setThumbnail(head)

    return punishmentEmbed    
}