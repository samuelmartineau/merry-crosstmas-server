const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

var server = require('../server');

lab.experiment('Merry Crosstmas test', function() {
  // tests
  lab.test('GET /test should return json with a message key', function(done) {
    var options = {
      method: 'GET',
      url: '/test'
    };
    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result.message).to.exist();
      server.stop();
      done();
    });
  });

  lab.test('GET / should redirect to static server', function(done) {
    var options = {
      method: 'GET',
      url: '/'
    };
    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(302);
      Code.expect(response.headers.location).to.equal('http://samuelmartineau.com/projects/merry-crosstmas/');

      server.stop();
      done();
    });
  });

  lab.test('GET /send should response 400 if contacts is missing', function(done) {
    var options = {
      method: 'POST',
      url: '/send',
      payload: {
        content: '<div>Hello</div>'
      }
    };
    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(400);
      Code.expect(response.result.message).to.equal('Invalid Parameters');
      server.stop();
      done();
    });
  });

  lab.test('GET /send should response 400 if content but contacts is empty', function(done) {
    var options = {
      method: 'POST',
      url: '/send',
      payload: {
        content: '<div>Hello</div>',
        contacts: []
      }
    };
    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(400);
      Code.expect(response.result.message).to.equal('Invalid Parameters');
      server.stop();
      done();
    });
  });
  lab.test('GET /send should response 400 if content but contacts is empty', function(done) {
    var options = {
      method: 'POST',
      url: '/send',
      payload: {
        content: '<div>Hello</div>',
        contacts: []
      }
    };
    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(400);
      Code.expect(response.result.message).to.equal('Invalid Parameters');
      server.stop();
      done();
    });
  });
});
