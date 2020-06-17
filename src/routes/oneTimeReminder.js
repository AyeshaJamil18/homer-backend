"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const oneTimeReminderController = require('../controllers/oneTimeReminder');

/**
 * @swagger
 * tags:
 *   name: OneTimeReminder
 *   description: OneTimeReminder
 */

/**
 * @swagger
 *
 * /oneTimeReminder:
 *   get:
 *     description: Returns oneTimeReminder data
 *     tags: [OneTimeReminder]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found oneTimeReminder data
 */
router.get('/', middleware.checkAuthentication, oneTimeReminderController.apiGetOwnData);

module.exports = router;
