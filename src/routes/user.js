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
//router.get('/:userId', middleware.checkAuthentication, userController.apiResolveIdToName);

// TODO: rename endpoint to "findUserByUsername" and update frontend accordingly
router.get('/getUserByUsername/:username', middleware.checkAuthentication, userController.apiFindUserByUsername);

router.get('/checkEmail/:userEmail', middleware.checkAuthentication, userController.apiCheckUserEmail);

router.get('/search/:match', middleware.checkAuthentication, userController.searchUser);

/**
 * @swagger
 *
 * /user/addFriend:
 *   POST:
 *     description: Adds another user to your friend list and adds yourself to the friend list of this user
 *     tags: [User]
 *     security:
 *     - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: username
 *         description: The username of the friend you want to add
 *         required: true
 *         schema:
 *           type: string
 *           example: user123
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: The specified user wasn't found
 */
router.post('/addFriend', middleware.checkAuthentication, userController.addFriend);

router.post('/removeFriend', middleware.checkAuthentication, userController.removeFriend);

router.get('/groups', middleware.checkAuthentication, userController.groups);

router.get('/friends', middleware.checkAuthentication, userController.friends);

module.exports = router;
