import Joi from 'joi';
import { errorMsg } from '../utils/response';

// eslint-disable-next-line consistent-return
const validateBody = (schema) => (req, res, next) => {
  const result = schema.validate(req.body);

  if (result.error) {
    const error = result.error.details[0].message;
    return errorMsg(res, 400, error);
  }

  if (!req.value) { req.value = {}; }
  req.value.body = result.value;
  next();
};

const schemas = {
  registerUser: Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'uk', 'co'] } })
      .min(5)
      .max(100)
      .required()
      .messages({
        'string.empty': 'email cannot be an empty field',
        'string.email': 'please enter a valid email',
        'any.required': 'email is required',
      }),
    password: Joi.string()
      .min(5)
      .max(20)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required()
      .messages({
        'any.required': 'password is required',
        'string.pattern.base': 'password must contain only alphanumeric characters',
        'string.empty': 'password cannot be an empty field',
        'string.min': 'password should have a minimum length of 5',
      }),
  }),

  loginUser: Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'uk', 'co'] } })
      .required()
      .messages({
        'string.empty': 'email cannot be an empty field',
        'string.email': 'please enter a valid email',
        'any.required': 'email is required',
      }),
    password: Joi.string()
      .min(5)
      .max(20)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required()
      .messages({
        'any.required': 'password is required',
        'string.pattern.base': 'password must contain only alphanumeric characters',
        'string.empty': 'password cannot be an empty field',
        'string.min': 'password should have a minimum length of 5',
      }),
  }),

  addMoney: Joi.object().keys({
    amount: Joi.number()
      .required()
      .messages({
        'number.empty': 'amount cannot be empty',
        'any.required': 'amount is required',
      }),
  }),

  sendMoney: Joi.object().keys({
    amount: Joi.number()
      .required()
      .messages({
        'number.empty': 'amount cannot be empty',
        'any.required': 'amount is required',
      }),
    receiver_account_id: Joi.number()
      .required()
      .messages({
        'number.empty': 'receiver_account_id cannot be empty',
        'any.required': 'receiver_account_id is required',
      }),
    narration: Joi.string(),
  }),
};

export {
  validateBody,
  schemas,
};
