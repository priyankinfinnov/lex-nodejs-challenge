const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    isResolved: {
        type: Boolean,
        required: true,
    },
    isAssigned: {
        type: Boolean,
        required: true,
    },
    moderatorAssigned: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Moderator',
    }
});

const Report = mongoose.model('Report', ReportSchema)

module.exports = Report;