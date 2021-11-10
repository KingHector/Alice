const chalk = require('chalk')

module.exports.createLog = function createLog(logType, message)
{
    const date = new Date()
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    const logMessage = `[${time} ${logType}]: ${message}`
    
    switch(logType)
    {
        case 'INFO':
            console.log(chalk.blueBright(logMessage))
            break

        case 'WARN':
            console.log(chalk.yellow(logMessage))
            break
        
        case 'ERROR':
            console.log(chalk.red(logMessage))
            break
            
        default:
            console.log('UKNOWN ERROR MESSAGE')
    }
}