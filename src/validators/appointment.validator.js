const Joi = require('joi');

const createAppointmentSchema = Joi.object({
  doctor: Joi.string().trim().required().messages({
    'string.empty': 'Doctor ID is required',
    'any.required': 'Doctor ID is required'
  }),
  appointmentDate: Joi.date().iso().required().messages({
    'date.base': 'Appointment date must be a valid date',
    'date.format': 'Appointment date must be in ISO format',
    'any.required': 'Appointment date is required'
  }),
  timeSlot: Joi.string().trim().required().messages({
    'string.empty': 'Time slot is required',
    'any.required': 'Time slot is required'
  }),
  notes: Joi.string().trim().allow('').optional(),
});

module.exports = { createAppointmentSchema };