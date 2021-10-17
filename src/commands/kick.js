const config = require('../config.json')
const { MessageEmbed } = require('discord.js')
const sql = require('../typDiscordBot').getsql

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'kick',
    description: 'Kicks any user from your server.',

    async execute(client, message, args, Discord)
    {
        const member = message.mentions.users.first()
        
        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 1)
            {
                const reason = message.content.slice(prefix.length + 2).slice('kick'.length).slice(args[0].length)
                const targetedMember = message.guild.members.cache.get(member.id)
                
                if (!targetedMember.permissions.has('ADMINISTRATOR') || targetedMember.user.bot)
                {
                    sendNotice(targetedMember, client, reason)
                    targetedMember.kick({ reason: args[1] })
                    message.channel.send(':boot: Successfully kicked <@' + member + '>.')
                    kickLog(client, member, message, reason)
                }
                else //Member is Admin
                    message.channel.send('**You cannot kick this member.**')
            }
            else //No member specified
                message.channel.send(':x: **Invalid usage. Use !kick <user> __<reason>__.**')  
        }
    }
}

function kickLog(client, member, message, reason)  
{
    sql.query(`SELECT COUNT(*) AS cases FROM ${config['Database']['Table-Name']}`, function(err, rows, fields) 
    {
        var currentCase = undefined
        sql.state === 'authenticated' ? currentCase = rows['0'].cases + 1 : undefined

        //Embed
        const loggingChannel = client.channels.cache.find(channel => channel.name === config['Channel-Settings']['Logging-Channel'])
        const date = new Date() 
        const isoDate = date.toISOString().split('T')[0]    
        
        const kickAddLog = new MessageEmbed()
            .setColor('#FFA500')
            .setTitle(`KICK - Case #${currentCase}`)
            .setFields
            (
                { name: 'User', value: `${member}`, inline: true},
                { name: 'Moderator', value: `${message.author}`, inline: true},
                { name: 'Reason', value: '```' + `${reason} ` + '```'}
            )
            .setThumbnail(config['Graphical-Settings']['Kick-Icon'])
            .setFooter('Case created on ' + date.toUTCString())
            
        client.channels.cache.get(loggingChannel['id']).send({ embeds: [kickAddLog] })   

        //SQL
        if (sql.state === 'authenticated')
            sql.query(`INSERT INTO ${config['Database']['Table-Name']} VALUES (${currentCase}, 'KICK', ${member.id}, '${JSON.stringify(kickAddLog)}', '${isoDate}')`)
    })
}

function sendNotice(targetedMember, client, reason)
{
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 

    if (!targetedMember.user.bot)
        targetedMember.send(`:boot: You have been kicked from the ` + '`' + `${guild.name}` + '`' + ` server. Reason: ` + '`' + `${reason}` + '`')
}