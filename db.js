const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/email", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, })
    .then((asd) => { console.log("👍 Database Connected and Server is listening.....") })
    .catch((das) => { console.log('Error Connecting to the Mongodb Database at URL :' + config.DB_CONNECTION) })