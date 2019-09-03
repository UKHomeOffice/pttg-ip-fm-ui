const winston = require('winston');
const { format } = require('logform');

const { combine, timestamp, json } = format;

const logFile = process.env.LOGFILE || 'pttg-ip-fm-ui.log';
const VERBOSE = process.env.VERBOSE === 'true';

const transports = [
    new winston.transports.File({ filename: logFile }),
];
if (VERBOSE) {
    transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ alias: '@timestamp' }),
        json(),
    ),
    transports,
    defaultMeta: {
        appName: 'pttg-ip-fm-ui',
    },
});

module.exports = logger;