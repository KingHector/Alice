const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_BANS', 'GUILD_MEMBERS']})
const mysql = require('mysql')
const chalk = require('chalk')
const crafatar = require('crafatar')

const config = require('../Configuration/config.json')
const logsPlugin = require('../Configuration/Plugins/logs.json') 
const token = config['Main-Settings']['Bot-Token']

var sql = mysql.createConnection 
({
    host: config['Database']['Host'],
    user: config['Database']['User'],
    password: config['Database']['Password'],
    database: config['Database']['Database']
})  

if (logsPlugin['Discord-Logs']['Enabled'] || logsPlugin['Minecraft-Logs']['Enabled'])
{
    sql.connect(error => 
    {
        if (!error) 
        {
            console.log(chalk.blueBright('[INFO] Connected to Database.'))
            if (logsPlugin['Discord-Logs']['Enabled'])
                sql.query(`CREATE TABLE IF NOT EXISTS ${logsPlugin['Discord-Logs']['Table-Name']} (CaseID INT, Punishment VARCHAR(255), UUID VARCHAR(255), Embed JSON, Date DATE)`)
            
            if (logsPlugin['Minecraft-Logs']['Enabled'])
                console.log('fix this hector')    
        }
        else //No Database Connection
            console.log(chalk.yellow('[WARN] Could not connect to Database. Logs will not be stored.'))
    })
}

module.exports = { getsql: sql}            

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['commandHandler', 'eventHandler'].forEach(handler => 
    {
        require(`./handlers/${handler}`)(client, Discord)
    });    

client.login(token)

//Punishment Embed
module.exports.embed = function embed(username, uuid, Punishment, Server, Reason, server)
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