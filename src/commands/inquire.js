const { MessageEmbed } = require('discord.js')
const sql = require('../alice').getsql

module.exports = 
{
    name: 'inquire',
    description: 'Shows all the punishments a user has received.',

    async execute(client, message, args, Discord)
    {
        const member = message.mentions.users.first()
        if (sql.state === 'authenticated')
        {
            if (message.member.permissions.has('ADMINISTRATOR'))
            {
                if (args.length >= 1)
                {
                    sql.query(`SELECT * FROM discordlogs WHERE UUID = '${member.id}'`, function(err, inquires, fields) 
                    {
                        if (inquires.length != 0)
                        {
                            var punishments = ''
                            var cases = ''
                            var dates = '' 

                            for (let i = 0; i < inquires.length; i++)
                            {
                                punishments += inquires[i]['Punishment'] + '\n'
                                cases +=  `Case #${inquires[i]['CaseID']}\n`
                                dates += inquires[i]['Date'].toISOString().split('T')[0]  + '\n'
                            }

                            const inquireEmbed = new MessageEmbed()
                                .setColor('#cec4ff')
                                .setTitle(`${member.tag} - Punishments`)
                                .setFields
                                (
                                    { name: 'Punishment', value: punishments, inline: true},
                                    { name: 'Case', value: cases, inline: true},
                                    { name: 'Date', value: dates, inline: true}
                                )
                                
                            message.channel.send({ embeds: [inquireEmbed] })
                        }
                        else //No inquiries
                            message.channel.send('**:white_check_mark: This member has no prior inquiries.**')
                    })
                }
                else //No member specified
                    message.channel.send(`:x: **Invalid usage. Use ${prefix}inquire <user>.**`)  
            }
            else //Database offline
                message.channel.send(':x: **Cannot receive inquiries from database.**')  
        }
    }
}