const config = require('../../Configuration/config.json')
const moderationPlugin = require('../../configuration/plugins/moderation.json')
const prefix = config['Main-Settings']['Command-Prefix']
const embedCreators = require('../utilities/embedCreators')

if (!moderationPlugin['Discord-Moderation']['enabled']) return

module.exports = 
{
    name: 'warn',
    description: 'Warns any user in your server.',

    async execute(client, message, args, discord)
    {
        if (!message.member.permissions.has('ADMINISTRATOR')) return

        const member = message.mentions.users.first()
        
        if (args.length >= 2)
        {
            const reason = message.content.slice(prefix.length + 2).slice(this.name.length).slice(args[0].length)
            try
            {
                const targetedMember = message.guild.members.cache.get(member.id)
                
                sendNotice(targetedMember, client, reason)
                message.channel.send(':warning: Successfully warned <@' + member + '>.')
                embedCreators.log(client, '#00FF00', member, message, reason, 'WARN', true)
            }
            catch (error) //Pinged role instead of user
            {
                message.channel.send(`:x: **Invalid usage. Use ${prefix}warn <user> <reason>.**`)  
            }           
        }
        else //No member specified
            message.channel.send(`:x: **Invalid usage. Use ${prefix}warn <user> <reason>.**`)  
    }
}

function sendNotice(targetedMember, client, reason)
{
    const guild = client.guilds.cache.get(config['Main-Settings']['Server-ID']) 

    try 
    {
        if (!targetedMember.user.bot)
            targetedMember.send(`:warning: You have received a warning on the ` + '`' + `${guild.name}` + '`' + ` server. Reason: ` + '`' + `${reason}` + '`')
    }
    catch (error) {}
}