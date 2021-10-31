const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_BANS', 'GUILD_MEMBERS']})
const mysql = require('mysql')
const chalk = require('chalk')

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