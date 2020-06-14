"use strict";

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const documentController = require('../controllers/document');

/**
 * @swagger
 * tags:
 *   name: Doc
 *   description: Document
 */


/**
 * @swagger
 *
 * /sharedPublic:
 *   get:
 *     description: Retrieve all Public Documents in the System
 *     tags: [Doc]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: Found document list
 *       404:
 *         description: No public document found in the system
 *       500:
 *          description: Server error
 */
router.get('/sharedPublic', middleware.checkAuthentication, documentController.getPublicDocuments); // Retrieve all Public Documents in the System

router.get('/sharedWithMe', middleware.checkAuthentication, documentController.getDocumentsSharedWithMe); // Retrive all Documents shared with me

/**
 * @swagger
 *
 * /document:
 *   get:
 *     description: get all document titles of a userId
 *     tags: [Doc]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list all document titles
 *       500:
 *          description: Server error
 */
router.get('/', middleware.checkAuthentication, documentController.get);

/**
 * @swagger
 *
 * /document/{id}/download:
 *   get:
 *     description: Download a specific document as a csv file
 *     tags: [Doc]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The id which identifies the document
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: Found document
 *       404:
 *         description: No document for this id found
 *       500:
 *          description: Server error
 */
router.get('/:id/download', middleware.checkAuthentication, documentController.downloadDocumentById);

/**
 * @swagger
 *
 * /document/{id}:
 *   get:
 *     description: Get a specific document by id
 *     tags: [Doc]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The id which identifies the document
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: Found document
 *       404:
 *         description: No document for this id found
 *       500:
 *          description: Server error
 */
router.get('/:id', middleware.checkAuthentication, documentController.getById);

/**
 * @swagger
 *
 * /document:
 *   post:
 *     description: Post a new document
 *     tags: [Doc]
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
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               data:
 *                 type: [documentRows]
 *             example: {
 *               "title": "My test",
 *               "data": '{
	"title": "Drugs-2018",
	"originalFilename": "Test.csv",
	"data": [{
			"data": [
				"14-0273",
				"13-0102"
			],
			"title": "ID",
			"orderPosition": "0"
		},
		{
			"data": [
				"qf+wIy8bRfwCsFcIBviDeI8FnHuOTbOuim4GS0sl33Q=",
				"1T3oI46nuuFyhsvDHw9uz2gLmbypQlMSc9JV/Zs/uwM="
			],
			"title": "Date",
			"orderPosition": "1"
		}
	]
}'
 *             }
 *     responses:
 *       201:
 *         description: Created a new document
 *       500:
 *         description: Server error
 */
router.post('/', middleware.checkAuthentication, documentController.create); // Create a new document

router.put('/', middleware.checkAuthentication, documentController.updateDocument);

router.put('/:id/privacy', middleware.checkAuthentication, documentController.updateDocumentPrivacy);


module.exports = router;
