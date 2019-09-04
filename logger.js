const winston = require('winston');
const { format } = require('logform');

const { combine, timestamp, json } = format;

const transports = [
    new winston.transports.Console(),
];

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