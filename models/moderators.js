const mongoose = require('mongoose');

const ModeratorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true,
    },
    reportAssigned: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Report',
    }
});

const Moderator = mongoose.model('Moderator', ModeratorSchema)

module.exports = Moderator;