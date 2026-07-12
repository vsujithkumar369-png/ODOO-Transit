const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: '24h'
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
