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
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name specialization bio')
      .populate('patient', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'admin' && appointment.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching appointment' });
  }
};

const isAppointmentInFuture = (appointmentDate) => {
  const todayUtc = new Date(Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate()
  ));
  return appointmentDate >= todayUtc;
};

const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot confirm a cancelled appointment' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Appointment is already completed' });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    res.json({ message: 'Appointment confirmed', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error confirming appointment' });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isOwner = appointment.patient.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    if (!isAppointmentInFuture(appointment.appointmentDate)) {
      return res.status(400).json({ message: 'Cannot cancel an appointment after the appointment date has passed' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error cancelling appointment' });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot complete a cancelled appointment' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Appointment is already completed' });
    }

    appointment.status = 'completed';
    await appointment.save();

    res.json({ message: 'Appointment marked as completed', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error completing appointment' });
  }
};

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
  getAppointmentById,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
};