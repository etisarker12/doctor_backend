const express = require('express');
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
} = require('../controllers/appointment.controller');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, restrictTo('patient'), createAppointment);
router.get('/my', protect, restrictTo('patient'), getMyAppointments);
router.get('/', protect, restrictTo('admin'), getAllAppointments);

module.exports = router;