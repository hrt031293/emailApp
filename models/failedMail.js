const mongoose = require('mongoose');

var failedMailSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
var failedEmailModel = mongoose.model('failedEmail', failedMailSchema);
module.exports =  failedEmailModel ;