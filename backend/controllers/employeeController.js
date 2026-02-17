const Employee = require("../models/Employee");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// desc ->    Get all employees
// route  ->  GET /api/employees
// access  -> Private/Admin
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find()
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->    Get single employee
// route  ->  GET /api/employees/:id
// access  -> Private
const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("department")
      .populate("user", "-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Create new employee
// route  ->   POST /api/employees
// access  ->  Private/Admin
const createEmployee = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      age,
      gender,
      phone,
      address,
      department,
      salary,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create employee
    const employee = await Employee.create({
      fullName,
      email,
      age,
      gender,
      phone,
      address,
      department,
      salary,
    });

    let user;
    try {
      // Create user account
      user = await User.create({
        email,
        password: password || "123456", // Default password
        role: "employee",
        employee: employee._id,
      });
    } catch (createUserError) {
      await Employee.findByIdAndDelete(employee._id);
      throw createUserError;
    }

    // Link user to employee
    employee.user = user._id;
    await employee.save();

    const populatedEmployee = await Employee.findById(employee._id).populate(
      "department",
      "name",
    );

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: populatedEmployee,
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// desc ->     Update employee
// route  ->   PUT /api/employees/:id
// access  ->  Private/Admin
const updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Update employee
    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("department", "name");

    // Update user email if changed
    const previousEmail = employee.email;
    if (req.body.email && req.body.email !== previousEmail) {
      await User.findByIdAndUpdate(employee.user, { email: req.body.email });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// desc ->     Delete employee
// route  ->   DELETE /api/employees/:id
// access  ->  Private/Admin
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

   
    // Delete associated user account
    if (employee.user) {
      await User.findByIdAndDelete(employee.user);
    }

    // Delete employee
    await Employee.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// desc ->    Get employees by department
// route  ->  GET /api/employees/department/:departmentId
// access  -> Private/Admin
const getEmployeesByDepartment = async (req, res, next) => {
  try {
    const employees = await Employee.find({
      department: req.params.departmentId,
    })
      .populate("department", "name")
      .sort({ fullName: 1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
};
