const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getEmployeeDashboard
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// Protect all routes
router.use(protect);

router.get('/admin', restrictTo('admin'), getAdminDashboard);
router.get('/employee', restrictTo('employee'), getEmployeeDashboard);

module.exports = router;