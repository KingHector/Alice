const Discord = require('discord.js')
const chalk = require('chalk')
const crafatar = require('crafatar')
const sql = require('../alice').getsql
const logsPlugin = require('../../Configuration/Plugins/logs.json')

//Minecraft Punishment Embed
module.exports.createPunishmentEmbed = function createPunishmentEmbed(username, uuid, Punishment, Server, Reason, server)
{
    const finalUsername = username.at(-1).name
    const head = crafatar.getHead(uuid) + '?overlay'
    let embedDescription = `**Username:** ${finalUsername} \n **UUID**: ${uuid} \n **Punishment:** ${Punishment} \n`
        
    server.length > 0 ? embedDescription += `**Server:** ${Server} \n` : null
    embedDescription += `**Reason:** ${Reason} \n\n **Player Info:** [NameMC](https://mine.ly/${finalUsername})`

    const punishmentEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Punishment Logger - ${finalUsername}`)
        .setDescription(embedDescription)
        .setThumbnail(head)

    return punishmentEmbed    
}

//Discord Punishment Logger
module.exports.log = function log(client, color, member, message, reason, punishmentType, addReason)  
{
    if (!logsPlugin['Discord-Logs']['Enabled']) return

    sql.query(`SELECT COUNT(*) AS cases FROM ${logsPlugin['Discord-Logs']['Table-Name']}`, function(err, rows, fields) 
    {
        var currentCase = undefined
        sql.state === 'authenticated' ? currentCase = rows['0'].cases + 1 : undefined

        //Embed
        const loggingChannel = client.channels.cache.find(channel => channel.name === logsPlugin['Discord-Logs']['Logging-Channel'])
        const date = new Date()    
        const isoDate = date.toISOString().split('T')[0] 

        const addLog = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`${punishmentType} - Case #${currentCase}`)
            .setFields
            (
                { name: 'User', value: `${member.tag} \\n <@${member.id}>`, inline: true},
                { name: 'Moderator', value: `${message.author.tag} \\n <@${message.author.id}>`, inline: true},
            )
            .setThumbnail(`attachment://${punishmentType}.png`)
            .setFooter('Case created on ' + date.toUTCString())

        addReason ? addLog.addField('Reason', '```' + `${reason} ` + '```') : null    
            
        if (sql.state === 'authenticated')
        {
            //Store Case On Database
            sql.query(`INSERT INTO ${logsPlugin['Discord-Logs']['Table-Name']} VALUES 
                (${currentCase}, 
                '${punishmentType}', 
                 ${member.id}, 
                '${JSON.stringify(addLog)}', 
                '${isoDate}')`)

            //Grab the case from the database and send it. Seems excessive but is required since SQL doesn't like '\n' on JSON.            
            sql.query(`SELECT * FROM discordlogs WHERE CaseID = ${currentCase}`, function(err, caseNo, fields) 
            {
                const embedJSON = JSON.parse(caseNo[0]['Embed'])
                client.channels.cache.get(loggingChannel['id']).send({ embeds: [embedJSON], files: [`src/icons/${punishmentType}.png`] })
            })  
        }
        else //Databse Offline
        {
            let t = JSON.stringify(addLog).replace(/\\n/g, /\n/)
            client.channels.cache.get(loggingChannel['id']).send({ embeds: [JSON.parse(t)], files: [`src/icons/${punishmentType}.png`] })
        }    
    })
}   