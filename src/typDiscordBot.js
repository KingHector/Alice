const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_BANS', 'GUILD_MEMBERS']})
const fs = require('fs')
const mysql = require('mysql')

const config = require('./config.json')

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['commandHandler', 'eventHandler'].forEach(handler => 
    {
        require(`./handlers/${handler}`)(client, Discord)
    })   

var connection = mysql.createConnection 
({
    host: config['MySQL-Database']['Host'],
    user: config['MySQL-Database']['User'],
    password: config['MySQL-Database']['Password'],
    database: config['MySQL-Database']['Database']
})  

connection.connect(error => 
    {
        if (!error) 
        {
            console.log('Connected to Database.')

            const createTable = 'CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))'

            //connection.query('CREATE TABLE discordLogs (userID VARCHAR(255), address VARCHAR(255))', console.log)
        }
        else //No Database Connection
            console.warn('Could not connect to Database. Logs will not be stored.')
    })

client.login(config['Main-Settings']['Bot-Token'])