const config = require('../../Configuration/config.json')
const { MessageEmbed } = require('discord.js')
const sql = require('../alice').getsql

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'ban',
    description: 'Bans any user from your server.',

    async execute(client, message, args, Discord)
    {
        const member = message.mentions.users.first()

        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 1)
            {
                const reason = message.content.slice(prefix.length + 2).slice(this.name.length).slice(args[0].length)
                const targetedMember = message.guild.members.cache.get(member.id)
                
                if (!targetedMember.permissions.has('ADMINISTRATOR') || targetedMember.user.bot)
                {
                    sendNotice(targetedMember, client, reason)
                    targetedMember.ban({ reason: args[1] })
                    message.channel.send(':hammer: Successfully banned <@' + member + '>.')
                    banLog(client, member, message, reason, this.name)
                }
                else //Member is Admin
                    message.channel.send('**You cannot ban this member.**')
            }
            else //No member specified
                message.channel.send(`:x: **Invalid usage. Use ${prefix}ban <user> __<reason>__.**`)  
        }
    }
}

function banLog(client, member, message, reason, commandName)  
{
    sql.query(`SELECT COUNT(*) AS cases FROM ${config['Database']['DiscordLogs-Table-Name']}`, function(err, rows, fields) 
    {
        var currentCase = undefined
        sql.state === 'authenticated' ? currentCase = rows['0'].cases + 1 : undefined

        //Embed
        const loggingChannel = client.channels.cache.find(channel => channel.name === config['Main-Settings']['Logging-Channel'])
        const date = new Date()    
        const isoDate = date.toISOString().split('T')[0] 

        const banAddLog = new MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`BAN - Case #${currentCase}`)
            .setFields
            (
                { name: 'User', value: `${member}`, inline: true},
                { name: 'Moderator', value: `${message.author}`, inline: true},
                { name: 'Reason', value: '```' + `${reason} ` + '```'}
            )
            .setThumbnail('attachment://Ban.png')
            .setFooter('Case created on ' + date.toUTCString())
            
        client.channels.cache.get(loggingChannel['id']).send({ embeds: [banAddLog], files: ['src/icons/Ban.png'] }) 
            
        //SQL
        if (sql.state === 'authenticated')
            sql.query(`INSERT INTO ${config['Database']['DiscordLogs-Table-Name']} VALUES 
                (${currentCase}, 
                '${commandName}', 
                 ${member.id}, 
                '${JSON.stringify(banAddLog)}, 
                '${isoDate}')`)
    })
}

function sendNotice(targetedMember, client, reason)
{
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 
    
    if (!targetedMember.user.bot)
        targetedMember.send(`:hammer: You have been banned from the ` + '`' + `${guild.name}` + '`' + ` server. Reason: ` + '`' + `${reason}` + '`')
}