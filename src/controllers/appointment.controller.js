const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { createAppointmentSchema } = require('../validators/appointment.validator');

const isSameDate = (dateA, dateB) => {
  return (
    dateA.getUTCFullYear() === dateB.getUTCFullYear() &&
    dateA.getUTCMonth() === dateB.getUTCMonth() &&
    dateA.getUTCDate() === dateB.getUTCDate()
  );
};

const getDayName = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
};

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Patient
const createAppointment = async (req, res) => {
  try {
    const { error } = createAppointmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { doctor: doctorId, appointmentDate, timeSlot, notes } = req.body;
    const date = new Date(appointmentDate);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid appointment date' });
    }

    const doctor = await Doctor.findOne({ _id: doctorId, isActive: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or inactive' });
    }

    const appointmentDay = getDayName(date);
    if (doctor.availableDays.length > 0 && !doctor.availableDays.includes(appointmentDay)) {
      return res.status(400).json({ message: `Doctor is not available on ${appointmentDay}` });
    }

    if (doctor.availableSlots.length > 0 && !doctor.availableSlots.includes(timeSlot)) {
      return res.status(400).json({ message: 'Selected time slot is not available for this doctor' });
    }

    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    try {
      const appointment = await Appointment.create({
        patient: req.user._id,
        doctor: doctorId,
        appointmentDate: utcDate,
        timeSlot,
        notes,
      });

      return res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (dbError) {
      if (dbError.code === 11000) {
        return res.status(409).json({ message: 'The selected appointment slot is already booked' });
      }
      throw dbError;
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error while booking appointment' });
  }
};

// @desc    Get logged-in patient's appointment history
// @route   GET /api/appointments/my
// @access  Patient
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization bio')
      .sort({ appointmentDate: -1, timeSlot: 1 });

    res.json({ count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching your appointments' });
  }
};

// @desc    Get all appointments (admin)
// @route   GET /api/appointments
// @access  Admin
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name specialization')
      .populate('patient', 'name email')
      .sort({ appointmentDate: -1, timeSlot: 1 });

    res.json({ count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all appointments' });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
};