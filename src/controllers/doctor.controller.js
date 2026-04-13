const Doctor = require('../models/Doctor');
const { createDoctorSchema, updateDoctorSchema } = require('../validators/doctor.validator');

// @desc    Create a new doctor profile
// @route   POST /api/doctors
// @access  Admin
const createDoctor = async (req, res) => {
  try {
    const { error } = createDoctorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const doctor = await Doctor.create({
      name: req.body.name,
      specialization: req.body.specialization,
      bio: req.body.bio || '',
      availableDays: req.body.availableDays || [],
      availableSlots: req.body.availableSlots || [],
      isActive: typeof req.body.isActive === 'boolean' ? req.body.isActive : true,
    });

    res.status(201).json({
      message: 'Doctor created successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating doctor' });
  }
};

// @desc    Get list of all active doctors with optional search/filter
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { search, specialization } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }

    const doctors = await Doctor.find(filter).sort({ createdAt: -1 });
    res.json({ count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching doctors' });
  }
};

// @desc    Get single doctor profile by id
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, isActive: true });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching doctor' });
  }
};

// @desc    Update doctor profile
// @route   PATCH /api/doctors/:id
// @access  Admin
const updateDoctor = async (req, res) => {
  try {
    const { error } = updateDoctorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating doctor' });
  }
};

// @desc    Delete doctor profile
// @route   DELETE /api/doctors/:id
// @access  Admin
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting doctor' });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};