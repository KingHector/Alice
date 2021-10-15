const config = require('../config.json')
const { MessageEmbed } = require('discord.js')
const cases = require(`../typDiscordBot`).getTotalCases

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'warn',
    description: 'Warns any player in your server.',

    async execute(client, message, args, discord)
    {
        const member = message.mentions.users.first()
        const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 
        
        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 2)
            {
                const reason = message.content.slice(prefix.length + 2).slice('warn'.length).slice(args[0].length)
                const targetedMember = message.guild.members.cache.get(member.id)
                
                sendNotice(targetedMember)
                message.channel.send(':warning: Successfully warned <@' + member + '>.')
                warnLog(client, member, message, reason)    
            }
            else //No member specified
                message.channel.send(':x: **Invalid usage. Use !warn <user> <reason>.**')  
        }
    }
}

function warnLog(client, member, message, reason)  
{
    const loggingChannel = client.channels.cache.find(channel => channel.name === config['Channel-Settings']['Logging-Channel'])
    const date = new Date()    

    const warnAddLog = new MessageEmbed()
        .setColor('#00FF00')
        .setTitle(`WARN - Case #${cases + 1}`)
        .setFields
        (
            { name: 'User', value: `${member.tag}\n${member}`, inline: true},
            { name: 'Moderator', value: `${message.author.tag}\n${message.author}`, inline: true},
            { name: 'Reason', value: '```' + `${reason} ` + '```'}
        )
        .setThumbnail(config['Graphical-Settings']['Warning-Icon'])
        .setFooter('Case created on ' + date.toUTCString())
       
    client.channels.cache.get(loggingChannel['id']).send({ embeds: [warnAddLog] })   
}

function sendNotice(targetedMember)
{
    if (!targetedMember.user.bot)
        targetedMember.send(`:warning: You have received a warning on the ` + '`' + `${guild.name}` + '`' + ` server. Reason: ` + '`' + `${reason}` + '`')
}