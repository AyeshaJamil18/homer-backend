"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const recordController = require('../controllers/record');

/**
 * @swagger
 * tags:
 *   name: Record
 *   description: Record
 */

/**
 * @swagger
 *
 * /record:
 *   get:
 *     description: Returns record data of current record
 *     tags: [Record]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found record data
 */
router.get('/', middleware.checkAuthentication, recordController.apiGetOwnData);

module.exports = router;
