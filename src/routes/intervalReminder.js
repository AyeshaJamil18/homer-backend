"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const intervalReminderController = require('../controllers/intervalReminder');

/**
 * @swagger
 * tags:
 *   name: IntervalReminder
 *   description: IntervalReminder
 */

/**
 * @swagger
 *
 * /intervalReminder:
 *   get:
 *     description: Returns intervalReminder data
 *     tags: [IntervalReminder]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found intervalReminder data
 */
router.get('/', middleware.checkAuthentication, intervalReminderController.apiGetOwnData);

module.exports = router;
