const welcomeConfig = require('../../Configuration/Plugins/welcome.json')
const consoleLogger = require('../utilities/consoleLogger')

module.exports = (Discord, client, remove) =>
{
    if (welcomeConfig['Message-On-Leave']['Enabled'])
    {
        try 
        {
            const leaveChannel = client.channels.cache.find(channel => channel.name === welcomeConfig['Message-On-Leave']['Channel'])

            client.channels.cache.get(leaveChannel['id']).send(welcomeConfig['Message-On-Leave']['Message'].replace('{user}', `<@${remove.user.id}>`))
        }    
        catch (error)
        {
            consoleLogger.createLog('ERROR', 'Plugin Welcome/Message-On-Leave is not configured properly.')
        }
    }
}