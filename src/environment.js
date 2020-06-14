'use strict';

const devStr = 'development';

const testStr = 'test';

const env = process.env.NODE_ENV || devStr;

const getEnv = () => env;

const isDev = () => env === devStr;

const isTest = () => env === testStr;

const maskMsgIfNotDev = (msg) => isDev() ? msg : undefined;

module.exports = {
    getEnv,
    isDev,
    isTest,
    maskMsgIfNotDev
};
