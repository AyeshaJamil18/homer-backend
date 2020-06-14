"use strict";

const logger = require('../logger')('controller/util.js');

const checkForMissingVariablesInBody = (body, varList) =>
    varList.filter(x => !Object.prototype.hasOwnProperty.call(body, x)).join(",");

const checkForMissingVariablesInBodyElseSendResponseAndFalse = (body, varList, req, res) => {
    const missingArgumentsDocument = checkForMissingVariablesInBody(body, varList);

    if (missingArgumentsDocument !== "") {
        logger.debugWithUuid(body, 'Request did not contain ' + missingArgumentsDocument);

        res.status(400).json({
            error: 'Bad Request',
            message: 'Request did not contain ' + missingArgumentsDocument
        });

        return false;
    }

    return true;
};

const filterDuplicateEntriesFromArray = (array) => {
    return array.filter((item, pos) => array.indexOf(item) === pos);
};

const removeItemsFromArray = (original, removeItems) => {
    return original.filter(item => !removeItems.includes(item));
};

module.exports = {
    checkForMissingVariablesInBody,
    checkForMissingVariablesInBodyElseSendResponseAndFalse,
    filterDuplicateEntriesFromArray,
    removeItemsFromArray
};
