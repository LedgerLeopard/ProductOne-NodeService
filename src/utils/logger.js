const log4js = require('log4js');

log4js.configure({
    appenders: {
        file: {
            type: 'dateFile',
            filename: './logs/nodeservice',
            pattern: '.yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            layout: {
                type: 'pattern',
                pattern: '%d %p %m',
            },
        },
    },
    categories: {
        default: {
            appenders: ['file'],
            level: 'debug',
        },
    },
});
const logger = log4js.getLogger();

module.exports = logger;
