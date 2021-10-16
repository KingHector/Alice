const config = require('../config.json');
const { MessageEmbed } = require('discord.js')
const sql = require('../typDiscordBot').getsql

module.exports = (Discord, client, user) =>
{
    unbanLog(client, user.user)
    console.log(user.user)
}

function unbanLog(client, user)  
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
                { name: 'User', value: `${user}`, inline: true},
                { name: 'Moderator', value: `mod`, inline: true},
            )
            .setThumbnail(config['Graphical-Settings']['Unban-Icon'])
            .setFooter('Case updated on ' + date.toUTCString())
            
        client.channels.cache.get(loggingChannel['id']).send({ embeds: [unbanAddLog] })  
        
        //SQL
        if (sql.state === 'authenticated')
            sql.query(`INSERT INTO ${config['Database']['Table-Name']} VALUES (${currentCase}, 'UNBAN', ${user.id}, '${JSON.stringify(unbanAddLog)}')`)
    });   
}