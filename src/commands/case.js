const { MessageEmbed } = require('discord.js')
const sql = require('../typDiscordBot').getsql

module.exports = 
{
    name: 'case',
    description: 'Shows the punishment case specified.',

    async execute(client, message, args, Discord)
    {
        if (sql.state === 'authenticated')
        {
            if (message.member.permissions.has('ADMINISTRATOR'))
            {
                if (args.length >= 1)
                {
                    sql.query(`SELECT * FROM discordlogs WHERE CaseID = ${args[0]}`, function(err, caseNo, fields) 
                    {
                        const embedJSON = JSON.parse(caseNo[0]['Embed'])
                        message.channel.send({ embeds: [embedJSON] })
                    })
                }
                else //No case specified
                    message.channel.send(':x: **Invalid usage. Use !case <caseNumber>.**')
            }
        }
        else //Database offline
            message.channel.send(':x: **Cannot receive cases from database.**')
    }   
}