"use strict";

const config = require('./config');

// define a format which is generally used to send messages
const getEmptyTemplate = () => {
    return {subject: "", message: ""};
};

const greetingMessage = (firstName) => "Hello " + firstName + ",\n\n";

const farewellMessage = () => "\nBest regards\n" +
    "Your Homer Team\n";

const accountCreated = (firstName) => {
    const template = getEmptyTemplate();
    template.subject = "Your account has been created";
    template.message = greetingMessage(firstName) +
        "your account was successfully created.\n" +
        "We are very happy that you use our service :).\n" +
        farewellMessage();
    return template;
};

const documentCreated = (firstName, documentTitle) => {
    const template = getEmptyTemplate();
    template.subject = "Your document " + documentTitle + " has been created";
    template.message = greetingMessage(firstName) +
        "Your document " + documentTitle + " has been created successfully.\n" +
        farewellMessage();
    return template;
};

const documentEdited = (firstName, documentTitle, editorName) => {
    const template = getEmptyTemplate();
    template.subject = "Your document " + documentTitle + " has been edited";
    template.message = greetingMessage(firstName) +
        "Your document " + documentTitle + " has been edited by " + editorName + ".\n" +
        farewellMessage();
    return template;
};

const documentSharedPrivatelyToUser = (fromUsername, toFirstName, documentTitle, documentId) => {
    const template = getEmptyTemplate();
    template.subject = "The document " + documentTitle + " has been shared with you privately";
    template.message = greetingMessage(toFirstName) +
        "The user " + fromUsername + " has shared the document " + documentTitle + " privately with you.\n" +
        "You can view the document at " + config.frontendUrl + "/document/" + documentId + " \n" +
        farewellMessage();
    return template;
};

module.exports = {
    getEmptyTemplate,
    accountCreated,
    documentCreated,
    documentEdited,
    documentSharedPrivatelyToUser
};
