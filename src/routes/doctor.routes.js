const express = require('express');
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctor.controller');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', protect, restrictTo('admin'), createDoctor);
router.patch('/:id', protect, restrictTo('admin'), updateDoctor);
router.delete('/:id', protect, restrictTo('admin'), deleteDoctor);

module.exports = router;