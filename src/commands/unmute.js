const config = require('../../Configuration/config.json')
const logsPlugin = require('../../Configuration/Plugins/logs.json')
const embedCreators = require('../utilities/embedCreators')

module.exports = 
{
    name: 'unmute',
    description: 'Unmutes any muted user from your server.',

    async execute(client, message, args, Discord)
    {
        const member = message.mentions.users.first()
        let role = message.guild.roles.cache.find(role => role.name === 'Muted')

        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 1)
            {
                try
                {
                    const targetedMember = message.guild.members.cache.get(member.id)

                    if (targetedMember.roles.cache.some(role => role.name === 'Muted'))
                    {
                        sendNotice(targetedMember, client)
                        targetedMember.roles.remove(role)
                        message.channel.send(':loud_sound: Successfully unmuted <@' + member + '>.')
                        embedCreators.log(client, '#ADD8E6', member, message, null, 'UNMUTE', false)
                    }
                    else //Member is not muted
                        message.channel.send('**Member is not muted.**')
                }
                catch (error) //Pinged role instead of user
                {
                    message.channel.send(`:x: **Invalid usage. Use ${prefix}unmute <user>.**`)  
                }        
            }
            else //No member specified
                message.channel.send(`:x: **Invalid usage. Use ${prefix}unmute <user>.**`)  
        }
    }
} 

function sendNotice(targetedMember, client)
{
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 

    try
    {
        if (!targetedMember.user.bot)
            targetedMember.send(`:loud_sound: You have been unmuted on the ` + '`' + `${guild.name}` + '`' + ` server.`)
    }
    catch (error) {}
}