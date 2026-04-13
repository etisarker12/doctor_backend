const User = require('../models/User');
const Appointment = require('../models/Appointment');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User account has been deactivated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error deactivating user' });
  }
};

const getAppointmentOverview = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.appointmentDate = {};
      if (startDate) {
        filter.appointmentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        filter.appointmentDate.$lte = end;
      }
    }

    const appointments = await Appointment.find(filter)
      .populate('doctor', 'name specialization')
      .populate('patient', 'name email')
      .sort({ appointmentDate: -1, timeSlot: 1 });

    const summary = {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      completed: appointments.filter(a => a.status === 'completed').length,
    };

    res.json({ summary, appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching appointment overview' });
  }
};

module.exports = {
  getAllUsers,
  deactivateUser,
  getAppointmentOverview,
};