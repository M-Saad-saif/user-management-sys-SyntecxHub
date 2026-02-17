const express = require('express');
const router = express.Router();
const {
  getAllLeaves,
  getMyLeaves,
  getLeavesByEmployee,
  applyLeave,
  updateLeaveStatus,
  deleteLeave
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const {
  leaveValidation,
  leaveStatusValidation,
  idValidation,
  validate
} = require('../utils/validation');

// Protect all routes
router.use(protect);

router.get('/', restrictTo('admin'), getAllLeaves);
router.get('/my-leaves', restrictTo('employee'), getMyLeaves);
router.get('/employee/:employeeId', restrictTo('admin'), idValidation, validate, getLeavesByEmployee);

router.post('/', restrictTo('employee'), leaveValidation, validate, applyLeave);

router.put(
  '/:id/status',
  restrictTo('admin'),
  idValidation,
  leaveStatusValidation,
  validate,
  updateLeaveStatus
);

router.delete('/:id', idValidation, validate, deleteLeave);

module.exports = router;