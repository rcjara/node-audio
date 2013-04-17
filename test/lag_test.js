var expect = require('expect.js')
  , _ = require('underscore')
  , lagDetector = require('../lib/lag-detector.js')
  , ClientMock = require('./client-mock.js')
  ;

describe('LagDetector', function() {
  beforeEach(function() {
    lagDetector.reset()
               .setIntervalLength(10)
               .start();
  });

  describe('.getLag()', function() {
    it('initally has no lag', function() {
      var mock = new ClientMock();

      lagDetector.addClient(mock);
      expect(isNaN(lagDetector.getLag(mock)))
            .to.equal(true);
    });

    it('aggregates random data', function(done) {
      var mock = new ClientMock();
      mock.respondTo('lag-query', function(e) {
        this.events['lag-response'](e)
      });

      lagDetector.start();
      lagDetector.addClient(mock);

      setTimeout(function() {
        expect(mock.counter['lag-query'])
              .to.be.greaterThan(5);
        expect(lagDetector.getLag(mock))
              .to.be.lessThan(1);
        done();
      }, 100);
    });
  });

  afterEach(function() {
    lagDetector.stop();
  });
});
