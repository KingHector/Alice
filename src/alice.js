const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_BANS', 'GUILD_MEMBERS']})
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const mysql = require('mysql')
const fs = require('fs')

const config = require('../Configuration/config.json')  
const token = config['Main-Settings']['Bot-Token']

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
            console.log('Connected to Database.')
            sql.query(`CREATE TABLE IF NOT EXISTS ${config['Database']['DiscordLogs-Table-Name']} (CaseID INT, Punishment VARCHAR(255), UUID VARCHAR(255), Embed JSON, Date DATE)`) 
        }
        else //No Database Connection
            console.warn('Could not connect to Database. Logs will not be stored.')
    })

module.exports = { getsql: sql}            

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['commandHandler', 'eventHandler'].forEach(handler => 
    {
        require(`./handlers/${handler}`)(client, Discord)
    });    

client.login(token)