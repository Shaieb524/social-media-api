import {createLogger, format, transports} from 'winston'
const { combine, timestamp, label, prettyPrint, printf } = format;

export default class CustomLogger {

    public static myFormat = printf(info => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
      });

    static logger = createLogger({
        level: 'info',
        format: combine(
            label({ label: 'right meow!' }),
            timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
            CustomLogger.myFormat
        ),

        transports: [
        new transports.File({ filename: 'logs/server.log'}),
        new transports.Console({ level: "debug" }),
        ]
    });
}