"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const groupController = require('../controllers/group');

/**
 * @swagger
 * tags:
 *   name: Group
 *   description: Group
 */

/**
 * @swagger
 *
 * /group:
 *   get:
 *     description: Returns group data
 *     tags: [Group]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Found group data
 */
router.get('/:title', middleware.checkAuthentication, groupController.group);

router.post('/:title/invite/:user', middleware.checkAuthentication, groupController.invite);

router.post('/:title/join/', middleware.checkAuthentication, groupController.join);

router.post('/:title/leave/', middleware.checkAuthentication, groupController.leave)

router.post('/create/:title', middleware.checkAuthentication, groupController.create);

module.exports = router;
