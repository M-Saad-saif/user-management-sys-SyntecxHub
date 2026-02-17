const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// desc ->    Get all leaves (Admin view)
// route  ->  GET /api/leaves
// access  -> Private/Admin
const getAllLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employee",
        select: "fullName email",
        populate: { path: "department", select: "name" },
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Get employee leaves
// route  ->   GET /api/leaves/my-leaves
// access  ->  Private/Employee
const getMyLeaves = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee record not found",
      });
    }

    const leaves = await Leave.find({ employee: employee._id }).sort({
      appliedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Get leaves by employee ID
// route  ->   GET /api/leaves/employee/:employeeId
// access  ->  Private/Admin
const getLeavesByEmployee = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ employee: req.params.employeeId })
      .populate("employee", "fullName email")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Apply for leave
// route  ->   POST /api/leaves
// access  ->  Private/Employee
const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, fromDate, toDate, cause } = req.body;

    // Get employee record
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee record not found",
      });
    }

    // Validate dates
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (to <= from) {
      return res.status(400).json({
        success: false,
        message: "To date must be after from date",
      });
    }

    // Create leave
    const leave = await Leave.create({
      employee: employee._id,
      leaveType,
      fromDate: from,
      toDate: to,
      cause,
    });

    const populatedLeave = await Leave.findById(leave._id).populate(
      "employee",
      "fullName email",
    );

    res.status(201).json({
      success: true,
      message: "Leave application submitted successfully",
      data: populatedLeave,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Update leave status
// route  ->   PUT /api/leaves/:id/status
// access  ->  Private/Admin
const updateLeaveStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    leave.status = status;
    leave.reviewedAt = Date.now();
    leave.reviewedBy = req.user._id;

    await leave.save();

    leave = await Leave.findById(leave._id).populate({
      path: "employee",
      select: "fullName email",
      populate: { path: "department", select: "name" },
    });

    res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully`,
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Delete leave
// route  ->   DELETE /api/leaves/:id
// access  ->  Private/Employee (own leaves only) or Admin
const deleteLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // Check authorization
    if (req.user.role !== "admin") {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee || leave.employee.toString() !== employee._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this leave",
        });
      }

      // Employee can only delete pending leaves
      if (leave.status !== "Pending") {
        return res.status(400).json({
          success: false,
          message: "Cannot delete leave that has been reviewed",
        });
      }
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Leave deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLeaves,
  getMyLeaves,
  getLeavesByEmployee,
  applyLeave,
  updateLeaveStatus,
  deleteLeave,
};
