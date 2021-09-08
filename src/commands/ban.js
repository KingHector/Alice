module.exports = 
{
    name: "ban",
    description: "Ban any player from your server.",

    async execute(client, message, args, Discord)
    {
        const member = message.mentions.users.first()

        if (message.member.permissions.has('BAN_MEMBERS'))
        {
            if (args.length >= 1)
            {
                const targetedMember = message.guild.members.cache.get(member.id)
                
                if (!targetedMember.permissions.has('ADMINISTRATOR') || targetedMember.user.bot)
                {
                    targetedMember.ban({reason: args[1] })
                    message.channel.send(':hammer: Successfully banned <@' + member + '>.')
                }
                else //Member is Admin
                    message.channel.send('**You cannot ban this member.**')
            }
            else //No member specified
                message.channel.send(':x: **Invalid usage. Use !ban <user> __<reason>__.**')  
        }
    }
}