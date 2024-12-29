const express = require('express')
const router = express.Router();
const { Writable } = require('stream');
const { getLog_DBConnection } = require('../../models/dbconnect/db_connect')
const { parseLogMessage } = require('../Log/parseLogMessage')


const winston = require('winston');
require('winston-daily-rotate-file');
const logDir = `${__dirname}/system_log`

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
}

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: ' YYYY-MM-DD HH:MM:SS ||' }),
    winston.format.colorize({ all: false }),
    winston.format.printf(
        //(error) => `${error.timestamp} ▶ ${error.message}`
        (error) => `${error.message}`
    )
)

class DBstream extends Writable {
    constructor(options) {
        super(options);
        this.connectionPromise = getLog_DBConnection();
    }

    _write(chunk, encoding, callback) {
        this.connectionPromise.then(connection => {
            const site = '환경안전';
            const log = chunk.toString();
            const query_value_error_log = parseLogMessage(log)
            const query= `
            INSERT INTO 
            error_log (site, time, query, input_value, err_log) 
            VALUES (:site, :time, :query, :input_value, :err_log)`;

            connection.execute(
                query, 
                [site, new Date(), 
                    query_value_error_log.query, query_value_error_log.Data, query_value_error_log.error], 
                {autoCommit: true}
            ).then(result => {
                // console.log(result);
                callback();
            }).catch(err => {
                callback(err);
            });
        });
    }
}

const dbStream = new DBstream();

const logger = winston.createLogger({
    format,
    level: level(),
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,  // 로그 디렉토리 변경
            filename: `%DATE%.log`,    // 파일 이름 변경
            zippedArchive: true,
            maxFiles: 30,
        }),
        new winston.transports.Stream({
            stream: dbStream
        }),
        new winston.transports.Console({
            handleExceptions: true,
        })
    ]
});


module.exports = logger;