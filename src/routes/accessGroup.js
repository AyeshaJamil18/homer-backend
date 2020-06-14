"use strict";

"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const accessGroupController = require('../controllers/accessGroup');

/**
 * @swagger
 * tags:
 *   name: AccessGroup
 *   description: AccessGroup
 */

/**
 * @swagger
 *
 * /accessgroup/{documentId}:
 *   get:
 *     description: Get the accessGroups for a specific document
 *     tags: [AccessGroup]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: documentId
 *         description: The id for which the accessgroups should be retrieved
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: Found accessGroups
 *       404:
 *         description: No accessGroups for this documentId found
 */
router.get('/:documentId', middleware.checkAuthentication, accessGroupController.apiGetByDocumentId);

/**
 * @swagger
 *
 * /accessgroup:
 *   post:
 *     description: Post a new accessGroup for a document
 *     tags: [AccessGroup]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentId
 *               - modifier
 *             optional:
 *               - userIds
 *             properties:
 *               title:
 *                 type: string
 *               modifier:
 *                 type: string
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example: {
 *               "documentId": "123",
 *               "modifier": "r",
 *               "userIds": "123456789"
 *             }
 *     responses:
 *       201:
 *         description: Created a new accessGroup
 *       409:
 *         description: AccessGroup exists already
 */
router.post('/', middleware.checkAuthentication, accessGroupController.apiCreate);

/**
 * @swagger
 *
 * /accessgroup/{documentId}/{modifier}/users:
 *   put:
 *     description: Put a new user in an accessGroup
 *     tags: [AccessGroup]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: documentId
 *         description: The documentId to select the accessGroup
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *       - in: path
 *         name: modifier
 *         description: The modifier for the accessGroup
 *         required: true
 *         schema:
 *           type: string
 *           example: r
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example: {
 *               "userIds": "123456789"
 *             }
 *     responses:
 *       201:
 *         description: Added user to accessGroup
 *       404:
 *         description: Not accessGroup found for the combination of documentId and modifier
 */
router.put('/:documentId/:modifier/users', middleware.checkAuthentication, accessGroupController.apiAddUsersById);

/**
 * @swagger
 *
 * /accessgroup/{documentId}/{modifier}/users:
 *   delete:
 *     description: Delete a user from a accessGroup
 *     tags: [AccessGroup]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: documentId
 *         description: The documentId to select the accessGroup
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *       - in: path
 *         name: modifier
 *         description: The modifier for the accessGroup
 *         required: true
 *         schema:
 *           type: string
 *           example: r
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example: {
 *               "userIds": "123456789"
 *             }
 *     responses:
 *       200:
 *         description: Removed user from accessGroup
 *       404:
 *         description: Not accessGroup found for the combination of documentId and modifier
 */
router.delete('/:documentId/:modifier/users', middleware.checkAuthentication, accessGroupController.apiRemoveUsersById);

/**
 * @swagger
 *
 * /accessgroup/{documentId}/{modifier}:
 *   delete:
 *     description: Delete an accessGroup
 *     tags: [AccessGroup]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: documentId
 *         description: The documentId to select the accessGroup
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *       - in: path
 *         name: modifier
 *         description: The modifier for the accessGroup
 *         required: true
 *         schema:
 *           type: string
 *           example: r
 *     responses:
 *       200:
 *         description: Removed accessGroup
 *       404:
 *         description: Not accessGroup found for the combination of documentId and modifier
 */
router.delete('/:documentId/:modifier', middleware.checkAuthentication, accessGroupController.apiDeleteAccessGroup);

module.exports = router;
