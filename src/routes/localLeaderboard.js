"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const localLeaderboardController = require('../controllers/localLeaderboard');

/**
 * @swagger
 * tags:
 *   name: LocalLeaderboard
 *   description: LocalLeaderboard
 */

/**
 * @swagger
 *
 * /localLeaderboard:
 *   get:
 *     description: Returns localLeaderboard data
 *     tags: [LocalLeaderboard]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found localLeaderboard data
 */
router.get('/', middleware.checkAuthentication, localLeaderboardController.apiGetOwnData);

module.exports = router;
