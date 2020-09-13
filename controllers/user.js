const ReportModel = require('../models/reports');

exports.createReport = async function(report){
    try {

        if(!report.message) throw new Error('message is required.');
        if(typeof report.message != "string") throw new Error('message should be a string.');

        let reportObject = new ReportModel({
            message: report.message,
            isResolved: false,
            isAssigned: false
        });

        await reportObject.save();
        return reportObject.toJSON();
    } catch (err) {
        return Promise.reject(err);
    }
}

exports.getReport = async function(reportId){
    try {

        if(!reportId) throw new Error('reportId is required.');
        if(reportId && reportId.length != 24) throw new Error('reportId should be a valid id.');

        let report = await ReportModel.findOne({ _id: reportId });
        return report.toJSON();
    } catch (err) {
        return Promise.reject(err);
    }
}