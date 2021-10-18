const config = require('../config.json')
const { MessageEmbed, GuildBan } = require('discord.js')
const sql = require('../typDiscordBot').getsql

module.exports = (Discord, client, ban) =>
{
    unbanLog(client, ban)
    console.log(ban.client.user)
}

function unbanLog(client, ban)  
{
    sql.query(`SELECT COUNT(*) AS cases FROM ${config['Database']['Table-Name']}`, function(err, rows, fields) 
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
            .setFooter('Case updated on ' + date.toUTCString())
            
        client.channels.cache.get(loggingChannel['id']).send({ embeds: [unbanAddLog], files: ['src/icons/Unban.png'] })  
        
        //SQL
        if (sql.state === 'authenticated')
            sql.query(`INSERT INTO ${config['Database']['Table-Name']} VALUES (${currentCase}, 'UNBAN', ${ban.user.id}, '${JSON.stringify(unbanAddLog)}')`)
    })
}