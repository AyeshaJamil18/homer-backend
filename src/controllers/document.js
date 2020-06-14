"use strict";

const documentModel = require('../models/document');
const accessGroupModel = require('../models/accessGroup');

const userController = require('./user');
const accessGroupController = require('./accessGroup');

const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");

const notifier = require('../notifier');

const logger = require('../logger')("controller/document.js");

const {parseAsync} = require('json2csv');

const privacyEnum = Object.freeze({PUBLIC: 'public', PRIVATE: 'private', SHARED: 'shared'});


const create = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['title'], req, res)) {
        return;
    }

    // Add ownerId to document from middleware
    req.body["ownerId"] = req.userId;

    return documentModel.create(req.body)
        .then(document => {
            res.status(201).json({id: document._id});

            userController.getUserById(req.userId)
                .then(user => notifier.templates.documentCreated(user.firstName, document.title))
                .then(template => notifier.notifyUserWithTemplate(req.userId, template));
        })
        .catch(error => {
            logger.errorWithUuid(req, error.message);

            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        });
};

const updateDocumentQuery = (documentId, updateBody) => {
    let options = {new: true}; // to return updated document
    return documentModel.findByIdAndUpdate(
        documentId,
        {$set: updateBody},
        options);
};

const updateDocument = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['id', 'data'], req, res)) {
        return;
    }
    updateDocumentQuery(req.body.id, req.body)
        .then(result => {
            if (!result) {
                res.status(404).send();
            } else {
                res.status(200).json({doc: extractParamsFromDocument(result, ["id", "title"])});
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).send();
        })
};

const updateDocumentPrivacy = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['id'], req, res)) {
        return;
    }
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['private'], req, res)) {
        return;
    }

    updateDocumentQuery(req.params['id'], req.body)
        .then(result => {
            if (!result) {
                res.status(404).send();
            } else {
                res.status(200).json({doc: extractParamsFromDocument(result, ["id", "title", "private"])});
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).send();
        })
};

const getInternalDocumentById = (id, requesterId) => {
    logger.debug("Requested document with id " + id);

    if (!id || !requesterId) {
        return Promise.resolve(null);
    }

    return documentModel.findById(id)
        .then(doc => {
            if (doc) { // check if document exists
                logger.debug("Document with id " + id + " was retrieved");

                // check permissions
                return checkPermissionsForGetDoc(doc, requesterId)
                    .then(accessGranted => {
                        if (accessGranted) {
                            logger.debug("Access granted to document with id " + doc._id);
                            return Promise.resolve(doc);
                        } else {
                            logger.debug("Access denied to document with id " + doc._id);
                            return Promise.resolve(null);
                        }
                    });
            }

            // document does not exist
            logger.debug("Document with id " + id + " does not exist");
            return Promise.resolve(null);
        });
};

const checkPermissionsForGetDoc = (doc, requesterId) => {
    // check first if document is public (private false)
    if (!doc.private) {
        return Promise.resolve(true);
    }

    // check if the owner is asking
    if (doc.ownerId === requesterId) {
        return Promise.resolve(true);
    }

    // check if the requester is in the access group
    return accessGroupController.checkIfRequesterHasRightToReadDocument(doc._id, requesterId);
};

const getById = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['id'], req, res)) {
        return;
    }

    getInternalDocumentById(req.params["id"], req.userId)
        .then(doc => doc ? res.status(200).json(change_IDtoId(doc)) : res.status(404).send());
};


const get = (req, res) => {
    documentModel.find({'ownerId': req.userId})
        .then(docs => {
            let docsWithPrivacy = docs.map(doc => {
                if(doc.private) {
                    return accessGroupModel.find({documentId: doc._id})
                        .then(accessGroups => {
                            if (accessGroups.length > 0) {
                                return Promise.resolve(extractIDTitle(doc, privacyEnum.SHARED));
                            } else {
                                return Promise.resolve(extractIDTitle(doc, privacyEnum.PRIVATE));
                            }
                        })
                } else {
                    return extractIDTitle(doc, privacyEnum.PUBLIC);
                }
            });
            Promise.all(docsWithPrivacy).then(result => res.status(200).json({docs: result}));
        })
        .catch(error => {
            logger.debugWithUuid(req, "Error");

            res.status(404).json({
                error: "Error ",
                message: error.message
            })
        });
};

const downloadDocumentById = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['id'], req, res)) {
        return;
    }

    getInternalDocumentById(req.params["id"], req.userId)
        .then(doc => {
            if (!doc) {
                res.status(404).send();

                logger.debugWithUuid(req, "Could not find document with id: " + req.params["id"]);
                return;
            }

            const csvFields = doc.data.map(columnData => columnData.title);
            const fileName = doc.title.endsWith('.csv') ? doc.title : doc.title + ".csv";

            let csvJsonDataList = [];
            for (let i = 0; i < doc.data[0].data.length; i++) {
                let csvRowJsonData = doc.data.reduce((rowObject, item) => {
                    rowObject[item.title] = (item.data)[i];
                    return rowObject
                }, {});
                csvJsonDataList.push(csvRowJsonData);
            }

            const opts = {csvFields};

            parseAsync(csvJsonDataList, opts)
                .then(csv => {
                    res.setHeader('Content-disposition', 'attachment; filename=' + fileName );
                    res.set('Content-Type', 'text/csv');
                    res.status(200).json({csvData: csv, fileName: fileName});
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send();
                });

        })
        .catch(error => {
            logger.debugWithUuid(req, "Error" + error + "");

            res.status(500).json({
                error: "Error: Something went wrong",
                message: error.message
            });

        });
};

const getPublicDocuments = (req, res) => {
    documentModel.find({'private': false})
        .then(documents => {
            let extractedDouments = documents.map(doc => {
                return userController.getUserById(doc.ownerId)
                    .then(user => {
                        if(!user) {
                            return null;
                        }
                        return {...extractParamsFromDocument(doc, ['id', 'title', 'createdAt', 'updatedAt']), username: user.username}//{id: doc._id, title: doc.title, owner: user.username, createdAt: doc.createdAt }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            });
            Promise.all(extractedDouments).then(finalDocs => res.status(200).json({docs: finalDocs.filter(doc => doc)}));
        })
        .catch(error => {
            logger.debugWithUuid(req, "Error");

            res.status(404).json({
                error: "Error ",
                message: error.message
            })
        })
};

const getDocumentsSharedWithMe = (req, res) => {
    accessGroupModel.find({userIds: req.userId})
        .then(accessGroups => {
            if(accessGroups.length > 0) {
                let sharedDocsPromises = accessGroups.map(accessGroup => getInternalDocumentById(accessGroup.documentId, req.userId));
                Promise.all(sharedDocsPromises)
                    .then((values) => values.filter(doc=> doc).map(doc => extractParamsFromDocument(doc,["id", "title", "ownerId", "createdAt"])))
                    .then(docs => {
                        let userNamePromises = docs.map(doc => {
                            return userController.getUserById(doc.ownerId)
                                .then(user => Promise.resolve({...doc, username: user.username}))
                                .catch(error => Promise.reject(error));
                        });
                        return Promise.all(userNamePromises);
                    })
                    .then((docs) => res.status(200).json({docs: docs}))
                    .catch(error => res.status(404).json({ error: "Error ", message: error.message }))
            } else {
                res.status(404).send({docs: []});

                logger.debugWithUuid(req, "Could not find document with id: " + req.params["id"]);

            }
        })
        .catch(error => {
            logger.debugWithUuid(req, "Error");

            res.status(404).json({
                error: "Error ",
                message: error.message
            })
        })

};

const extractParamsFromDocument = (doc, variables) => {
    let temp = {};
    variables.forEach(variable => temp[variable] = doc[variable]);
    return temp;
};
const extractIDTitle = (doc, privacyOption) => {
    let temp = {"id": doc._id, "title": doc.title, createdAt: doc.createdAt, updatedAt: doc.updatedAt};
    return privacyOption ? {...temp, privacy: privacyOption} : temp;
};

const change_IDtoId = doc => {
    return {...doc.toJSON(), id: doc._id};
};


module.exports = {
    create,
    getById,
    get,
    downloadDocumentById,
    getPublicDocuments,
    updateDocument,
    updateDocumentPrivacy,
    getDocumentsSharedWithMe
};
