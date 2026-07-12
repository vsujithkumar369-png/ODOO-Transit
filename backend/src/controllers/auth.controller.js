const response = require('../utils/response');

const register = async (req, res, next) => {
  try {
    return response.success(res, 'Registration status checked successfully', null, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    return response.success(res, 'Login status checked successfully', null);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return response.success(res, 'User profile request processed', req.user || null);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    return response.success(res, 'Logout request processed');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
