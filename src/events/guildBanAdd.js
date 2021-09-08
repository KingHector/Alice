const config = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = (Discord, client, user) =>
{
    const loggingChannel = client.channels.cache.find(channel => channel.name === config['Something-Settings']['Logging-Channel'])
    const date = new Date()

    const banAddLog = new MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('BAN')
        .setDescription('YOUR MOM')
        .setThumbnail('./src/images/Hammer.png')
        .setFooter(date.toLocaleString())
       
    client.channels.cache.get(loggingChannel['id']).send({ embeds: [banAddLog] })   
}