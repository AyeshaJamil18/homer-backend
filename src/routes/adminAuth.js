"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const adminAuthController = require('../controllers/adminAuth');


/**
 * @swagger
 * tags:
 *   name: adminAuth
 *   description: Authentication
 */

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     description: Login to receive Bearer token
 *     tags: [adminAuth]
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example: {
 *               "email": "test@anInvalidEmailServer.com",
 *               "password": "@qZiF4DUcX"
 *             }
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: Email not found.
 */
router.post('/login', adminAuthController.login);

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     description: Register user. Returns bearer token
 *     tags: [Auth]
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - firstName
 *               - lastName
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *             example: {
 *               "username": "JohnIsCool",
 *               "email": "test@anInvalidEmailServer.com",
 *               "firstName": "John",
 *               "lastName": "Doe",
 *               "password": "@qZiF4DUcX"
 *             }
 *     responses:
 *       200:
 *         description: Registration successful
 *       409:
 *         description: Username or email already exists
 */
router.post('/register', adminAuthController.register);


router.get('/me', middleware.checkAuthentication, adminAuthController.me);

/**
 * @swagger
 *
 * /auth/logout:
 *   post:
 *     description: Check if logged in
 *     tags: [Auth]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Bad request. Token was not prefixed with Bearer.
 *           https://swagger.io/docs/specification/authentication/bearer-authentication/
 *       401:
 *         description: Unauthorized. Empty, wrong or malformed token
 */
router.get('/logout', middleware.checkAuthentication, adminAuthController.logout);

module.exports = router;
