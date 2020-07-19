"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const playlistController = require('../controllers/playlist');

/**
 * @swagger
 * tags:
 *   name: Playlist
 *   description: Playlist
 */

/**
 * @swagger
 *
 * /playlist:
 *   get:
 *     description: Returns playlist data
 *     tags: [Playlist]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found playlist data
 */
router.get('/', middleware.checkAuthentication, playlistController.apiGetOwnData);
router.get('/GetPlaylist', middleware.checkAuthentication, playlistController.GetPlaylist);
router.post('/AddToPlaylist', playlistController.AddVideoToPlaylist);

module.exports = router;
