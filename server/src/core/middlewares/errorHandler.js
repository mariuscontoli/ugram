const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error({
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode || 500,
        timestamp: new Date().toISOString(),
    });

    if (!res.status) {
        next();
    } else {
        res.status(statusCode).json({
            success: false,
            error: {
                message: message,
            }
        });
    }
}

module.exports = errorHandler;