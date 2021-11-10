const config = require('../../Configuration/config.json')
const logsPlugin = require('../../Configuration/Plugins/logs.json')
const consoleLogger = require('../utilities/consoleLogger')

module.exports = (Discord, client, message) =>
{
    consoleLogger.createLog('INFO', 'Bot online!')
    client.user.setActivity(config['Main-Settings']['Activity-Message'], { type: config['Main-Settings']['Activity-Type'] })
    client.user.setStatus(config['Main-Settings']['Status'])
    
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 
    
    //Roles Creator
    roleCreator(guild, 'Muted')

    //Channel Creator
    channelCreator(guild, logsPlugin['Discord-Logs']['Logging-Channel'])
}

function channelCreator(guild, name)
{
    const loggingChannel = guild.channels.cache.find(channel => channel.name === name)
    
    if (!loggingChannel)
    {
        guild.channels.create(name,
            {
                permissionOverwrites: 
                [
                    {
                        id: guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'] 
                    }
                ]
            })
    }
}

function roleCreator(guild, roleName)
{
    const roleExists = guild.roles.cache.find(role => role.name === roleName)
    
    if (!roleExists)
    {
        const muteRole = guild.roles.create
            ({
                name: roleName,
                color: 'DEFAULT',
                permissions: ['VIEW_CHANNEL', 'CREATE_INSTANT_INVITE', 'CHANGE_NICKNAME', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK', 'USE_VAD']
            })    
    }

}