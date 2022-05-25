const { body, validationResult } = require('express-validator');

const createValidator = [
  body('name').notEmpty().withMessage('name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('email cannot be empty')
    .isEmail()
    .withMessage('must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters'),
  body('role').notEmpty().withMessage('role cannot be empty'),
];

const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('email cannot be empty')
    .isEmail()
    .withMessage('must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters'),
];

const createRepairsValidation = [
  body('date')
    .notEmpty()
    .withMessage('date cannot be empty')
    .isDate()
    .withMessage('date is not a valid date'),
  body('userId').notEmpty().withMessage('please enter the technician id '),
];

const ckeckValidator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);
    const errorMsg = messages.join('. ');
    return res.status(400).json({
      status: 'error',
      message: errorMsg,
    });
  }

  next();
};

module.exports = {
  loginValidator,
  createValidator,
  ckeckValidator,
  createRepairsValidation,
};
