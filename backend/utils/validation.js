const { body, param, validationResult } = require("express-validator");

// Validation middleware to check results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth validations
exports.loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.changePasswordValidation = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

// Employee validations
exports.employeeValidation = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("age")
    .isInt({ min: 18, max: 65 })
    .withMessage("Age must be between 18 and 65"),
  body("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("department").isMongoId().withMessage("Invalid department ID"),
  body("salary")
    .isFloat({ min: 0 })
    .withMessage("Salary must be a positive number"),
];

exports.employeeUpdateValidation = [
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("age")
    .optional()
    .isInt({ min: 18, max: 65 })
    .withMessage("Age must be between 18 and 65"),
  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),
  body("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number cannot be empty"),
  body("address").optional().notEmpty().withMessage("Address cannot be empty"),
  body("department")
    .optional()
    .isMongoId()
    .withMessage("Invalid department ID"),
  body("salary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Salary must be a positive number"),
];

// Department validations
exports.departmentValidation = [
  body("name").trim().notEmpty().withMessage("Department name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
];

// Leave validations
exports.leaveValidation = [
  body("leaveType")
    .isIn([
      "Sick Leave",
      "Casual Leave",
      "Annual Leave",
      "Maternity Leave",
      "Paternity Leave",
      "Emergency Leave",
    ])
    .withMessage("Invalid leave type"),
  body("fromDate").isISO8601().withMessage("Invalid from date"),
  body("toDate").isISO8601().withMessage("Invalid to date"),
  body("cause").trim().notEmpty().withMessage("Cause is required"),
];

exports.leaveStatusValidation = [
  body("status")
    .isIn(["Approved", "Rejected"])
    .withMessage("Status must be Approved or Rejected"),
];

// Salary validations
exports.salaryValidation = [
  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Salary amount must be a positive number"),
  body("effectiveFrom")
    .optional()
    .isISO8601()
    .withMessage("Invalid effective date"),
  body("remarks").optional().trim(),
];

// ID validation
exports.idValidation = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];

exports.employeeIdValidation = [
  param("employeeId").isMongoId().withMessage("Invalid employee ID format"),
];

exports.departmentIdValidation = [
  param("departmentId")
    .isMongoId()
    .withMessage("Invalid department ID format"),
];
