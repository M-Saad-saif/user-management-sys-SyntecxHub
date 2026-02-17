const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  changePassword,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  loginValidation,
  changePasswordValidation,
  validate
} = require('../utils/validation');

router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePasswordValidation, validate, changePassword);
router.put('/update-profile', protect, updateProfile);

module.exports = router;