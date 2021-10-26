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
            console.log(chalk.red('[ERROR] Plugin Welcome/Message-On-Join is not configured properly.'))
        }
    }

    if (welcomeConfig['Give-Role-To-New-User']['Enabled'])
    {
        try
        {
            const member = add.user.id
            const targetedMember = add.guild.roles.guild.members.cache.get(member)
            const rolesToAdd = welcomeConfig['Give-Role-To-New-User']['Roles']
            
            for (let role of rolesToAdd)
            {
                const t = add.guild.roles.cache.find(r => r.name === `${role}`)
                targetedMember.roles.add(t)
            }
        }   
        catch (error)
        {
            console.log(chalk.red('[ERROR] Plugin Welcome/Give-Role-To-New-User is not configured properly.'))
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