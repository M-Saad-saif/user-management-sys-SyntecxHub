const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const upload = require('../utils/uploadConfig');
const {
  employeeValidation,
  employeeUpdateValidation,
  idValidation,
  validate
} = require('../utils/validation');

// Protect all routes
router.use(protect);

router.get('/', restrictTo('admin'), getAllEmployees);
router.get('/department/:departmentId', restrictTo('admin'), idValidation, validate, getEmployeesByDepartment);
router.get('/:id', idValidation, validate, getEmployee);

router.post(
  '/',
  restrictTo('admin'),
  upload.single('profilePicture'),
  employeeValidation,
  validate,
  createEmployee
);

router.put(
  '/:id',
  restrictTo('admin'),
  upload.single('profilePicture'),
  idValidation,
  employeeUpdateValidation,
  validate,
  updateEmployee
);

router.delete('/:id', restrictTo('admin'), idValidation, validate, deleteEmployee);

module.exports = router;