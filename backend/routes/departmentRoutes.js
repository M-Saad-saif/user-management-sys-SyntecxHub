const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const {
  departmentValidation,
  idValidation,
  validate
} = require('../utils/validation');

// Protect all routes
router.use(protect);

router.get('/', getAllDepartments);
router.get('/:id', idValidation, validate, getDepartment);

router.post('/', restrictTo('admin'), departmentValidation, validate, createDepartment);
router.put('/:id', restrictTo('admin'), idValidation, departmentValidation, validate, updateDepartment);
router.delete('/:id', restrictTo('admin'), idValidation, validate, deleteDepartment);

module.exports = router;