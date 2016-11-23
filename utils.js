const uniq = require('lodash.uniq');
const shuffle = require('lodash.shuffle');
const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

const validateEmail = email => {
  return re.test(email);
};

const isValid = params => {
  // has contacts key
  if (!params.contacts) {
    return false;
  }

  // contacts is an array
  if (!Array.isArray(params.contacts)) {
    return false;
  }

  // contacts length > 2 because offer gifts between 2 friends isn't anonymous...
  // More than 20 is broadcasting...
  if (params.contacts.length < 3 || params.contacts.length > 20) {
    return false;
  }

  const mails = [];
  const contactsAreValid = params.contacts.every(contact => {
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

const getWhoToWho = contacts => {
  const result = [];
  const contactsShuffled = shuffle(contacts);
  const contactsSize = contacts.length;

    for (var i = 0; i < contactsSize - 1; i++) {
      result.push({
        from: contactsShuffled[i],
        to: contactsShuffled[i + 1]
      });
    }

    result.push({
      from: contactsShuffled[contactsSize -1],
      to: contactsShuffled[0]
    });

  return result;
};

module.exports = {
	validateEmail: validateEmail,
	isValid: isValid,
	getWhoToWho: getWhoToWho
}
