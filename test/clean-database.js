"use strict";

const accessGroupModel = require('../src/models/accessGroup');
const documentModel = require('../src/models/document');
const userModel = require('../src/models/user');

before(async function () {
    this.timeout(10000);

    const promises = [accessGroupModel, documentModel, userModel].map(model => {
        console.log("Cleaning model " + model.modelName);
        return model.deleteMany({}).then(() => {
            console.log("Cleaned model " + model.modelName);
            return Promise.resolve();
        });
    });

    return Promise.all(promises);
});
