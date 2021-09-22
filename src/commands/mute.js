const config = require('../config.json')
const { MessageEmbed } = require('discord.js')

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'mute',
    description: 'Mute any player in your server.',

    async execute(client, message, args, discord)
    {
        const member = message.mentions.users.first()
        let role = message.guild.roles.cache.find(role => role.name === 'Muted');

        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 1)
            {
                const reason = message.content.slice(prefix.length + 2).slice('mute'.length).slice(args[0].length)
                const targetedMember = message.guild.members.cache.get(member.id)

                if ((!targetedMember.permissions.has('ADMINISTRATOR') || targetedMember.user.bot) && targetedMember.permissions.has('SEND_MESSAGES'))
                {
                    targetedMember.roles.add(role)
                    muteLog(client, member, message, reason)
                    message.channel.send(':hammer: Successfully muted <@' + member + '>.')
                }
                else //Member is Admin
                    message.channel.send('**You cannot mute this member.**')
            }
            else //No member specified
                message.channel.send(':x: **Invalid usage. Use !mute <user> __<reason>__.**')  
        }
    }
}

function muteLog(client, member, message, reason)  
{
    const loggingChannel = client.channels.cache.find(channel => channel.name === config['Channel-Settings']['Logging-Channel'])
    const date = new Date()    

    const muteAddLog = new MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('MUTE - Case #')
        .setFields
        (
            { name: 'User', value: `${member.tag}\n${member}`, inline: true},
            { name: 'Moderator', value: `${message.author.tag}\n${message.author}`, inline: true},
            { name: 'Reason', value: '```' + `${reason} ` + '```'}
        )
        .setThumbnail(config['Graphical-Settings']['Mute-Icon'])
        .setFooter('Case created on ' + date.toUTCString())
       
    client.channels.cache.get(loggingChannel['id']).send({ embeds: [muteAddLog] })   
}