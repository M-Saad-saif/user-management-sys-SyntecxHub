const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// desc ->    Login user
// route  ->  POST /api/auth/login
// access  ->  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("employee");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          employee: user.employee,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Get current user
// route  ->   GET /api/auth/me
// access  ->  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: "employee",
        populate: { path: "department" },
      });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// desc ->    Change password
// route  ->  PUT /api/auth/change-password
// access  -> Private
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isPasswordMatch = await user.comparePassword(oldPassword);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// desc ->     Update profile
// route  ->   PUT /api/auth/update-profile
// access  ->  Private
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, address } = req.body;

    // Get user's employee record
    const employee = await Employee.findById(req.user.employee);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee record not found",
      });
    }

    // Update allowed fields only
    if (fullName) employee.fullName = fullName;
    if (phone) employee.phone = phone;
    if (address) employee.address = address;

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
  changePassword,
  updateProfile,
};
