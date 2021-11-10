const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_BANS', 'GUILD_MEMBERS'], partials: ['MESSAGE', 'REACTION', 'CHANNEL']})
const mysql = require('mysql')
const consoleLogger = require('./utilities/consoleLogger')
const config = require('../Configuration/config.json')
const logsPlugin = require('../Configuration/Plugins/logs.json') 
const token = config['Main-Settings']['Bot-Token']

if (logsPlugin['Discord-Logs']['Enabled'] || logsPlugin['Minecraft-Logs']['Enabled'])
{
    var sql = mysql.createConnection 
    ({
        host: config['Database']['Host'],
        user: config['Database']['User'],
        password: config['Database']['Password'],
        database: config['Database']['Database']
    })  

    sql.connect(error => 
    {
        if (!error) 
        {
            consoleLogger.createLog('INFO', 'Connected to Database.')
            if (logsPlugin['Discord-Logs']['Enabled'])
            {
                sql.query(`CREATE TABLE IF NOT EXISTS ${logsPlugin['Discord-Logs']['Table-Name']} (CaseID INT, Punishment VARCHAR(255), UUID VARCHAR(255), Embed JSON, Date DATE)`)
                consoleLogger.createLog('INFO', 'Connected to Discord Logs table.')
            }
            if (logsPlugin['Minecraft-Logs']['Enabled'])
            {
                consoleLogger.createLog('INFO', 'Connected to Minecraft Logs table.')
            }
        }
        else //No Database Connection
            consoleLogger.createLog('WARN', 'Could not connect to Database. Logs will not be stored.')
    })

    sql.on('error', function() 
    {
        consoleLogger.createLog('ERROR', 'Database connection was lost. Logs will not be stored.')
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