var expect = require('expect.js')
  , _ = require('underscore')
  , Room = require('../lib/room.js')

describe('Room', function() {
  var room
    , defaultAttr = { name: 'roomName', capacity: 4}
    ;

  describe('new Room()', function() {
    beforeEach(function() {
      room = new Room(defaultAttr);
    });

    it('sets capacity', function() {
      expect(room).to.have.property('capacity', 4);
    });

    it('sets name', function() {
      expect(room).to.have.property('name', 'roomName');
    });
  });

  describe('available()', function() {
    var socketMock;

    describe('with sockets that return no clients', function() {
      beforeEach(function() {
        socketMock = { clients: function() { return []; } };
        room = new Room(defaultAttr, socketMock);
      });

      it('returns true', function() {
        expect( room.isAvailable() ).to.equal(true);
      });
    });

    describe('with sockets that return four clients', function() {
      beforeEach(function() {
        socketMock = { clients: function() { return [1, 2, 3, 4]; } };
        room = new Room(defaultAttr, socketMock);
      });

      it('returns true', function() {
        expect( room.isAvailable() ).to.equal(false);
      });
    });
  });

  describe('getDelay()', function() {
    var lagDetectorMock
      , socketMock
      ;

    describe('with sockets and very predictable lag', function() {
      beforeEach(function() {
        socketMock = { clients: function() { return [1, 2, 3, 4]; } };
        lagDetectorMock = { getLag: function(client) {
                                      return client + 2;
                                    }
                          , getStdDev: function(client) {
                                         return 0;
                                       }
                          }

        room = new Room(defaultAttr, socketMock);
      });

      it('returns a delay equal to the longest lag', function() {
        expect( room.getDelay(lagDetectorMock) ).to.equal(6);
      });
    });
  });
});
