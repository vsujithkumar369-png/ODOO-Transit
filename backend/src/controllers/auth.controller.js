const authService = require('../services/auth.service');
const response = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    return response.success(res, 'User registered successfully', user, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const session = await authService.loginUser(req.body);
    return response.success(res, 'User logged in successfully', session);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    return response.success(res, 'User profile fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    return response.success(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateUserProfile(req.user.id, req.body);
    return response.success(res, 'User profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  updateProfile
};
