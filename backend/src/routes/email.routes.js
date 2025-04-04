// File: src/routes/email.routes.js
const express = require('express');
const {
  createScheduledEmail,
  getScheduledEmails,
  getEmailById,
} = require('../controllers/email.controller');

const router = express.Router();

router.post('/', createScheduledEmail);
router.get('/', getScheduledEmails);
router.get('/:id', getEmailById);

module.exports = router;