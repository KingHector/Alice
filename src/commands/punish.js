const config = require('../../Configuration/config.json')
const logsPlugin = require('../../Configuration/Plugins/logs.json')
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')
const crafatar = require('crafatar')
const minecraftAPI = require('minecraft-api')

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'punish',
    description: 'Log a punishment from your Minecraft Server.',
    
    async execute(client, message, args, discord)
    {
        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (logsPlugin['Minecraft-Logs']['Enabled'])
            {
                if (args.length >= 1)
                {
                    punishmentLogger(client, message, args)
                }
                else //No MC user specified
                    message.channel.send(`:x: **Invalid usage. Use ${prefix}punish <username>.**`)
            }
        }
    }
}

async function punishmentLogger(client, message, args)
{
    try
    {
        const uuid = await minecraftAPI.uuidForName(args[0]) 
        const username = await minecraftAPI.nameHistoryForUuid(uuid)
        
        //Punishment Selector    
        const punishmentSelector = new MessageActionRow()
        const punishmentComponent = new MessageSelectMenu().setCustomId('punishmentSelector').setPlaceholder('Select Punishment')
        const punishmentType = ['BAN', 'UNBAN', 'KICK', 'WARN', 'MUTE', 'UNMUTE']
        
        for (const p of punishmentType)
        {
            punishmentComponent.addOptions
                ([{
                    label: p,
                    value: p
                }])
        }      
        
        punishmentSelector.addComponents(punishmentComponent)
        
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

        const punishmentEmbed = embed(username, uuid, '-', '-', '-', server)

        message.channel.send({ embeds: [punishmentEmbed], components: [punishmentSelector] })
        .then(function (message) 
        {
            message.react('❌')
            message.react('✅')

            module.exports = { getMsg : message, getUsername : username, getUUID: uuid, getServerSelector : serverSelector }
        })
    } 
    catch(error)
    {
        console.log(error)
        message.channel.send('**That Minecraft user does not exist.**')
        return
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