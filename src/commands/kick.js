module.exports = 
{
    name: "kick",
    description: "Kick any player from your server.",

    async execute(client, message, args, Discord)
    {
        const member = message.mentions.users.first();

        if (message.member.permissions.has('KICK_MEMBERS'))
        {
           if (member)
            {
                const targeted_member = message.guild.members.cache.get(member.id);

                if (!targeted_member.permissions.has('ADMINISTRATOR'))
                    targeted_member.kick(args[1]);
                else
                    message.channel.send('**You cannot kick this member.**');     
            }
            else //No member specified
                message.channel.send('**You need to specify which member to kick.**');     
        }
    }
}