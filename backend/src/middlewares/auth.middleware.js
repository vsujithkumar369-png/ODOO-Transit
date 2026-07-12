const jwtUtil = require('../utils/jwt');
const response = require('../utils/response');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.error(res, 'Authorization token missing or malformed', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwtUtil.verifyToken(token);

  if (!decoded) {
    return response.error(res, 'Invalid or expired token', 401);
  }

  req.user = decoded;
  next();
};

module.exports = auth;
