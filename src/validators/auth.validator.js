const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('patient', 'admin').default('patient').messages({
    'any.only': 'Role must be either patient or admin'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(1).optional().messages({
    'string.empty': 'Name must not be empty'
  }),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'Password must be at least 6 characters long'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

module.exports = { registerSchema, loginSchema, updateProfileSchema };