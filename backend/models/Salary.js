const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Employee is required"],
  },
  amount: {
    type: Number,
    required: [true, "Salary amount is required"],
    min: [0, "Salary must be positive"],
  },
  effectiveFrom: {
    type: Date,
    required: [true, "Effective from date is required"],
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  remarks: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Salary", salarySchema);
