const chalk = require('chalk')
const welcomeConfig = require('../../Configuration/Plugins/welcome.json')

module.exports = (Discord, client, add) =>
{
    if (welcomeConfig['Message-On-Join']['Enabled'])
    {
        try 
        {
            const welcomeChannel = client.channels.cache.find(channel => channel.name === welcomeConfig['Message-On-Join']['Channel'])

            client.channels.cache.get(welcomeChannel['id']).send(welcomeConfig['Message-On-Join']['Message'].replace('{user}', `<@${add.user.id}>`))
        }    
        catch (error)
        {
            console.log(chalk.red('[ERROR] Plugin: Welcome/Message-On-Join is not configured properly.'))
        }
    }

    if (welcomeConfig['Private-Message-On-Join']['Enabled'])
    {
        try
        {
            const member = add.user.id
            member.send(welcomeConfig['Private-Message-On-Join']['Message'].replace('{user}', `<@${member}>`))
        }
        catch (error){}
    }
}