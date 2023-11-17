const { param, body, validationResult } = require('express-validator');

exports.validateCreateUser = [
  body('username')
    .isString()
    .isLength({ min: 5, max: 30 })
    .withMessage('O nome de usuário deve ter pelo menos 5 caracteres.'),
  body('password')
    .isLength({ min: 6, max: 60 })
    .withMessage('A senha deve ter pelo menos 6 caracteres.'),
  body('birthday')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('A data de nascimento deve estar no formato YYYY-MM-DD.'),
  body('phone_number')
    .isLength({ min: 8, max: 20 })
    .withMessage('O número de telefone deve estar no formato válido.'),
  body('name')
    .isString()
    .isLength({ max: 100 })
    .withMessage('O nome deve ter no máximo 100 caracteres.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateLogin = [
  body('username')
    .isString()
    .isLength({ min: 5, max: 30 })
    .withMessage('O nome de usuário deve ter pelo menos 6 caracteres.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('A senha deve ter pelo menos 8 caracteres.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateUpdateUser = [
  param('id')
    .isInt()
    .withMessage('ID de usuário inválido.'),
  body('username')
    .isString()
    .isLength({ min: 5, max: 30 })
    .withMessage('O nome de usuário deve ter pelo menos 6 caracteres.'),
  body('birthday')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('A data de nascimento deve estar no formato YYYY-MM-DD.'),
  body('phone_number')
    .isLength({ min: 8, max: 20 })
    .withMessage('O número de telefone deve estar no formato válido.'),
  body('name')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('O nome deve ter no máximo 100 caracteres.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
