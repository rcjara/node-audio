var expect = require('expect.js')
  , _ = require('underscore')
  , LagDetector = require('../lib/lag-detector.js')
  , ClientMock = require('./client-mock.js')
  ;

describe('LagDetector', function() {

  describe('.getLag()', function() {
    it('initally has no lag', function() {
      var lagDetector = new LagDetector();
      var mock = new ClientMock();

      lagDetector.addClient(mock);
      expect(isNaN(lagDetector.getLag(mock)))
            .to.equal(true);
    });

    it('aggregates lagless data', function(done) {
      var mock = new ClientMock();

      var lagDetector = new LagDetector();
      lagDetector.setIntervalLength(10)
                 .addClient(mock)
                 .start();

      mock.respondTo('lag-query', function(e) {
        this.events['lag-response'](e)
      });

      lagDetector.start();
      lagDetector

      setTimeout(function() {
        expect(mock.counter['lag-query'])
              .to.be.greaterThan(5);
        expect(lagDetector.getLag(mock))
              .to.be.lessThan(2);

        lagDetector.stop();
        done();
      }, 100);
    });

    it('aggregates lagging data', function(done) {
      var mock = new ClientMock();

      var lagDetector = new LagDetector();
      lagDetector.setIntervalLength(10)
                 .addClient(mock)
                 .start();

      mock.respondTo('lag-query', function(e) {
        var that = this;
        setTimeout(function() {
          that.events['lag-response'](e);
        }, Math.random() * 5 + 5);
      });

      setTimeout(function() {
        expect(mock.counter['lag-query'])
              .to.be.greaterThan(5);
        expect(lagDetector.getLag(mock))
              .to.be.within(5, 12);

        lagDetector.stop();
        done();
      }, 100);
    });

  });
});
