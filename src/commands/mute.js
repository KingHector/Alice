const chalk = require('chalk')
const config = require('../../Configuration/config.json')
const embedCreators = require('../utilities/embedCreators')

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'mute',
    description: 'Mutes any user in your server.',

    async execute(client, message, args, discord)
    {
        const member = message.mentions.users.first()
        let role = message.guild.roles.cache.find(role => role.name === 'Muted')
        
        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 1)
            {
                const reason = message.content.slice(prefix.length + 2).slice(this.name.length).slice(args[0].length)

                try
                {
                    const targetedMember = message.guild.members.cache.get(member.id)

                    if ((!targetedMember.permissions.has('ADMINISTRATOR') || targetedMember.user.bot))
                    {
                        if (!targetedMember.roles.cache.some(role => role.name === 'Muted'))
                        {
                            try
                            {
                                targetedMember.roles.add(role)
                                sendNotice(targetedMember, client, reason)
                                message.channel.send(':mute: Successfully muted <@' + member + '>.')
                                embedCreators.log(client, '#ADD8E6', member, message, reason, 'MUTE', true)
                            }
                            catch (error)
                            {
                                console.log(chalk.red('[ERROR] Muted role needs to be bellow the bot role.'))
                                message.channel.send('An error occured check console for more info.')
                            }
                        }
                        else //Member is already Muted
                          message.channel.send('**Member is already muted.**')
                    }
                    else //Member is Admin
                        message.channel.send('**You cannot mute this member.**')
                }
                catch (error) //Pinged role instead of user
                {
                    message.channel.send(`:x: **Invalid usage. Use ${prefix}mute <user> __<reason>__.**`)
                }        
            }
            else //No member specified
                message.channel.send(`:x: **Invalid usage. Use ${prefix}mute <user> __<reason>__.**`)  
        }
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
