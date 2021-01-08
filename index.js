var express = require('express');
require('./db');
var app = express();
let scheduleSchema = require("./models/scheduleTime");
let userSchema = require("./models/userSchema");
var schedule = require('node-schedule');
let emailService = require("./service/emailService");
let unsentEmails = require("./models/failedMail");
const bodyParser = require('body-parser');


app.use(bodyParser.json());

app.post('/createSchedule', (req, res) => {
    let hourValue = req.body.hour;
    let minuteValue = req.body.minute;
    if (hourValue < 0 || hourValue > 23) {
        res.send({ status: false, message: "Invalid Time" });
    } else if (minuteValue < 0 || minuteValue > 59) {
        res.send({ status: false, message: "Invalid Time" });
    } else {
        let timeDetail = new scheduleSchema({
            hour: hourValue,
            minute: minuteValue
        });
        scheduleSchema.findOne({}).then((timeDoc) => {
            if (!timeDoc) {
                timeDetail.save().then((savedTimeDoc) => {
                    res.send({ status: true, message: "Data Saved" });
                }).catch(error => {
                    console.log("ERROR IN SAVING TIME", error);
                    res.send({ status: false, message: "Error in saving time" });
                })
            }
            else {
                scheduleSchema.findOneAndUpdate({ _id: timeDoc._id }, { $set: { hour: hourValue, minute: minuteValue } }, { new: true }).then(updatedValue => {
                    updatedTime(updatedValue.hour, updatedValue.minute);
                    res.send({ status: true, message: "Data Updated" });
                }).catch(error => {
                    console.log("ERROR IN UPDATING TIME", error);
                    res.send({ status: false, message: "Error in updating time" });
                })
            }
        });
    }
});


app.get('/getScheduleTime', (req, res) => {
    scheduleSchema.findOne({}).then((timeDoc) => {
        if (timeDoc) {
            res.send({ status: true, data: timeDoc });
        } else {
            res.send({ status: false, message: "No data found" });
        }
    }).catch(error => {
        console.log("ERROR IN GETTING TIME", error);
        res.send({ status: false, message: "Error in getting time" });
    })
});


app.get('/deleteScheduledTime', (req, res) => {
    scheduleSchema.findOneAndRemove().then((deletedTimeDoc) => {
        res.send({ status: true, message: "Time deleted" });
    }).catch(error => {
        console.log("ERROR IN DELETING TIME", error);
        res.send({ status: false, message: "Error in deleting time" });
    })
});



app.post('/createUser', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let userDetail = new userSchema({
        name: name,
        email: email
    });
    userDetail.save().then((savedUser) => {
        res.send({ status: true, message: "Data Saved" });
    }).catch(error => {
        console.log("ERROR IN SAVING USER", error);
        res.send({ status: false, message: "Error in saving user" });
    })

});

app.get('/getUnsentEmails', (req, res) => {
    unsentEmails.find().then((unsentEmails) => {
        if (unsentEmails) {
            res.send({ status: true, data: unsentEmails });
        } else {
            res.send({ status: false, message: "No data found" });
        }
    }).catch(error => {
        console.log("ERROR IN GETTING UNSENT EMAIL", error);
        res.send({ status: false, message: "Error in getting unsent email" });
    })
});



(function () {
    scheduleSchema.findOne({}).then((timeDoc) => {
        if (timeDoc) {
            schedule.scheduleJob({ hour: timeDoc.hour, minute: timeDoc.minute }, function () {
                emailService();
            });
        } else {
            res.send({ status: false, message: "No data found" });
        }
    }).catch(error => {
        console.log("ERROR IN GETTING TIME", error);
        res.send({ status: false, message: "Error in getting time" });
    })
})()

function updatedTime(hour, minute) {
    schedule.scheduleJob({ hour: hour, minute: minute }, function () {
        emailService();
    });
}


app.listen("3000", function () {
    console.log('Express started on port: 3000');
});