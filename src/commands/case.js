const logsPlugin = require('../../Configuration/Plugins/logs.json')
const sql = require('../alice').getsql

module.exports = 
{
    name: 'case',
    description: 'Shows the punishment case specified.',

    async execute(client, message, args, Discord)
    {
        if (!message.member.permissions.has('ADMINISTRATOR')) return
        if (!logsPlugin['Discord-Logs']['Enabled']) return

        if (sql.state === 'authenticated')
        {
            if (args.length >= 1)
            {
                sql.query(`SELECT * FROM discordlogs WHERE CaseID = ${args[0]}`, function(err, caseNo, fields) 
                {
                    const embedJSON = JSON.parse(caseNo[0]['Embed'])
                    message.channel.send({ embeds: [embedJSON], files: ['src/icons/Warn.png'] })
                })
            }
            else //No case specified
                message.channel.send(`:x: **Invalid usage. Use ${prefix}case <caseNumber>.**`)
        }
        else //Database offline
            message.channel.send(':x: **Cannot receive cases from database.**')
    }   
}