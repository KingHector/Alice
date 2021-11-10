const config = require('../../Configuration/config.json')
const moderationPlugin = require('../../configuration/plugins/moderation.json')
const prefix = config['Main-Settings']['Command-Prefix']
const embedCreators = require('../utilities/embedCreators')

if (!moderationPlugin['Discord-Moderation']['enabled']) return

module.exports = 
{
    name: 'mute',
    description: 'Mutes any user in your server.',

    execute(client, message, args, discord)
    {
        if (!message.member.permissions.has('ADMINISTRATOR')) return

        const member = message.mentions.users.first()
        let role = message.guild.roles.cache.find(role => role.name === 'Muted')

        if (member)
        {
            if (args.length >= 1)
            {
                const reason = message.content.slice(prefix.length + 2).slice(this.name.length).slice(args[0].length)
                const targetedMember = message.guild.members.cache.get(member.id)
                if ((!targetedMember.permissions.has('ADMINISTRATOR') || targetedMember.user.bot))
                {
                    if (!targetedMember.roles.cache.some(role => role.name === 'Muted'))
                    {
                        targetedMember.roles.add(role)
                        sendNotice(targetedMember, client, reason)
                        message.channel.send(':mute: Successfully muted <@' + member + '>.')
                        embedCreators.log(client, '#ADD8E6', member, message, reason, 'MUTE', true)
                    }
                    else //Member is already Muted
                      message.channel.send('**Member is already muted.**')
                }
                else //Member is Admin
                    message.channel.send('**You cannot mute this member.**') 
            }
        }
        else //Role was pinged instead of user
            message.channel.send(`:x: **Invalid usage. Use ${prefix}mute <user> __<reason>__.**`) 
    }
}

function sendNotice(targetedMember, client, reason)
{
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 

    try
    {
        if (!targetedMember.user.bot)
            targetedMember.send(`:mute: You have been muted on the ` + '`' + `${guild.name}` + '`' + ` server. Reason: ` + '`' + `${reason}` + '`')
    }
    catch (error) {}
}