const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Employee is required"],
  },
  leaveType: {
    type: String,
    required: [true, "Leave type is required"],
    enum: [
      "Sick Leave",
      "Casual Leave",
      "Annual Leave",
      "Maternity Leave",
      "Paternity Leave",
      "Emergency Leave",
    ],
  },
  fromDate: {
    type: Date,
    required: [true, "From date is required"],
  },
  toDate: {
    type: Date,
    required: [true, "To date is required"],
  },
  cause: {
    type: String,
    required: [true, "Cause is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Validation: toDate must be after fromDate
leaveSchema.pre("save", function (next) {
  if (this.toDate <= this.fromDate) {
    next(new Error("To date must be after from date"));
  }
  next();
});

module.exports = mongoose.model("Leave", leaveSchema);
