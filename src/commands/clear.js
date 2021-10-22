const config = require('../../config.json')

const prefix = config['Main-Settings']['Command-Prefix']

module.exports = 
{
    name: 'clear',
    description: 'Clear up to 100 messages.',

    async execute(client, message, args, Discord)
    {
        if (message.member.permissions.has('ADMINISTRATOR'))
        {
            if (args.length >= 1)
            {
                if (args[0] <= 100 && args[0] >= 1)
                {
                    message.delete()
                    message.channel.messages.fetch({limit: args[0]}).then(m =>
                    {
                        message.channel.bulkDelete(m, true);
                        message.channel.send('**Clearing...**').then(me =>
                            {
                                me.delete()
                            })
                    })
                }
                else //Wrong amount specified
                    message.channel.send(':x: **Invalid usage. Amount must be a number between 1 and 100.**')  
            }
            else //No amount specified
                message.channel.send(`:x: **Invalid usage. Use ${prefix}clear <amount>.**`)  
        }
    }
}