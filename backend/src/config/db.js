const { Pool } = require('pg');
const env = require('./env');

const password = env.db.password || '';
const maskedPassword = password.length > 2 
  ? password[0] + '*'.repeat(password.length - 2) + password[password.length - 1]
  : password;

console.log('--- Database Config Debug ---');
console.log('DB_HOST:', env.db.host);
console.log('DB_PORT:', env.db.port);
console.log('DB_USER:', env.db.user);
console.log('DB_PASSWORD:', maskedPassword);
console.log('DB_NAME:', env.db.database);
console.log('-----------------------------');

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
