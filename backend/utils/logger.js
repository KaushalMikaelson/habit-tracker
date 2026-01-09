/**
 * Simple logger utility that respects LOG_LEVEL environment variable
 * 
 * LOG_LEVEL options:
 * - 'none': No logs at all (cleanest output)
 * - 'error': Only errors
 * - 'info': Errors + important info (default)
 * - 'debug': Everything (most verbose)
 */

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const logger = {
    debug: (...args) => {
        if (LOG_LEVEL === 'debug') {
            console.log(...args);
        }
    },

    info: (...args) => {
        if (LOG_LEVEL === 'info' || LOG_LEVEL === 'debug') {
            console.log(...args);
        }
    },

    error: (...args) => {
        if (LOG_LEVEL !== 'none') {
            console.error(...args);
        }
    },

    // Always log (for critical startup messages)
    always: (...args) => {
        console.log(...args);
    }
};

module.exports = logger;
