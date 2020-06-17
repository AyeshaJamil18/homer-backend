"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const groupController = require('../controllers/group');

/**
 * @swagger
 * tags:
 *   name: Group
 *   description: Group
 */

/**
 * @swagger
 *
 * /group:
 *   get:
 *     description: Returns group data
 *     tags: [Group]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found group data
 */
router.get('/', middleware.checkAuthentication, groupController.apiGetOwnData);

module.exports = router;
