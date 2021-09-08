const config = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = (Discord, client, message) =>
{
    console.log('Bot is Online!')

    const loggingChannel = client.channels.cache.find(channel => channel.name === config['Something-Settings']['Logging-Channel'])
    const date = new Date()

    const banAddLog = new MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('BAN - Case #')
        .setFields()
        .setThumbnail(config['Graphical-Settings']['Ban-Image'])
        .setFooter('Case created on ' + date.toUTCString())
       
    client.channels.cache.get(loggingChannel['id']).send({ embeds: [banAddLog] }) 
}