// File: src/controllers/email.controller.js
const { scheduleEmail } = require('../services/agenda');
const Email = require('../models/email.model');
const { ApiError } = require('../utils/apiError');

/**
 * Schedule an email to be sent after 1 hour
 * @route POST /api/emails
 */
const createScheduledEmail = async (req, res, next) => {
  try {
    const { to, subject, body } = req.body;
    
    // Validate required fields
    if (!to || !subject || !body) {
      return next(new ApiError('Please provide email address, subject and body', 400));
    }
    
    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(to)) {
      return next(new ApiError('Please provide a valid email address', 400));
    }
    
    // Calculate time (1 hour from now)
    const scheduledFor = new Date(Date.now() + 60 * 60 * 1000);
    
    // Create and schedule the email
    const email = await scheduleEmail({
      to,
      subject,
      body,
      scheduledFor,
      createdBy: req.user._id,
    });
    
    res.status(201).json({
      success: true,
      data: {
        email: {
          id: email._id,
          to: email.to,
          subject: email.subject,
          scheduledFor: email.scheduledFor,
          status: email.status,
        }
      },
      message: 'Email scheduled successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all scheduled emails for the authenticated user
 * @route GET /api/emails
 */
const getScheduledEmails = async (req, res, next) => {
  try {
    const emails = await Email.find({ createdBy: req.user._id })
      .sort('-createdAt')
      .select('to subject status scheduledFor sentAt');
    
    res.status(200).json({
      success: true,
      count: emails.length,
      data: { emails },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific email by ID
 * @route GET /api/emails/:id
 */
const getEmailById = async (req, res, next) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    
    if (!email) {
      return next(new ApiError('Email not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: { email },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createScheduledEmail,
  getScheduledEmails,
  getEmailById,
};