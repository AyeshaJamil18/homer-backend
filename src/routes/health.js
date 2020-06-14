"use strict";

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health
 */

/**
 * @swagger
 *
 * /health/ping:
 *   get:
 *     description: Check if api is up and running. Returns pong
 *     tags: [Health]
 *     security:
 *     produces:
 *       - application/text
 *     responses:
 *       200:
 *         description: Api is up
 */
router.get('/ping', (req, res) => res.send('pong'));

module.exports = router;
