"use strict";

const {maskMsgIfNotDev} = require("../environment");

const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const config = require('../config');
const adminModel = require('../models/admin');

const notifier = require('../notifier');

const logger = require('../logger')("controller\adminAuth.js");

// Using the same regex as in the frontend for password validation
const passwordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&,.#\\+\\-\\=\\_~])[A-Za-z\\d@$!%*?&,.#\\+\\-\\=\\_~]{8,30}$';

const login = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['email', 'password'], req, res)) {
        return;
    }

    adminModel.findOne({email: req.body.email})
        .then(admin => {
            if (admin) {
                // check if the password is valid
                const isPasswordValid = bcrypt.compareSync(req.body.password, admin.password);
                if (!isPasswordValid) {
                    logger.debugWithUuid(req, "User " + admin.email + " login failed due to wrong password");
                    return res.status(401).send({token: null});
                }

                logger.debugWithUuid(req, "User " + admin + " has logged in");

                // if admin is found and password is valid
                // create a token
                const token = jwt.sign({id: admin._id, email: admin.email, username: admin.username},
                    config.jwtSecret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                res.status(200).json({token: token});

                // Update lastLogin
                admin.lastLogin = Date.now();
                return admin.save();
            } else {
                logger.debugWithUuid(req, "User with " + req.body.email + " not found");

                res.status(404).json({
                    error: 'User Not Found'
                })
            }

        })
        .catch(error => {
            logger.errorWithUuid(req, "Internal server error: " + error.message);
            res.status(500).json({message: maskMsgIfNotDev(error.message)});
        });
};


const register = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body,
        ['username', 'email', 'firstName', 'lastName', 'password'], req, res)) {
        return;
    }

    // validation
    const complaintList = [
        [!validator.isAlphanumeric(req.body['username']), "Username is not alpha numeric"],
        [!validator.isEmail(req.body['email']), "Email is not valid"],
        [!validator.isLength(req.body['password'], {min: 8, max: 30}),
            "Password is to long or to short. Minimum 8, Maximum 30"],
        [!validator.matches(req.body['password'], passwordRegex),
            'Password must have a minimum of 8 characters, one capital letter, one number, one special character' +
            ' (@$!%*?&,.#+-=_~) and only English alphabets are allowed.']
    ];

    const actualComplaints = complaintList.filter(value => value[0]).map(value => value[1]);
    if (actualComplaints.length > 0) {
        logger.debugWithUuid(req, "SignUp failed because of " + actualComplaints);
        res.status(422).send({complaints: actualComplaints});
        return;
    }

    const admin = Object.assign(req.body, {password: bcrypt.hashSync(req.body.password, 8)});

    adminModel.create(admin)
        .then(dbUser => {
            logger.debugWithUuid(req, "User " + dbUser.username + ", Email " + dbUser.email + " has been registered");

            // if admin is registered without errors
            // create a token
            const token = jwt.sign({id: dbUser._id, email: dbUser.email}, config.jwtSecret, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(200).json({token: token});

            // notifier admin
            const template = notifier.templates.accountCreated(dbUser.firstName);
            notifier.notifyUserWithTemplate(dbUser._id, template);
        })
        .catch(error => {
            if (error.code === 11000) {

                let errorMsg;
                let descriptionMsg;
                let conflictField;
                let errorCode;
                if (error.keyValue.hasOwnProperty('username') || error.keyValue.hasOwnProperty('username')) {
                    errorMsg = 'Username exists';
                    descriptionMsg = 'Username: ' + req.body['username'] + ' already exists';
                    errorCode = 409;
                    conflictField = 'username';
                } else if (error.keyValue.hasOwnProperty('email') || error.keyValue.hasOwnProperty('Email')) {
                    errorMsg = 'Email exists';
                    descriptionMsg = 'Email: ' + req.body['email'] + ' already exists';
                    errorCode = 409;
                    conflictField = 'email';
                } else {
                    errorMsg = "Internal server error";
                    descriptionMsg = maskMsgIfNotDev(error.message);
                    errorCode = 500;
                }

                logger.debugWithUuid(req, descriptionMsg);

                res.status(errorCode).json({
                    error: errorMsg,
                    message: descriptionMsg,
                    conflictField: conflictField // is only set if conflictField !== undefined
                })
            } else {
                logger.errorWithUuid(req, error.message);

                res.status(500).json({
                    error: 'Internal server error',
                    message: maskMsgIfNotDev(error.message)
                })
            }
        });
};

const me = (req, res) => {
    adminModel.findById(req.userId).select('email').exec()
        .then(admin => {
            logger.debugWithUuid(req, "User object " + admin.email + " was requested");

            if (!admin) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            res.status(200).json(admin)
        })
        .catch(error => {
            logger.errorWithUuid(req, error.message);

            res.status(500).json({
                error: 'Internal Server Error',
                message: maskMsgIfNotDev(error.message)
            })
        });
};

const logout = (req, res) => {
    res.status(200).send({token: null});
};


module.exports = {
    login,
    register,
    logout,
    me
};
