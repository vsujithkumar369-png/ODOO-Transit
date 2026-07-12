const logger = require('../utils/logger');
const response = require('../utils/response');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.url} - Error occurred:`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send detailed error stack only in development mode
  const errors = env.nodeEnv === 'development' ? { stack: err.stack } : null;

  return response.error(res, message, statusCode, errors);
};

module.exports = errorHandler;
