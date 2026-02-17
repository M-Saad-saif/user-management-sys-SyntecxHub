const Department = require("../models/Department");
const Employee = require("../models/Employee");

// desc ->    Get all departments
// route  ->  GET /api/departments
// access  -> Private
const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });

    // Get employee count for each department
    const departmentsWithCount = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await Employee.countDocuments({
          department: dept._id,
        });
        return {
          ...dept.toObject(),
          totalEmployees: employeeCount,
        };
      }),
    );

    res.status(200).json({
      success: true,
      count: departmentsWithCount.length,
      data: departmentsWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Get single department
// route  ->   GET /api/departments/:id
// access  ->  Private
const getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Get employee count
    const employeeCount = await Employee.countDocuments({
      department: department._id,
    });

    res.status(200).json({
      success: true,
      data: {
        ...department.toObject(),
        totalEmployees: employeeCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Create department
// route  ->   POST /api/departments
// access  ->  Private/Admin
const createDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const department = await Department.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Update department
// route  ->   PUT /api/departments/:id
// access  ->  Private/Admin
const updateDepartment = async (req, res, next) => {
  try {
    let department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Delete department
// route  ->   DELETE /api/departments/:id
// access  ->  Private/Admin
const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Check if department has employees
    const employeeCount = await Employee.countDocuments({
      department: department._id,
    });

    if (employeeCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete department. ${employeeCount} employee(s) are assigned to this department.`,
      });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
