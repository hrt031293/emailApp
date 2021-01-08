const mongoose = require('mongoose');

var emailTime = new mongoose.Schema({
    hour: {
        type: Number,
        trim: true,
        required: true
    },
    minute: {
        type: Number,
        trim: true,
        required: true
    }
});
var emailTimeModel = mongoose.model('emailTime', emailTime);
module.exports =  emailTimeModel ;