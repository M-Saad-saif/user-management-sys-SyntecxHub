const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Department description is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for total employees
departmentSchema.virtual('totalEmployees', {
  ref: 'Employee',
  localField: '_id',
  foreignField: 'department',
  count: true
});

departmentSchema.set('toJSON', { virtuals: true });
departmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Department', departmentSchema);