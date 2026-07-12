const { validationResult } = require('express-validator');
const response = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.error(
      res,
      'Validation failed',
      400,
      errors.array({ onlyFirstError: true })
    );
  }
  next();
};

module.exports = validate;
