const config = require('../config.json')
const { MessageEmbed } = require('discord.js')
const sql = require('../typDiscordBot').getsql

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'warn',
    description: 'Warns any user in your server.',

    async execute(client, message, args, discord)
    {
        const member = message.mentions.users.first()
        
        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 2)
            {
                const reason = message.content.slice(prefix.length + 2).slice('warn'.length).slice(args[0].length)
                const targetedMember = message.guild.members.cache.get(member.id)
                
                sendNotice(targetedMember, client, reason)
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
    sql.query(`SELECT COUNT(*) AS cases FROM ${config['Database']['Table-Name']}`, function(err, rows, fields) 
    {
        var currentCase = undefined
        sql.state === 'authenticated' ? currentCase = rows['0'].cases + 1 : undefined

        //Embed
        const loggingChannel = client.channels.cache.find(channel => channel.name === config['Main-Settings']['Logging-Channel'])
        const date = new Date()    
        const isoDate = date.toISOString().split('T')[0] 

        const warnAddLog = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle(`WARN - Case #${currentCase}`)
            .setFields
            (
                { name: 'User', value: `${member}`, inline: true},
                { name: 'Moderator', value: `${message.author}`, inline: true},
                { name: 'Reason', value: '```' + `${reason} ` + '```'}
            )
            .setThumbnail(config['Graphical-Settings']['Warning-Icon'])
            .setFooter('Case created on ' + date.toUTCString())
            
        client.channels.cache.get(loggingChannel['id']).send({ embeds: [warnAddLog] })   

        //SQL
        if (sql.state === 'authenticated')
            sql.query(`INSERT INTO ${config['Database']['Table-Name']} VALUES (${currentCase}, 'WARN', ${member.id}, '${JSON.stringify(warnAddLog)}', '${isoDate}')`)
    })
}   

function sendNotice(targetedMember, client, reason)
{
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 

    if (!targetedMember.user.bot)
        targetedMember.send(`:warning: You have received a warning on the ` + '`' + `${guild.name}` + '`' + ` server. Reason: ` + '`' + `${reason}` + '`')
}