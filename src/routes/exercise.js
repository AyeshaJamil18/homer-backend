"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const exerciseController = require('../controllers/exercise');

/**
 * @swagger
 * tags:
 *   name: Exercise
 *   description: Exercise
 */

/**
 * @swagger
 *
 * /exercise:
 *   get:
 *     description: Returns exercise data
 *     tags: [Exercise]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found exercise data
 */
router.get('/', middleware.checkAuthentication, exerciseController.apiGetOwnData);

module.exports = router;
