const dotenv = require('dotenv');
const path = require('path');

// Force override existing system environment variables with local .env configuration
dotenv.config({ override: true }); 
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

const requiredEnv = [
  'PORT',
  'DATABASE_PATH',
  'JWT_SECRET',
  'CORS_ORIGIN'
];

// Validate that all required environment variables are set
for (const envVar of requiredEnv) {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databasePath: process.env.DATABASE_PATH,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h'
  },
  corsOrigin: process.env.CORS_ORIGIN
};