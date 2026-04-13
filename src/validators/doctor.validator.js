const Joi = require('joi');

const createDoctorSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  specialization: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Specialization is required',
    'any.required': 'Specialization is required',
  }),
  bio: Joi.string().trim().allow('').optional(),
  availableDays: Joi.array().items(Joi.string().trim()).optional().default([]),
  availableSlots: Joi.array().items(Joi.string().trim()).optional().default([]),
  isActive: Joi.boolean().optional(),
});

const updateDoctorSchema = Joi.object({
  name: Joi.string().trim().min(1).optional().messages({
    'string.empty': 'Name must not be empty',
  }),
  specialization: Joi.string().trim().min(1).optional().messages({
    'string.empty': 'Specialization must not be empty',
  }),
  bio: Joi.string().trim().allow('').optional(),
  availableDays: Joi.array().items(Joi.string().trim()).optional(),
  availableSlots: Joi.array().items(Joi.string().trim()).optional(),
  isActive: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

module.exports = { createDoctorSchema, updateDoctorSchema };