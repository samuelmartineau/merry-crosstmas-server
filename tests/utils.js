var test = require('tape');
var utils = require('./../utils');

var noContent = {
    contacts: [{name:'sam','mail':'sam@test.fr'},{name:'dam','mail':'dam@test.fr'},{name:'aline','mail':'aline@test.fr'}],
};

var contactsString = {
    contacts: 'test',
    content: '<div style=\'text-align: center;\'>test<\/div>'
};

var notEnoughContacts = {
    contacts: [{name:'sam','mail':'sam@test.fr'},{name:'dam','mail':'dam@test.fr'}],
    content: '<div style=\'text-align: center;\'>test<\/div>'
};

var tooMuchContacts = {
    contacts: [
      {name:'1','mail':'1@1.fr'},{name:'2','mail':'2@2.fr'}, {name:'3','mail':'3@3.fr'},{name:'4','mail':'4@4.fr'},{name:'5','mail':'5@5.fr'},
      {name:'6','mail':'6@6.fr'},{name:'7','mail':'7@7.fr'}, {name:'8','mail':'8@8.fr'},{name:'9','mail':'9@9.fr'},{name:'10','mail':'10@10.fr'},
      {name:'11','mail':'11@11.fr'},{name:'12','mail':'12@12.fr'}, {name:'13','mail':'13@13.fr'},{name:'14','mail':'14@14.fr'},{name:'15','mail':'15@15.fr'},
      {name:'16','mail':'16@16.fr'},{name:'17','mail':'17@17.fr'}, {name:'18','mail':'18@18.fr'},{name:'19','mail':'19@19.fr'},{name:'20','mail':'20@20.fr'},
      {name:'21','mail':'21@21.fr'}
    ],
    content: '<div style=\'text-align: center;\'>test<\/div>'
};

var invalidMail = {
    contacts: [{name:'sam','mail':'samtest.fr'},{name:'dam','mail':'dam@test.fr'},{name:'aline','mail':'aline@test.fr'}],
    content: '<div style=\'text-align: center;\'>test<\/div>'
};

var invalidName = {
    contacts: [{name:'','mail':'sam@test.fr'},{name:'dam','mail':'dam@test.fr','id':1},{name:'aline','mail':'aline@test.fr'}],
    content: '<div style=\'text-align: center;\'>test<\/div>'
};

var duplicateMail = {
    contacts: [{name:'sam','mail':'sam@test.fr'},{name:'dam','mail':'dam@test.fr'},{name:'aline','mail':'sam@test.fr'}],
    content: '<div style=\'text-align: center;\'>test<\/div>'
};

var good = {
    contacts: [{name:'sam','mail':'sam@test.fr'},{name:'dam','mail':'dam@test.fr'},{name:'aline','mail':'ali@test.fr'}],
    content: '<div style=\'text-align: center;\'>test<\/div>'
};

test('mail isValid testing', function (t) {
    t.plan(8);

    t.false(utils.isValid(noContent), 'parameters should have content');

    t.false(utils.isValid(contactsString), 'contacts should be an array');

    t.false(utils.isValid(notEnoughContacts), 'contacts should has more than 2 items');

    t.false(utils.isValid(tooMuchContacts), 'contacts should has less than 21 items');

    t.false(utils.isValid(invalidMail), 'contacts should have a valid mail');

    t.false(utils.isValid(invalidName), 'contacts should have a valid mail');

    t.false(utils.isValid(duplicateMail), 'contacts should have a uniq mail');

    t.true(utils.isValid(good), 'parameters are good');

});

var invalidMail = 'sammdaz.fr';

var validMail = 'sam@test.fr';

test('mail isValid testing', function (t) {
    t.plan(2);

    t.false(utils.validateEmail(invalidMail), 'should be invalid');

    t.true(utils.validateEmail(validMail), 'contacts should be valid');

});
