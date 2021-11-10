const config = require('../../Configuration/config.json')
const moderationPlugin = require('../../configuration/plugins/moderation.json')
const prefix = config['Main-Settings']['Command-Prefix']
const embedCreators = require('../utilities/embedCreators')

if (!moderationPlugin['Discord-Moderation']['enabled']) return

module.exports = 
{
    name: 'kick',
    description: 'Kicks any user from your server.',

    async execute(client, message, args, Discord)
    {
        if (!message.member.permissions.has('ADMINISTRATOR')) return

        const member = message.mentions.users.first()
        
        if (args.length >= 1)
        {
            const reason = message.content.slice(prefix.length + 2).slice(this.name.length).slice(args[0].length)
            try
            {
                const targetedMember = message.guild.members.cache.get(member.id)
                
                if (!targetedMember.permissions.has('ADMINISTRATOR') || targetedMember.user.bot)
                {
                    sendNotice(targetedMember, client, reason)
                    targetedMember.kick({ reason: args[1] })
                    message.channel.send(':boot: Successfully kicked <@' + member + '>.')
                    embedCreators.log(client, '#FFA500', member, message, reason, 'KICK', true)
                }
                else //Member is Admin
                    message.channel.send('**You cannot kick this member.**')
            }
            catch (error) //Pinged role instead of user
            {
                message.channel.send(`:x: **Invalid usage. Use ${prefix}kick <user> __<reason>__.**`) 
            }
        }
        else //No member specified
            message.channel.send(`:x: **Invalid usage. Use ${prefix}kick <user> __<reason>__.**`)  
    }
}

function sendNotice(targetedMember, client, reason)
{
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 

    try
    {
        if (!targetedMember.user.bot)
            targetedMember.send(`:boot: You have been kicked from the ` + '`' + `${guild.name}` + '`' + ` server. Reason: ` + '`' + `${reason}` + '`')
    }
    catch (error) {}
}