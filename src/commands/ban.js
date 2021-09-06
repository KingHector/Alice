module.exports = 
{
    name: "ban",
    description: "Ban any player from your server.",

    async execute(client, message, args, Discord)
    {
        const member = message.mentions.users.first();

        if (message.member.permissions.has('BAN_MEMBERS'))
        {
           if (member)
            {
                const targetedMember = message.guild.members.cache.get(member.id);

                if (!targetedMember.permissions.has('ADMINISTRATOR') || targetedMember.user.bot)
                    targetedMember.ban(args[1]);
                else
                    message.channel.send('**You cannot ban this member.**');     
            }
            else //No member specified
                message.channel.send('**You need to specify which member to ban.**');     
        }
    }
}