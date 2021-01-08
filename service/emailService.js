const nodemailer = require('nodemailer');
const User = require("../models/userSchema");
const failedEmailSchema = require("../models/failedMail");

var mailer = async function () {
    try {
        return new Promise((resolve, reject) => {
            try {

                User.find().then(userList => {
                    userList.forEach(element => {


                        let mailOptions;
                        let emailTemp = `<h2>Hello ${element.name},</h2>
                        <p> Your account has been created. To confirm your email please click the link below.</p>`

                        mailOptions = {
                            from: "XXXXXXXXXXXXXXXXXXX", // sender address
                            to: element.email,
                            subject: 'Test Email', // Subject line
                            html: emailTemp // plain text body
                        };

                        var transporter = nodemailer.createTransport({
                            host: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                            port: XXX,
                            secureConnection: true,
                            auth: {
                                user: "XXXXXXXXXXXXXXXXXX",
                                pass: "XXXXXXXXXXXXXXXXXX"
                            },
                            logger: false, // log to console
                            debug: true // include SMTP traffic in the logs
                        });
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log("sendMail error", error);
                                let userDetails = new failedEmailSchema({
                                    name: element.name,
                                    email: element.email
                                });
                                userDetails.save().then((savedUnsentMail) => {
                                    // console.log("SAVED UNSENT MAIL DOC", savedUnsentMail);
                                }).catch(error => {
                                    console.log("ERROR IN SAVING UNSENT MAIL", error);
                                })
                            } else {
                                console.log("message sent successfully");
                            }
                        });

                    });
                }).catch(error => {
                    console.log("ERROR IN  FINDING USER", error);
                })
            } catch (error) {
                console.log("Error in main catch in mailer service", error);
            }
        });
    } catch (error) {
        console.log("Error in main catch in mailer service", error);
    }
}

module.exports = mailer;