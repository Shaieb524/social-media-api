const { createLogger, format, transports } = require('winston');
require('dotenv').config({path:'./.env'})
// Import mongodb
require('winston-mongodb');

module.exports = createLogger({

    transports:[
// File transport
        new transports.File({
            filename: 'logs/server.log',
            format:format.combine(
                format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )}),
        new transports.MongoDB({
            level: 'info',
            db: process.env.MONGO_URL,
            options: {
                useUnifiedTopology: true
            },
            collection: 'server_info_logs',
            format: format.combine(
                format.timestamp(),
                format.json())
        }),
        new transports.MongoDB({
            level: 'error',
            db: process.env.MONGO_URL,
            options: {
                useUnifiedTopology: true
            },
            collection: 'server_error_logs',
            format: format.combine(
                format.timestamp(),
                format.json())
        })
    ]
});


