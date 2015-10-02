var express = require('express');
var app = express();
//var mailConfig = require('./config/mailConfig');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var EmailTemplate = require('email-templates').EmailTemplate
var path = require('path');
var utils = require('./utils');
var async = require('async');

var sanitizeConfig = {
  allowedTags: [ 'b', 'i', 'em', 'strong', 'p', 'div', 'br']
};

var re = /\$friend\$/gi;

var template = new EmailTemplate(path.join(__dirname, 'mail'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
	extended: true
})); // support encoded bodies

var port = process.env.PORT || 5000;

// mailer auth
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

app.post('/send', function(req, res) {
	//console.log(req.body);
	var parameters = req.body;

	if (!utils.isValid(req.body)) {
		res.status(400).send({
			message: 'Invalid Parameters'
		});
	} else {

		var whoToWho = utils.getWhoToWho(req.body.contacts);

    var contentCleaned = sanitizeHtml(req.body.content, sanitizeConfig);

		// Send 10 mails at once
		async.mapLimit(whoToWho, 10, function(item, next) {

				item.content = contentCleaned;

        console.log(item.content);

				item.from.name = sanitizeHtml(item.from.name, sanitizeConfig);
				item.to.name = sanitizeHtml(item.to.name, sanitizeConfig);

				template.render(item, function(err, results) {
					if (err) return next(err)

					nodemailerMailgun.sendMail({
						from: 'Merry Crosstmas <messages-noreply@merry-crosstmas.com>',
						to: item.from.mail,
						subject: 'Secret Santa friend designation',
						html: results.html.replace(re, item.to.name),
						text: results.text
					}, function(err, responseStatus) {
						if (err) {
							return next(err);
						}
						next(null, responseStatus.message);
					});
				})
			}, function(err) {
				if (err) {
					console.error(err);
					res.send('error');
				}
				console.log('Succesfully sent %d messages', whoToWho.length);
				res.send('mail success');
			})

	}
});

process.on('uncaughtException', function(err) {
	console.log('uncaughtException', err);
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port :', port);
