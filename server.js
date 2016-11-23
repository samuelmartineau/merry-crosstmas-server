const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const sanitizeHtml = require('sanitize-html');
const {
  EmailTemplate
} = require('email-templates');
const path = require('path');
const async = require('async');
const utils = require('./utils');
const Pack = require('./package');
const {
  sanitizeConfig
} = require('./config/sanitize');
const friendTagName = /@friend/gi;

const template = new EmailTemplate(path.join(__dirname, 'mail'));

const mailerAuth = {
  auth: {
    api_key: process.env.API_KEY,
    domain: process.env.DOMAIN
  }
}

const nodemailerMailgun = nodemailer.createTransport(mg(mailerAuth));;
const swaggerOptions = {
  info: {
    'title': 'Merry Crosstmas API Documentation',
    'version': Pack.version,
  }
};

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: process.env.PORT || 5000,
  routes: {
    cors: true
  }
});
server.register([Inert, Vision, {
  register: HapiSwagger,
  options: swaggerOptions
}, {
  register: require('hapi-brute')
}], {}, (err) => {
  if (err) {
    console.error('Failed to load plugin:', err);
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    return reply().redirect('http://samuelmartineau.com/projects/merry-crosstmas/');
  }
});

server.route({
  method: 'GET',
  config: {
    plugins: {
      brute: {
        preResponse: true
      }
    }
  },
  path: '/test',
  handler: (request, reply) => {
    return reply({
      message: 'API running'
    });
  }
});

const mailsAtOnce = 10;

server.route({
  method: 'POST',
  path: '/send',
  config: {
    handler: (request, reply) => {
      if (!utils.isValid(request.payload)) {
        return reply({
          message: 'Invalid Parameters'
        }).code(400);
      }

      const whoToWho = utils.getWhoToWho(request.payload.contacts);

      const contentCleaned = sanitizeHtml(request.payload.content, sanitizeConfig);

      async.mapLimit(whoToWho, mailsAtOnce, (item, next) => {
        item.content = contentCleaned;
        item.from.name = sanitizeHtml(item.from.name, sanitizeConfig);
        item.to.name = sanitizeHtml(item.to.name, sanitizeConfig);

        template.render(item, function(err, results) {
          if (err) return next(err)

          nodemailerMailgun.sendMail({
            from: 'Merry Crosstmas <messages-noreply@merry-crosstmas.com>',
            to: item.from.mail,
            subject: 'Secret Santa friend designation',
            html: results.html.replace(friendTagName, item.to.name),
            text: results.text
          }, (err, responseStatus) => {
            if (err) {
              return next(err);
            }
            next(null, responseStatus.message);
          });
        });
      }, (err) => {
        if (err) {
          console.error('error sending mail', err);
          return reply({
            message: 'Email sending error'
          }).code(500);
        }
        return reply({
          message: 'Succesfully sent ' + whoToWho.length + ' messages'
        });
      });
    },
    description: 'Send method',
    notes: ['Method to send random mate target mail'],
    plugins: {
      'hapi-swagger': {
        payloadType: 'form'
      }
    },
    tags: ['api'],
    validate: {
      params: {},
      payload: {
        content: Joi.string()
          .required()
          .description('html content'),
        contatcs: Joi.array(Joi.object().keys({
            name: Joi.string().required(),
            mail: Joi.string().required()
          }))
          .required()
          .length(3)
          .description('contacts list')
      }
    }
  }
});

process.on('uncaughtException', function(err) {
  console.log('uncaughtException', err);
});

// START THE SERVER
// =============================================================================
server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Magic happens on port :', server.info.uri);
});

module.exports = server;
