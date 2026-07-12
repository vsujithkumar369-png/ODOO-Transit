const response = require('../utils/response');

/**
 * Middleware to restrict access based on user roles.
 * @param {...string} allowedRoles - The roles permitted to access the route.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return response.error(res, 'Access Denied: No role specified', 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return response.error(res, 'Access Denied: Insufficient permissions', 403);
    }

    next();
  };
};

module.exports = authorize;
