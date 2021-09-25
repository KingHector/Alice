const config = require('../config.json')

module.exports = (Discord, client, message) =>
{
    console.log('Bot is Online!')
    client.user.setActivity('Test', { type: 'WATCHING' })

    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 

    //Roles Creator
    roleCreator(guild, 'Muted')

    //Channel Creator
    channelCreator(guild, config['Channel-Settings']['Logging-Channel'])
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