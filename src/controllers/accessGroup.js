"use strict";

const {
    checkForMissingVariablesInBodyElseSendResponseAndFalse,
    filterDuplicateEntriesFromArray,
    removeItemsFromArray
} = require("./util");

const notifier = require('../notifier');

const accessGroupModel = require('../models/accessGroup');
const documentModel = require('../models/document');
const userController = require('./user');

const logger = require('../logger')("controller/accessGroup.js");

const checkIfRequesterHasAnyAccessToDocument = (documentId, requesterId) => {
    // Check if requester has any access
    return checkIfRequesterHasSpecificAccessToDocument(documentId, requesterId,
        Object.values(accessGroupModel.modifierEnum));
};

const checkIfRequesterHasRightToReadDocument = (documentId, requesterId) => {
    // Check if requester has read or write access
    // If requester has write access he automatically also gets read access
    return checkIfRequesterHasSpecificAccessToDocument(documentId, requesterId,
        [accessGroupModel.modifierEnum.READ, accessGroupModel.modifierEnum.WRITE]);
};

const checkIfRequesterHasRightToWriteDocument = (documentId, requesterId) => {
    // Check if requester has write access
    return checkIfRequesterHasSpecificAccessToDocument(documentId, requesterId,
        [accessGroupModel.modifierEnum.WRITE]);
};

const checkIfRequesterHasSpecificAccessToDocument = (documentId, requesterId, possibleAccesses) => {
    logger.debug("Access for document " + documentId + " with modifier "
        + possibleAccesses + " for " + requesterId + " was requested");

    return accessGroupModel.find({
        documentId: documentId,
        modifier: {$in: possibleAccesses}
    }) // find all accessGroups of document
        .then(accessGroups => {
            if (accessGroups) {
                // find first occurrence of requesterId in accessGroup and return true

                for (let i = 0; i < accessGroups.length; i++) {
                    if (accessGroups[i].userIds.includes(requesterId)) { // this warning is fine
                        return true;
                    }
                }
                // else return false;
                return false;
            }
        });
};

const getAccessGroupsByIdWithAccessCheckElseHandleResponse = (documentId, req, res) => {
    return documentModel.findByIdLight(documentId)
        .then(doc => {
            if (doc) { // check if doc exists
                if (doc.ownerId === req.userId) { // check if owner is asking
                    // search for all accessGroups that belong to this document
                    return accessGroupModel.find({documentId: documentId});
                } else {
                    res.status(403).send("Not owner");

                    return Promise.resolve(null);
                }
            } else {
                res.status(404).send("Not found");

                return Promise.resolve(null);
            }
        })
};

const apiCreate = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['documentId', 'modifier'], req, res)) {
        return;
    }

    getAccessGroupsByIdWithAccessCheckElseHandleResponse(req.body['documentId'], req, res)
        .then(accessGroups => {
            if (accessGroups) {
                const filteredAccessGroups =
                    accessGroups.filter(accessGroup => accessGroup.modifier === req.body['modifier']);

                if (filteredAccessGroups.length > 0) {
                    logger.debugWithUuid(req, 'AccessGroup for ' + req.body['documentId'] +
                        ' with modifier ' + req.body['modifier'] + ' already exists');

                    res.status(409).send('Exists already');
                } else {
                    accessGroupModel.create(req.body)
                        .then(accessGroup => {
                            logger.infoWithUuid(req, 'AccessGroup for ' + req.body['documentId'] +
                                ' with modifier ' + req.body + ' was created');
                            res.status(201).send({id: accessGroup._id});

                            sendEmailToUserIds(accessGroup.documentId, req.userId, accessGroup.userIds);
                        });
                }
            }
        });
};

const apiGetByDocumentId = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['documentId'], req, res)) {
        return;
    }

    getAccessGroupsByIdWithAccessCheckElseHandleResponse(req.params['documentId'], req, res)
        .then(accessGroups => {
            if (accessGroups) {
                let accessGroupPromises = accessGroups.map(accessGroup => {
                    let userList = accessGroup.userIds.map(userId => userController.getUserById(userId));
                    return Promise.all(userList).then(myUserList => {
                        return {
                            ...accessGroup.toJSON(), userIds: myUserList.map(u => {
                                return {userId: u._id, email: u.email}
                            })
                        }
                    })
                });
                Promise.all(accessGroupPromises)
                    .then(myAccessGroups => res.status(200).send({accessGroups: myAccessGroups}));
            }
        });
};

const apiAddUsersById = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['documentId', 'modifier'], req, res)) {
        return;
    }

    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['userIds'], req, res)) {
        return;
    }

    getAccessGroupsByIdWithAccessCheckElseHandleResponse(req.params['documentId'], req, res)
        .then(accessGroups => {
            if (accessGroups) {
                const filteredAccessGroups =
                    accessGroups.filter(accessGroup => accessGroup.modifier === req.params['modifier']);

                if (filteredAccessGroups.length > 0) {
                    // TODO: check if userIds actually exist in db. Create method: user.filterForRealUserIds
                    const myAccessGroup = filteredAccessGroups[0];

                    // We found our accessGroup
                    // filter out new users for email
                    const newUsers = req.body['userIds'].filter(function (obj) {
                        return myAccessGroup.userIds.indexOf(obj) === -1;
                    });

                    // Concat the two arrays and...
                    const newArray = myAccessGroup.userIds.concat(req.body['userIds']);
                    myAccessGroup.userIds = // filter duplicate entries
                        filterDuplicateEntriesFromArray(newArray);

                    myAccessGroup.save();

                    res.status(201).send('Added');

                    sendEmailToUserIds(myAccessGroup.documentId, req.userId, newUsers);
                } else {
                    res.status(404).send('Not found');
                }
            }
        })

};

const apiRemoveUsersById = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['documentId', 'modifier'], req, res)) {
        return;
    }

    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['userIds'], req, res)) {
        return;
    }

    getAccessGroupsByIdWithAccessCheckElseHandleResponse(req.params['documentId'], req, res)
        .then(accessGroups => {
            if (accessGroups) {
                const filteredAccessGroups =
                    accessGroups.filter(accessGroup => accessGroup.modifier === req.params['modifier']);

                if (filteredAccessGroups.length > 0) {
                    // We found our accessGroup
                    // Filter out userIds which should be removed

                    filteredAccessGroups[0].userIds =
                        removeItemsFromArray(filteredAccessGroups[0].userIds, req.body['userIds']);

                    filteredAccessGroups[0].save();

                    logger.infoWithUuid(req, 'Users from accessGroup deleted');
                    res.status(200).send();
                } else {
                    res.status(404).send('Not found');
                }

            }
        });
};

const apiDeleteAccessGroup = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['documentId', 'modifier'], req, res)) {
        return;
    }

    getAccessGroupsByIdWithAccessCheckElseHandleResponse(req.params['documentId'], req, res)
        .then(accessGroups => {
            if (accessGroups) {
                const filteredAccessGroups =
                    accessGroups.filter(accessGroup => accessGroup.modifier === req.params['modifier']);

                if (filteredAccessGroups.length > 0) {
                    filteredAccessGroups[0].delete();

                    logger.infoWithUuid(req, 'AccessGroup deleted');
                    res.status(200).send({id: req.params['documentId']});
                } else {
                    res.status(404).send('Not found!');
                }
            }
        });
};

const sendEmailToUserIds = (documentId, creatorId, userIds) => {
    if (userIds && userIds.length > 0) {
        return documentModel.findByIdLight(documentId)
            .then(document => {
                return userController.getUserById(creatorId)
                    .then(creatorUser => {
                        return userIds.forEach(userId => {
                            userController.getUserById(userId).then(receivingUser => {
                                const template = notifier.templates
                                    .documentSharedPrivatelyToUser(creatorUser.username,
                                        receivingUser.firstName,
                                        document.title,
                                        documentId);

                                return notifier.notifyUserWithTemplate(userId, template);

                            })
                        });
                    })


            })
    }
};

module.exports = {
    checkIfRequesterHasAnyAccessToDocument,
    checkIfRequesterHasRightToReadDocument,
    checkIfRequesterHasRightToWriteDocument,
    apiCreate,
    apiGetByDocumentId,
    apiAddUsersById,
    apiRemoveUsersById,
    apiDeleteAccessGroup
};
