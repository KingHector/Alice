const config = require('../../Configuration/config.json')
const logsPlugin = require('../../Configuration/Plugins/logs.json')
const { MessageEmbed } = require('discord.js')
const sql = require('../alice').getsql

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
                const reason = message.content.slice(prefix.length + 2).slice(this.name.length).slice(args[0].length)

                try
                {
                    const targetedMember = message.guild.members.cache.get(member.id)
                    
                    sendNotice(targetedMember, client, reason)
                    message.channel.send(':warning: Successfully warned <@' + member + '>.')
                    warnLog(client, member, message, reason, this.name)
                }
                catch (error) //Pinged role instead of user
                {
                    message.channel.send(`:x: **Invalid usage. Use ${prefix}warn <user> <reason>.**`)  
                }           
            }
            else //No member specified
                message.channel.send(`:x: **Invalid usage. Use ${prefix}warn <user> <reason>.**`)  
        }
    }
}

function warnLog(client, member, message, reason, commandName)  
{
    if (!logsPlugin['Discord-Logs']['Enabled']) return

    sql.query(`SELECT COUNT(*) AS cases FROM ${logsPlugin['Discord-Logs']['Table-Name']}`, function(err, rows, fields) 
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
                { name: 'User', value: `${member} \\n test`, inline: true},
                { name: 'Moderator', value: `${message.author}`, inline: true},
                { name: 'Reason', value: '```' + `${reason} ` + '```'}
            )
            .setThumbnail('attachment://Warn.png')
            .setFooter('Case created on ' + date.toUTCString())
            
        client.channels.cache.get(loggingChannel['id']).send({ embeds: [warnAddLog], files: ['src/icons/Warn.png'] })   
             
        //SQL
        if (sql.state === 'authenticated')
            sql.query(`INSERT INTO ${config['Database']['DiscordLogs-Table-Name']} VALUES 
                (${currentCase}, 
                '${commandName}', 
                 ${member.id}, 
                '${JSON.stringify(warnAddLog)}', 
                '${isoDate}')`)
    })
}   

function sendNotice(targetedMember, client, reason)
{
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 

    try 
    {
        if (!targetedMember.user.bot)
            targetedMember.send(`:warning: You have received a warning on the ` + '`' + `${guild.name}` + '`' + ` server. Reason: ` + '`' + `${reason}` + '`')
    }
    catch (error) {}
}