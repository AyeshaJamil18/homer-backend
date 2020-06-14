"use strict";

const express = require('express');
const router = express.Router();

const statsController = require('../controllers/stats');

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Statics
 */

/**
 * @swagger
 *
 * /stats/totalDocumentCount:
 *   get:
 *     description: Returns count of all documents
 *     tags: [Stats]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Counting successful and returning result
 */
router.get('/totalDocumentCount', statsController.apiGetTotalDocumentCount);

/**
 * @swagger
 *
 * /stats/totalPublicDocumentCount:
 *   get:
 *     description: Returns count of documents which contain private = false
 *     tags: [Stats]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Counting successful and returning result
 */
router.get('/totalPublicDocumentCount', statsController.apiGetTotalPublicDocumentCount);

/**
 * @swagger
 *
 * /stats/totalUserCount:
 *   get:
 *     description: Returns count of all users
 *     tags: [Stats]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Counting successful and returning result
 */
router.get('/totalUserCount', statsController.apiGetTotalUserCount);

module.exports = router;
