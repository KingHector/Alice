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
        
        const embedDescription = `**Username:** ${username.at(-1).name} \n **UUID**: ${uuid} \n **Created At:** ${username.at(-1).changedTo}`

        const punishmentEmbed = new MessageEmbed()
	        .setColor('#0099ff')
	        .setTitle('Punishment Logger')
            .setDescription(embedDescription)
            .setThumbnail(head)

        const punishmentSelector = new MessageActionRow()
            .addComponents
            (new MessageSelectMenu()
                .setCustomId('punishmentSelector')
                .setPlaceholder('Select Punishment')
                .addOptions
                ([{
                    label: 'Ban',
                    value: 'first_option',
                }]))
                
        const serverSelector = new MessageActionRow()
            .addComponents
            (new MessageSelectMenu()
                .setCustomId('serverSelector')
                .setPlaceholder('Select Server')
                .addOptions
                ([{
                    label: 'Ban',
                    value: 'first_option',
                }]))            

        message.channel.send({ embeds: [punishmentEmbed], components: [punishmentSelector, serverSelector] })
        .then(function (message) 
        {
            message.react('❌')
            message.react('✅')
        })
    } 
    catch(error)
    {
        message.channel.send('**That Minecraft user does not exist.**')
        return
    }
}