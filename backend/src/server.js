const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    app.listen(env.port, () => {
      logger.info(`TransitOps Server is running on port ${env.port} in ${env.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error('Failed to start TransitOps server:', error);
    process.exit(1);
  }
};

startServer();
