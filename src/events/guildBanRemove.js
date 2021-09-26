const config = require('../config.json');
const { MessageEmbed } = require('discord.js')

module.exports = (Discord, client, user) =>
{
    unbanLog(client, user.user)
    console.log(user.user)
}

function unbanLog(client, user)  
{
    const loggingChannel = client.channels.cache.find(channel => channel.name === config['Channel-Settings']['Logging-Channel'])
    const date = new Date()    

    const unbanAddLog = new MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('UNBAN - Case #')
        .setFields
        (
            { name: 'User', value: `${user.tag}\n${user}`, inline: true},
            { name: 'Moderator', value: `mod`, inline: true},
        )
        .setThumbnail(config['Graphical-Settings']['Unban-Icon'])
        .setFooter('Case updated on ' + date.toUTCString())
       
    client.channels.cache.get(loggingChannel['id']).send({ embeds: [unbanAddLog] })   
}