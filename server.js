var express = require('express');
var app = express();
var mailConfig = require('./config/mailConfig');
var nodemailer = require('nodemailer');

var port = process.env.PORT || 5000;

var transporter = nodemailer.createTransport(mailConfig);

app.get('/', function(req, res) {
	res.send('hello world');
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Merry Crosstmas ✔ <'+process.env.MAIL_USER+'>', // sender address
    to: 'sam@yopmail.com, sam@yopmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

app.post('/send', function(req, res) {
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info) {
		if ('sendMail', error) {
			console.log(error);
		} else {
			console.log('Message sent: ' + info.response);
		}
	});
});

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err);
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port :', port);
