const config = require('../config.json')

module.exports = (Discord, client, message) =>
{
    console.log('Bot is Online!')

    channelCheck(client, config['Channel-Settings']['Logging-Channel'])
}

function channelCheck (client, configSection)
{
    const loggingChannel = client.channels.cache.find(channel => channel.name === configSection)
    const missingMessage = '%cChannel named ' + configSection + ' does not exist. Make sure you have configured config.json and have created the correct channel.' 
    
    const check = loggingChannel ? null : console.log(missingMessage, 'color: yellow')
}