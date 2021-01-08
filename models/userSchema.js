const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    }
});
var userModel = mongoose.model('user', userSchema);
module.exports =  userModel ;