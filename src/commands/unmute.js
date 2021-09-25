const config = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = 
{
    name: 'unmute',
    description: 'Unmute any muted player from your server.',

    async execute(client, message, args, Discord)
    {
        const member = message.mentions.users.first()
        let role = message.guild.roles.cache.find(role => role.name === 'Muted');

        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 1)
            {
                const targetedMember = message.guild.members.cache.get(member.id)

                if (targetedMember.roles.cache.some(role => role.name === 'Muted'))
                {
                    targetedMember.roles.remove(role)
                    message.channel.send(':loud_sound: Successfully unmuted <@' + member + '>.')
                    unmuteLog(client, member, message)
                }
                else //Member is not muted
                    message.channel.send('**Member is not muted.**')
            }
            else //No member specified
                message.channel.send(':x: **Invalid usage. Use !unmute <user>.**')  
        }
    }
}

function unmuteLog(client, member, message)  
{
    const loggingChannel = client.channels.cache.find(channel => channel.name === config['Channel-Settings']['Logging-Channel'])
    const date = new Date()    

    const unmuteAddLog = new MessageEmbed()
        .setColor('#ADD8E6')
        .setTitle('UNMUTE - Case #')
        .setFields
        (
            { name: 'User', value: `${member.tag}\n${member}`, inline: true},
            { name: 'Moderator', value: `${message.author.tag}\n${message.author}`, inline: true},
        )
        .setThumbnail(config['Graphical-Settings']['Unmute-Icon'])
        .setFooter('Case created on ' + date.toUTCString())
       
    client.channels.cache.get(loggingChannel['id']).send({ embeds: [unmuteAddLog] })   
}