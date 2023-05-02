const winston = require("winston");

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'ugram-service' },
    transports: [
        new winston.transports.Console(),
    ],
});

module.exports = logger;