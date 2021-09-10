const config = require('../config.json')
const { MessageEmbed } = require('discord.js')

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: "ban",
    description: "Ban any player from your server.",

    async execute(client, message, args, Discord)
    {
        const member = message.mentions.users.first()
        const reason = message.content.slice(prefix.length + 2).slice('ban'.length).slice(args[0].length)

        if (message.member.permissions.has('BAN_MEMBERS'))
        {
            if (args.length >= 1)
            {
                const targetedMember = message.guild.members.cache.get(member.id)
                
                if (!targetedMember.permissions.has('ADMINISTRATOR') || targetedMember.user.bot)
                {
                    targetedMember.ban({ reason: args[1] })
                    message.channel.send(':hammer: Successfully banned <@' + member + '>.')
                    banLog(client, member, message, reason)
                }
                else //Member is Admin
                    message.channel.send('**You cannot ban this member.**')
            }
            else //No member specified
                message.channel.send(':x: **Invalid usage. Use !ban <user> __<reason>__.**')  
        }
    }
}

function banLog(client, member, message, reason)  
{
    const loggingChannel = client.channels.cache.find(channel => channel.name === config['Something-Settings']['Logging-Channel'])
    const date = new Date()    

    const banAddLog = new MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('BAN - Case #')
        .setFields
        (
            { name: 'User', value: `<@${member.id}>`, inline: true},
            { name: 'Moderator', value: `<@${message.author.id}>`, inline: true },
            { name: 'Reason', value: '```' + `${reason} ` + '```'}
        )
        .setThumbnail(config['Graphical-Settings']['Ban-Image'])
        .setFooter('Case created on ' + date.toUTCString())
       
    client.channels.cache.get(loggingChannel['id']).send({ embeds: [banAddLog] })   
}