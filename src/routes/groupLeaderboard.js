"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const groupLeaderboardController = require('../controllers/groupLeaderboard');

/**
 * @swagger
 * tags:
 *   name: GroupLeaderboard
 *   description: GroupLeaderboard
 */

/**
 * @swagger
 *
 * /groupLeaderboard:
 *   get:
 *     description: Returns groupLeaderboard data
 *     tags: [GroupLeaderboard]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found groupLeaderboard data
 */
router.get('/', middleware.checkAuthentication, groupLeaderboardController.apiGetOwnData);

module.exports = router;
