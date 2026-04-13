const express = require('express');
const { getAllUsers, deactivateUser, getAppointmentOverview } = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/deactivate', deactivateUser);
router.get('/appointments/overview', getAppointmentOverview);

module.exports = router;