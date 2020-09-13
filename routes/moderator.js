const express = require('express');

const Moderator = express.Router();
const ModeratorController = require('../controllers/moderator');

Moderator.post('/', async function(req, res, next) {

    try{
        let moderator = await ModeratorController.createModerator(req.body);
        await ModeratorController.assignReport();
        moderator = await ModeratorController.getModerator(moderator._id.toString());
        res.status(201).json(moderator);
    } catch(err) {
        return next(error(400, err.message));
    }
});

Moderator.patch('/review/:reportId', async function(req, res, next) {
    
    try{
        const review = await ModeratorController.reviewPost({ reportId: req.params.reportId });
        await ModeratorController.assignReport();
        res.status(201).json(review);
    } catch(err) {
        return next(error(400, err.message));
    }
});

module.exports = Moderator;