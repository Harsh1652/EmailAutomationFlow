// File: src/services/agenda.js
const Agenda = require('agenda');
const nodemailer = require('nodemailer');
const Email = require('../models/email.model');

let agenda;

/**
 * Setup Agenda job scheduler
 */
const setupAgenda = async () => {
  // Create an instance of Agenda
  agenda = new Agenda({
    db: { address: process.env.MONGODB_URI, collection: 'jobs' },
    processEvery: '1 minute',
  });
  
  // Define the email sending job
  agenda.define('send email', async (job) => {
    const { emailId } = job.attrs.data;
    
    try {
      // Find the email in the database
      const email = await Email.findById(emailId);
      
      if (!email) {
        console.error(`Email with ID ${emailId} not found`);
        return;
      }
      
      // Only send if it's still in scheduled status
      if (email.status !== 'scheduled') {
        return;
      }
      
      // Create a transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      // Send the email
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email.to,
        subject: email.subject,
        html: email.body,
      });
      
      // Update email status
      email.status = 'sent';
      email.sentAt = new Date();
      await email.save();
      
      console.log(`Email sent successfully to ${email.to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Update email with error
      try {
        await Email.findByIdAndUpdate(emailId, {
          status: 'failed',
          error: error.message,
        });
      } catch (updateError) {
        console.error('Error updating email status:', updateError);
      }
    }
  });
  
  // Start the agenda scheduler
  await agenda.start();
  console.log('Agenda job scheduler started');
  
  return agenda;
};

/**
 * Schedule an email to be sent
 * @param {Object} emailData - Email data object
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.body - Email body (HTML)
 * @param {Date} emailData.scheduledFor - When to send the email
 * @param {string} emailData.createdBy - User ID who created the email
 * @returns {Promise<Object>} Scheduled email document
 */
const scheduleEmail = async (emailData) => {
  try {
    // Save email to database
    const email = await Email.create(emailData);
    
    // Schedule the job
    await agenda.schedule(email.scheduledFor, 'send email', { emailId: email._id });
    
    return email;
  } catch (error) {
    console.error('Error scheduling email:', error);
    throw error;
  }
};

module.exports = {
  setupAgenda,
  scheduleEmail,
};