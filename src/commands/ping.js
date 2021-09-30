module.exports = 
{
    name: 'ping',
    description: 'Show the latency in milliseconds.',

    async execute(client, message, args, discord)
    {
        message.channel.send(`:ping_pong: Took ${client.ws.ping}ms`)  
    }
}