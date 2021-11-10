const config = require('../../Configuration/config.json')
const { MessageEmbed } = require('discord.js')
const sql = require('../alice').getsql

module.exports = (Discord, client, ban) =>
{
    unbanLog(client, ban)
}

function unbanLog(client, ban)  
{
    sql.query(`SELECT COUNT(*) AS cases FROM ${config['Database']['DiscordLogs-Table-Name']}`, function(err, rows, fields) 
    {
        var currentCase = undefined
        sql.state === 'authenticated' ? currentCase = rows['0'].cases + 1 : undefined

        //Embed
        const loggingChannel = client.channels.cache.find(channel => channel.name === config['Channel-Settings']['Logging-Channel'])
        const date = new Date()    

        const unbanAddLog = new MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`UNBAN - Case #${currentCase}`)
            .setFields
            (
                { name: 'User', value: `${ban.user}`, inline: true},
                { name: 'Moderator', value: `${ban.client.user}`, inline: true},
            )
            .setThumbnail('attachment://Unban.png')
            .setFooter('Case created on ' + date.toUTCString())
            
        client.channels.cache.get(loggingChannel['id']).send({ embeds: [unbanAddLog], files: ['src/icons/Unban.png'] })  
        
        //SQL
        if (sql.state === 'authenticated')
            sql.query(`INSERT INTO ${config['Database']['DiscordLogs-Table-Name']} VALUES (${currentCase}, 'UNBAN', ${ban.user.id}, '${JSON.stringify(unbanAddLog)}')`)

        //Grab the case from the database and send it. Seems excessive but is required since SQL doesn't like '\n' on JSON.            
        sql.query(`SELECT * FROM discordlogs WHERE CaseID = ${currentCase}`, function(err, caseNo, fields) 
        {
            const embedJSON = JSON.parse(caseNo[0]['Embed'])
            message.channel.send({ embeds: [embedJSON], files: ['src/icons/Unban.png'] })
        })           
    })
}