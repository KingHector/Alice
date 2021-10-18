const config = require('../config.json')
const { MessageEmbed } = require('discord.js')
const sql = require('../typDiscordBot').getsql

module.exports = 
{
    name: 'unmute',
    description: 'Unmutes any muted user from your server.',

    async execute(client, message, args, Discord)
    {
        const member = message.mentions.users.first()
        let role = message.guild.roles.cache.find(role => role.name === 'Muted')

        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 1)
            {
                const targetedMember = message.guild.members.cache.get(member.id)

                if (targetedMember.roles.cache.some(role => role.name === 'Muted'))
                {
                    sendNotice(targetedMember, client)
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
    sql.query(`SELECT COUNT(*) AS cases FROM ${config['Database']['Table-Name']}`, function(err, rows, fields) 
    {
        var currentCase = undefined
        sql.state === 'authenticated' ? currentCase = rows['0'].cases + 1 : undefined

        //Embed
        const loggingChannel = client.channels.cache.find(channel => channel.name === config['Main-Settings']['Logging-Channel'])
        const date = new Date()  
        const isoDate = date.toISOString().split('T')[0]   

        const unmuteAddLog = new MessageEmbed()
            .setColor('#ADD8E6')
            .setTitle(`UNMUTE - Case #${currentCase}`)
            .setFields
            (
                { name: 'User', value: `${member}`, inline: true},
                { name: 'Moderator', value: `${message.author}`, inline: true},
            )
            .setThumbnail('attachment://Unmute.png')
            .setFooter('Case updated on ' + date.toUTCString())
            
        client.channels.cache.get(loggingChannel['id']).send({ embeds: [unmuteAddLog], files: ['src/icons/Unmute.png'] }) 
        
        //SQL
        if (sql.state === 'authenticated')
            sql.query(`INSERT INTO ${config['Database']['Table-Name']} VALUES (${currentCase}, 'UNMUTE', ${member.id}, '${JSON.stringify(unmuteAddLog)}', '${isoDate}')`)
    })
}   

function sendNotice(targetedMember, client)
{
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 

    if (!targetedMember.user.bot)
        targetedMember.send(`:loud_sound: You have been unmuted on the ` + '`' + `${guild.name}` + '`' + ` server.`)
}