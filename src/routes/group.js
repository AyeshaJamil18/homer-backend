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

router.put('/:title/invite/:user', middleware.checkAuthentication, groupController.invite);

router.put('/:title/join/', middleware.checkAuthentication, groupController.join);

router.delete('/:title/leave/', middleware.checkAuthentication, groupController.leave)

router.post('/create/', middleware.checkAuthentication, groupController.create);

module.exports = router;
