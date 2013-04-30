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

    it("keeps track of multiple clients' lag times", function(done) {
      var client1 = new ClientMock()
        , client2 = new ClientMock()
        ;

      client1.respondTo('lag-query', function(e) {
        var that = this;
        setTimeout(function() {
          that.events['lag-response'](e);
        }, Math.random() * 3 + 4);
      });

      client2.respondTo('lag-query', function(e) {
        var that = this;
        setTimeout(function() {
          that.events['lag-response'](e);
        }, Math.random() * 3);
      });

      var lagDetector = new LagDetector();
      lagDetector.setIntervalLength(10)
                 .addClient(client1)
                 .addClient(client2)
                 .start();

      setTimeout(function() {
        expect(lagDetector.getLag(client1))
              .to.be.within(4, 8);
        expect(lagDetector.getLag(client2))
              .to.be.within(0, 4);

        lagDetector.stop();
        done();
      }, 100);
    });
  });

  describe('.getStdDev()', function() {
    it('computes a standard deviation', function(done) {
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
        expect(lagDetector.getStdDev(mock))
              .to.be.within(0.1, 5);

        lagDetector.stop();
        done();
      }, 100);
    });
  });


});
