var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var sanitizeHtml = require('sanitize-html');
var EmailTemplate = require('email-templates').EmailTemplate
var path = require('path');
var utils = require('./utils');
var async = require('async');
var ExpressBrute = require('express-brute');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
	extended: true
})); // support encoded bodies
app.use('/', express.static('views'));

var sanitizeConfig = {
	allowedTags: ['b', 'i', 'em', 'strong', 'p', 'div', 'br'],
	allowedAttributes: {
		'*': ['style']
	}
};

var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);

var re = /@friend/gi;

var template = new EmailTemplate(path.join(__dirname, 'mail'));

var port = process.env.PORT || 5000;

// mailer auth
var auth = {
	auth: {
		api_key: process.env.API_KEY,
		domain: process.env.DOMAIN
	}
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

app.get('/test', function(req, res) {
	res.send({
		message: 'API running'
	});
});

app.post('/send',
	bruteforce.prevent, // error 429 if we hit this route too often
	function(req, res) {
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
					console.error('error sending mail', err);
					res.status(500).send({
						message: 'Email sending error'
					});
				}
				res.send({
					message: 'Succesfully sent ' + whoToWho.length + ' messages'
				});
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
