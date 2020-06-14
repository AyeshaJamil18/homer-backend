"use strict";

const config = require('./config');
const environment = require('./environment');
const templateProvider = require('./messageTemplateProvider');
const userController = require('./controllers/user');
const logger = require('./logger')("notifier.js");

const os = require('os');

const mailProvider = require('gmail-send')({
    user: config.email,
    pass: config.emailPass,
});

const sendMail = (email, subject, message) => {
    if (email) {
        if (environment.isTest()) { // excluding emails from test
            console.log('Sending email was interrupted. Test environment');
            return Promise.resolve(true);
        }

        return mailProvider(({to: email, subject: subject, text: message}))
            .then(({result,}) => {
                logger.info("Sending email was successful");
                logger.debug("Email server response was: " + result);
                return true;
            }).catch(err => {
                logger.error(err.message);
                return false;
            });
    } else {
        throw "Email not provided"
    }
};

const sendTestMail = () => {
    const messageObj = {
        osHostname: os.hostname(),
        osType: os.type(),
        osPlatform: os.platform(),
        osArch: os.arch(),
        osRelease: os.release(),
        date: new Date().toISOString()
    };
    return sendMail(config.email, "TestMail", JSON.stringify(messageObj));
};

const sendTemplateEmail = (email, template) => {
    return sendMail(email, template.subject, template.message);
};

const notifyUserWithTemplate = (userId, template) => {
    return userController.getUserById(userId)
        .then(user => {
            if (user) {
                logger.info("Notifying user " + user.id + " about subject: " + template.subject + "\n" +
                    "message: " + template.message);
                sendTemplateEmail(user.email, template);
            } else {
                logger.warning("User " + userId + " was not found")
            }
        })
};

const notifyUserWithFreeText = (userId, subject, message) => {
    const tempTemplate = templateProvider.getEmptyTemplate();
    tempTemplate.subject = subject;
    tempTemplate.message = message;
    return notifyUserWithTemplate(userId, tempTemplate);
};

// Check email system on startup. Fail early
sendTestMail().then(success => {
    if (!success) {
        throw "********************** Test mail failed. Check email configs ******************************"
    }
});

module.exports = {
    notifyUserWithTemplate,
    notifyUserWithFreeText,
    sendTestMail,
    templates: templateProvider // As we already require the templates in the notifier, set them as local
};
