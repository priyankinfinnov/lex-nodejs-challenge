const ModeratorModel = require('../models/moderators');
const ReportModel = require('../models/reports');

exports.createModerator = async function(moderator){
    try {

        if(!moderator.name) throw new Error('name is required.');
        if(typeof moderator.name != "string") throw new Error('name should be a string.');

        
        let moderatorObject = new ModeratorModel({
            name: moderator.name,
            isAvailable: true
        });

        await moderatorObject.save();
        return moderatorObject.toJSON();
    } catch (err) {
        return Promise.reject(err);
    }
}

exports.getModerator = async function(moderatorId){
    try {

        if(!moderatorId) throw new Error('moderatorId is required.');
        if(moderatorId && moderatorId.length != 24) throw new Error('moderatorId should be a valid id.');

        let moderator = await ModeratorModel.findOne({ _id: moderatorId });
        return moderator.toJSON();
    } catch (err) {
        return Promise.reject(err);
    }
}

exports.reviewPost = async function(review){
    try {
        
        if(!review.reportId) throw new Error('reportId is required.');
        if(review.reportId && review.reportId.length != 24) throw new Error('reportId should be a valid id.');

        let reportDoc = await ReportModel.findOne({ _id: review.reportId });

        if(!reportDoc) throw new Error('report not found.');
        if(reportDoc.isAssigned != true) throw new Error('report was not assigned.');
        if(reportDoc.isResolved) throw new Error('report already resolved.');

        reportDoc.isResolved = true;
        await reportDoc.save();
        await ModeratorModel.updateOne({ _id: reportDoc.moderatorAssigned }, { $set: { isAvailable: true }, $unset: { reportAssigned: true } });
        return reportDoc.toJSON();
    } catch (err) {
        return Promise.reject(err);
    }
}

exports.assignReport = async function(){

    const session = await ModeratorModel.startSession();

    try {

        await session.withTransaction( async () => {
            let report = await ReportModel.findOne({ isAssigned: false }).session(session);
            let moderator = await ModeratorModel.findOne({ isAvailable: true }).session(session);

            if(report && moderator){
                let reportUpdateResult = await ReportModel.updateOne({ _id: report._id, isAssigned: false }, { $set: { isAssigned: true, moderatorAssigned: moderator._id } }).session(session);
                let moderatorUpdateResult = await ModeratorModel.updateOne({ _id: moderator._id, isAvailable: true }, { $set: { isAvailable: false, reportAssigned: report._id } }).session(session);

                if(reportUpdateResult.nModified != 1) throw new Error('reports update failed');
                if(moderatorUpdateResult.nModified != 1) throw new Error('moderator update failed');
            } else {
                //either all reports already assigned OR all moderator already busy
            }
        });

        session.endSession();        
        return { "response": "assigned" };
    } catch (err) {
        session.endSession();
        return Promise.reject(err);
    }
}