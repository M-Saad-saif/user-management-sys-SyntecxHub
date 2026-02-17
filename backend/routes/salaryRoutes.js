const express = require('express');
const router = express.Router();
const {
  getSalaryHistory,
  getMySalaryHistory,
  updateSalary,
  getAllSalaries
} = require('../controllers/salaryController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const {
  salaryValidation,
  employeeIdValidation,
  validate
} = require('../utils/validation');

// Protect all routes
router.use(protect);

router.get('/', restrictTo('admin'), getAllSalaries);
router.get('/my-salary', restrictTo('employee'), getMySalaryHistory);
router.get('/employee/:employeeId', restrictTo('admin'), employeeIdValidation, validate, getSalaryHistory);

router.post(
  '/:employeeId',
  restrictTo('admin'),
  employeeIdValidation,
  salaryValidation,
  validate,
  updateSalary
);

module.exports = router;
