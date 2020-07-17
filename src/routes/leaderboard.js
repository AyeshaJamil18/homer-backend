"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const leaderboardController = require('../controllers/leaderboard');

/**
 * @swagger
 * tags:
 *   name: Leaderboard
 *   description: Leaderboard
 */

/**
 * @swagger
 *
 * /leaderboard:
 *   get:
 *     description: Returns Leaderboard data
 *     tags: [Leaderboard]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found leaderboard data
 */
router.get('/', middleware.checkAuthentication, leaderboardController.apiGetOwnData);

router.get('/generateRanking/:leaderboard', middleware.checkAuthentication, leaderboardController.apiGenerateRanking);

module.exports = router;
