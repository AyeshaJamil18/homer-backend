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

router.post('/saveVideo', middleware.checkAuthentication, videoController.saveVideo);

router.get('/videoOfDay', middleware.checkAuthentication, videoController.getVideoOfDay);

router.get('/video/:tag', middleware.checkAuthentication, videoController.getVideoByTag);

module.exports = router;
