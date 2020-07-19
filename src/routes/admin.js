"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const adminController = require('../controllers/admin');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin
 */

/**
 * @swagger
 *
 * /admin:
 *   get:
 *     description: Returns admin data of current admin
 *     tags: [Admin]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found admin data
 */
router.get('/', middleware.checkAuthentication, adminController.apiGetOwnData);

/**
 * @swagger
 *
 * /admin/{adminId}:
 *   get:
 *     description: Resolves an adminId to an adminUsername
 *     tags: [Admin]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: adminId
 *         description: The id which identifies the admin
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
router.get('/:userId', middleware.checkAuthentication, adminController.apiResolveIdToName);

router.get('/checkEmail/:adminEmail', middleware.checkAuthentication, adminController.apiCheckAdminEmail);


module.exports = router;


