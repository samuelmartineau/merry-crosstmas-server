var express = require('express');
var app = express();
//var mailConfig = require('./config/mailConfig');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

var port = process.env.PORT || 5000;

var auth = {
  auth: {
    api_key: process.env.API_KEY,
    domain: process.env.DOMAIN
  }
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

app.get('/', function(req, res) {
	res.send('hello world');
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Merry Crosstmas ✔ <kikou@lol.fr>', // sender address
    to: 'martineau.samuel.1990+test@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

app.post('/send', function(req, res) {

	// send mail with defined transport object
	nodemailerMailgun.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log('sendMail', error);
			res.send('mail error');
		} else {
			console.log('Message sent: ' + info.response);
			res.send('mail success');
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
