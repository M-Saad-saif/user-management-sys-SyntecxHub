const Salary = require("../models/Salary");
const Employee = require("../models/Employee");

// desc ->     Get salary history for employee
// route  ->   GET /api/salary/employee/:employeeId
// access  ->  Private/Admin
const getSalaryHistory = async (req, res, next) => {
  try {
    const salaries = await Salary.find({ employee: req.params.employeeId })
      .populate("employee", "fullName email")
      .populate("updatedBy", "email")
      .sort({ effectiveFrom: -1 });

    res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Get my salary history (Employee)
// route  ->   GET /api/salary/my-salary
// access  ->  Private/Employee
const getMySalaryHistory = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee record not found",
      });
    }

    const salaries = await Salary.find({ employee: employee._id }).sort({
      effectiveFrom: -1,
    });

    res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries,
      currentSalary: employee.salary,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Update employee salary
// route  ->   POST /api/salary/:employeeId
// access  ->  Private/Admin
const updateSalary = async (req, res, next) => {
  try {
    const { amount, effectiveFrom, remarks } = req.body;

    const employee = await Employee.findById(req.params.employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Create salary history record
    const salary = await Salary.create({
      employee: employee._id,
      amount,
      effectiveFrom: effectiveFrom || Date.now(),
      remarks,
      updatedBy: req.user._id,
    });

    // Update employee's current salary
    employee.salary = amount;
    await employee.save();

    const populatedSalary = await Salary.findById(salary._id)
      .populate("employee", "fullName email")
      .populate("updatedBy", "email");

    res.status(201).json({
      success: true,
      message: "Salary updated successfully",
      data: populatedSalary,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Get all salary records
// route  ->   GET /api/salary
// access  ->  Private/Admin
const getAllSalaries = async (req, res, next) => {
  try {
    const salaries = await Salary.find()
      .populate({
        path: "employee",
        select: "fullName email salary",
        populate: { path: "department", select: "name" },
      })
      .populate("updatedBy", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalaryHistory,
  getMySalaryHistory,
  updateSalary,
  getAllSalaries,
};
