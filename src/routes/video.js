"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const videoController = require('../controllers/video');

/**
 * @swagger
 * tags:
 *   name: Video
 *   description: Video
 */

/**
 * @swagger
 *
 * /video:
 *   get:
 *     description: Returns video data
 *     tags: [video]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found video data
 */
router.get('/', middleware.checkAuthentication, videoController.apiGetOwnData);

module.exports = router;
