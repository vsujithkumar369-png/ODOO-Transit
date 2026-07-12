const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const jwtUtil = require('../utils/jwt');

const registerUser = async ({ name, email, phone, password, role }) => {
  // Check email uniqueness
  const emailExists = await userRepository.findByEmail(email);
  if (emailExists) {
    const error = new Error('Email is already registered');
    error.statusCode = 400;
    throw error;
  }

  // Check phone uniqueness
  const phoneExists = await userRepository.findByPhone(phone);
  if (phoneExists) {
    const error = new Error('Phone number is already registered');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Save user
  const newUser = await userRepository.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role
  });

  return newUser;
};

const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwtUtil.generateToken({
    id: user.id,
    name: user.name,
    role: user.role
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  };
};

const getUserProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
