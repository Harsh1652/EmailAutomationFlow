// email.model.js
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  to: {
    type: String,
    required: [true, 'Email recipient is required'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Email subject is required'],
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'Email body is required'],
  },
  scheduledFor: {
    type: Date,
    required: [true, 'Schedule time is required'],
  },
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'failed'],
    default: 'scheduled',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sentAt: {
    type: Date,
  },
  error: {
    type: String,
  },
});

const Email = mongoose.model('Email', emailSchema);
module.exports = Email;