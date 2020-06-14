const config = require('./config')['logger'];
const winston = require('winston');
const uuidv4 = require('uuid/v4');


const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.json(),
    defaultMeta: {app: 'studyhub-backend'},
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'http.log', level: 'http'}),
        new winston.transports.File({filename: 'combined.log'}),
        new winston.transports.Console({format: winston.format.simple()})
    ]
});

logger.getContextLogger = (context) => {
    const WinstonContext = require('winston-context');
    const newLogger = new WinstonContext(logger, '', {context: context});

    newLogger.logRestCall = (req, res, next) => {
        req.uuid = uuidv4();
        newLogger.httpWithUuid(req, {method: req.method, url: req.originalUrl});

        next();
    };

    newLogger.wrapMessageWithUuid = (req, msg) => {
        return JSON.stringify({uuid: req.uuid, message: msg});
    };

    // recreate logging methods with req context for uuid
    newLogger.debugWithUuid = (req, msg) => {
        newLogger.debug(newLogger.wrapMessageWithUuid(req, msg));
    };

    newLogger.httpWithUuid = (req, msg) => {
        newLogger.http(newLogger.wrapMessageWithUuid(req, msg));
    };

    newLogger.infoWithUuid = (req, msg) => {
        newLogger.info(newLogger.wrapMessageWithUuid(req, msg));
    };

    newLogger.errorWithUuid = (req, msg) => {
        newLogger.error(newLogger.wrapMessageWithUuid(req, msg));
    };

    return newLogger;
};

module.exports = logger.getContextLogger;