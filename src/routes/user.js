"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const userController = require('../controllers/user');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User
 */

/**
 * @swagger
 *
 * /user:
 *   get:
 *     description: Returns user data of current user
 *     tags: [User]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found user data
 */
router.get('/', middleware.checkAuthentication, userController.apiGetOwnData);

/**
 * @swagger
 *
 * /user/{userId}:
 *   get:
 *     description: Resolves a userId to a username
 *     tags: [User]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: The id which identifies the user
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: Found document
 *       404:
 *         description: No document for this id found
 */
router.get('/:userId', middleware.checkAuthentication, userController.apiResolveIdToName);

// TODO: rename endpoint to "findUserByUsername" and update frontend accordingly
router.get('/getUserByUsername/:username', middleware.checkAuthentication, userController.apiFindUserByUsername);

router.get('/checkEmail/:userEmail', middleware.checkAuthentication, userController.apiCheckUserEmail);

router.put('/addFriend/:friendUsername', middleware.checkAuthentication, userController.apiAddFriend)

module.exports = router;
