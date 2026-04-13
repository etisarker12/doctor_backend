const express = require('express');
const { register, login, getProfile, updateProfile } = require('../controllers/auth.controller');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, restrictTo('patient'), getProfile);
router.patch('/profile', protect, restrictTo('patient'), updateProfile);

module.exports = router;