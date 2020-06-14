const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const kloudlessController = require('../controllers/kloudless');

/**
 * @swagger
 * tags:
 *   name: Kloudless
 *   description: Kloudless
 */

/**
 * @swagger
 *
 * /kloudless/{account}/{file}:
 *   get:
 *     description: Get a file from Kloudless
 *     tags: [Kloudless]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: account
 *         description: The id which identifies the user
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *       - in: path
 *         name: file
 *         description: The id which identifies the user
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: Found document and downloading
 *       404:
 *         description: No file found
 */
router.get('/:account/:file', middleware.checkAuthentication, kloudlessController.apiDownloadFile);

module.exports = router;