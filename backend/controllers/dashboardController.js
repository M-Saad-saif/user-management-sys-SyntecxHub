const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Leave = require("../models/Leave");
const Salary = require("../models/Salary");

// desc ->    Get admin dashboard statistics
// route  ->  GET /api/dashboard/admin
// access  -> Private/Admin
const getAdminDashboard = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    // Total salary expense (sum of all employee salaries)
    const salaryExpenseResult = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);
    const totalSalaryExpense =
      salaryExpenseResult.length > 0 ? salaryExpenseResult[0].totalSalary : 0;

    // Leave statistics
    const totalPendingLeaves = await Leave.countDocuments({
      status: "Pending",
    });
    const totalApprovedLeaves = await Leave.countDocuments({
      status: "Approved",
    });
    const totalRejectedLeaves = await Leave.countDocuments({
      status: "Rejected",
    });

    // Recent employees
    const recentEmployees = await Employee.find()
      .populate("department", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // Department-wise employee count
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          totalSalary: { $sum: "$salary" },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $project: {
          departmentName: "$department.name",
          employeeCount: "$count",
          totalSalary: "$totalSalary",
        },
      },
      {
        $sort: { employeeCount: -1 },
      },
    ]);

    // Monthly statistics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Employee.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalEmployees,
          totalDepartments,
          totalSalaryExpense,
          totalPendingLeaves,
          totalApprovedLeaves,
          totalRejectedLeaves,
        },
        recentEmployees,
        departmentStats,
        monthlyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Get employee dashboard
// route  ->   GET /api/dashboard/employee
// access  ->  Private/Employee
const getEmployeeDashboard = async (req, res, next) => {
  try {
    // Get employee record
    const employee = await Employee.findOne({ user: req.user._id }).populate(
      "department",
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee record not found",
      });
    }

    // Get leave statistics
    const totalLeaves = await Leave.countDocuments({ employee: employee._id });
    const pendingLeaves = await Leave.countDocuments({
      employee: employee._id,
      status: "Pending",
    });
    const approvedLeaves = await Leave.countDocuments({
      employee: employee._id,
      status: "Approved",
    });
    const rejectedLeaves = await Leave.countDocuments({
      employee: employee._id,
      status: "Rejected",
    });

    // Get recent leaves
    const recentLeaves = await Leave.find({ employee: employee._id })
      .sort({ appliedAt: -1 })
      .limit(5);

    // Get salary history
    const salaryHistory = await Salary.find({ employee: employee._id })
      .sort({ effectiveFrom: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        employee,
        leaveStats: {
          totalLeaves,
          pendingLeaves,
          approvedLeaves,
          rejectedLeaves,
        },
        recentLeaves,
        salaryHistory,
        currentSalary: employee.salary,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getEmployeeDashboard,
};
