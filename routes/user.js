const express = require('express');

const User = express.Router();
const UserController = require('../controllers/user');
const ModeratorController = require('../controllers/moderator');

User.post('/report', async function(req, res, next) {

    try{
        let report = await UserController.createReport(req.body);
        await ModeratorController.assignReport();
        report = await UserController.getReport(report._id.toString());
        res.status(201).json(report);
    } catch(err) {
        return next(error(400, err.message));
    }
});

module.exports = User;