const log4js = require('log4js');
const log4jsExtend = require('log4js-extend');
const { BRANCH, SHORT } = require('../config');

const layout = {
    type: 'pattern',
    pattern: '%d %p %m',
};

log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout,
        },
        file: {
            type: 'dateFile',
            filename: `${__dirname}/../logs/nodeservice`,
            pattern: `.yyyy-MM-dd-${BRANCH}-${SHORT}.log`,
            alwaysIncludePattern: true,
            layout,
        },
    },
    categories: {
        default: {
            appenders: ['out', 'file'],
            level: 'debug',
        },
    },
});

log4jsExtend(log4js, {
    path: __dirname,
    format: 'at @name (@file:@line:@column)',
});

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
