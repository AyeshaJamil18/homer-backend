"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const globalLeaderboardController = require('../controllers/globalLeaderboard');

/**
 * @swagger
 * tags:
 *   name: GlobalLeaderboard
 *   description: GlobalLeaderboard
 */

/**
 * @swagger
 *
 * /globalLeaderboard:
 *   get:
 *     description: Returns globalLeaderboard data
 *     tags: [GlobalLeaderboard]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found globalLeaderboard data
 */
router.get('/', middleware.checkAuthentication, globalLeaderboardController.apiGetOwnData);

module.exports = router;
