const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Deactivate user account
// @route   PATCH /api/admin/users/:id/deactivate
// @access  Admin
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

module.exports = {
  getAllUsers,
  deactivateUser,
};