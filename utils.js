var clone = require('clone');
var uniq = require('lodash-node/compat/array/uniq');
var shuffle = require('lodash-node/compat/collection/shuffle');
var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

var validateEmail = function(email) {
  return re.test(email);
};

var isValid = function(params) {
  // has contacts key
  if (!params.contacts) {
    return false;
  }

  // contacts is an array
  if (params.contacts.isArray) {
    return false;
  }

  // contacts length > 2 because offer gifts between 2 friends isn't anonymous...
  // More than 20 is broadcasting...
  if (params.contacts.length < 3 && params.contacts.length < 21) {
    return false;
  }

  var mails = [];
  var contactsAreValid = params.contacts.every(function(contact) {
    mails.push(contact.mail);
    return contact.name.length > 0 && validateEmail(contact.mail);
  });

  // each contact has name and mail
  if (!contactsAreValid) {
    return false;
  }

  // each mail is uniq
  if (uniq(mails).length !== mails.length) {
    return false;
  }

  // has content key
  if (!params.content) {
    return false;
  }

  return true;
};

var getWhoToWho = function(contacts) {
  var result = [],
    contacts = shuffle(contacts),
    contactsSize = contacts.length,
    receiver;

    for (var i = 0; i < contactsSize - 1; i++) {
      result.push({
        from: contacts[i],
        to: contacts[i + 1]
      });
    }

    result.push({
      from: contacts[contactsSize -1],
      to: contacts[0]
    });

  return result;
};

module.exports = {
	validateEmail: validateEmail,
	isValid: isValid,
	getWhoToWho: getWhoToWho
}
