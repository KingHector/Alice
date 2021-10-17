const config = require('../config.json')
const { MessageEmbed } = require('discord.js')
const sql = require('../typDiscordBot').getsql

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'mute',
    description: 'Mutes any user in your server.',

    async execute(client, message, args, discord)
    {
        const member = message.mentions.users.first()
        let role = message.guild.roles.cache.find(role => role.name === 'Muted')
        
        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 1)
            {
                const reason = message.content.slice(prefix.length + 2).slice('mute'.length).slice(args[0].length)
                const targetedMember = message.guild.members.cache.get(member.id)

                if ((!targetedMember.permissions.has('ADMINISTRATOR') || targetedMember.user.bot))
                {
                    if (!targetedMember.roles.cache.some(role => role.name === 'Muted'))
                    {
                        sendNotice(targetedMember, client, reason)
                        targetedMember.roles.add(role)
                        message.channel.send(':mute: Successfully muted <@' + member + '>.')
                        muteLog(client, member, message, reason)
                    }
                    else //Member is already Muted
                      message.channel.send('**Member is already muted.**')
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
    sql.query(`SELECT COUNT(*) AS cases FROM ${config['Database']['Table-Name']}`, function(err, rows, fields) 
    {
        var currentCase = undefined
        sql.state === 'authenticated' ? currentCase = rows['0'].cases + 1 : undefined

        //Embed
        const loggingChannel = client.channels.cache.find(channel => channel.name === config['Main-Settings']['Logging-Channel'])
        const date = new Date()   
        const isoDate = date.toISOString().split('T')[0] 

        const muteAddLog = new MessageEmbed()
            .setColor('#ADD8E6')
            .setTitle(`MUTE - Case #${currentCase}`)
            .setFields
            (
                { name: 'User', value: `${member}`, inline: true},
                { name: 'Moderator', value: `${message.author}`, inline: true},
                { name: 'Reason', value: '```' + `${reason} ` + '```'}
            )
            .setThumbnail(config['Graphical-Settings']['Mute-Icon'])
            .setFooter('Case created on ' + date.toUTCString())
     
        client.channels.cache.get(loggingChannel['id']).send({ embeds: [muteAddLog] }) 
        
        //SQL
        if (sql.state === 'authenticated')
            sql.query(`INSERT INTO ${config['Database']['Table-Name']} VALUES (${currentCase}, 'MUTE', ${member.id}, '${JSON.stringify(muteAddLog)}', '${isoDate}')`)
    })
} 

function sendNotice(targetedMember, client, reason)
{
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 

    if (!targetedMember.user.bot)
        targetedMember.send(`:mute: You have been muted on the ` + '`' + `${guild.name}` + '`' + ` server. Reason: ` + '`' + `${reason}` + '`')
}
