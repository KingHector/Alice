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
                    punishmentLogger(args, message)
                }
                else //No MC user specified
                    message.channel.send(`:x: **Invalid usage. Use ${prefix}punish <username>.**`)
            }
        }
    }
}

async function punishmentLogger(args, message)
{
    try
    {
        const uuid = await minecraftAPI.uuidForName(args[0])
        const username = await minecraftAPI.nameHistoryForUuid(uuid)
        const head = crafatar.getHead(uuid) + '?overlay' 
        
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

        //Punishment Embed
        const embedDescription = `**Username:** ${username.at(-1).name} \n **UUID**: ${uuid} \n **Punishment:** - \n **Reason:** - \n`
        
        server.length > 0 ? embedDescription += '**Server:** -' : null

        const punishmentEmbed = new MessageEmbed()
	        .setColor('#0099ff')
	        .setTitle('Punishment Logger')
            .setDescription(embedDescription)
            .setThumbnail(head)

            server.length > 0 ? sendEmbed(message, punishmentEmbed, punishmentSelector, serverSelector, true) : sendEmbed(message, punishmentEmbed, punishmentSelector, serverSelector, false)
    } 
    catch(error)
    {
        message.channel.send('**That Minecraft user does not exist.**')
        return
    }
}

function sendEmbed(message, punishmentEmbed, punishmentSelector, serverSelector, addField)
{
    if (addField)
    {
        message.channel.send({ embeds: [punishmentEmbed], components: [punishmentSelector, serverSelector] })
            .then(function (message) 
            {
                message.react('❌')
                message.react('✅')
            })
    }
    else
    {
        message.channel.send({ embeds: [punishmentEmbed], components: [punishmentSelector] })
            .then(function (message) 
            {
                message.react('❌')
                message.react('✅')
            })
    }
}