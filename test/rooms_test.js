var expect = require('expect.js')
  , _ = require('underscore')
  , rooms = require('../lib/rooms.js')
  , namingScheme = require('../lib/naming-scheme.js')
  ;

rooms.setNamingScheme(namingScheme);

describe('Rooms', function() {
  beforeEach(function() {
    rooms.reset();
    rooms.setSockets({
      clients: function(name) { return ['a','b','c']; }
    });
  });

  describe('Actual interface', function() {
    describe('.generateRoom', function() {
      it('generates unique room names with each call', function() {
        var results = [];
        for (var i = 0; i < 4; i++) {
          var result = rooms.generateRoom();

          expect(results.length) // make sure we are storing the results
                .to.equal(i);

          expect(_.indexOf(results.name)) // make sure no result is duplicated
                .to.equal(-1);

          results.push(result.name);
        }
      });

      it('generates rooms with default capacity', function() {
        var room = rooms.generateRoom();
        expect(room)
              .to.have.property('capacity', 4);
      });

      it('generates unique room objects', function() {
        var room1 = rooms.generateRoom()
          , room2 = rooms.generateRoom()
          ;

        room1.capacity = room1.capacity + 1;

        expect(room1.capacity)
              .to.not.equal(room2.capacity);
      });
    });

    describe('.firstAvailable', function() {
      it('creates a new room if no rooms exist', function() {
        expect(rooms.firstAvailable().name.length)
              .to.be.greaterThan(0);
      });

      describe('with three rooms', function() {
        var room1, room2, room3;

        beforeEach(function() {
          room1 = rooms.generateRoom();
          room2 = rooms.generateRoom();
          room3 = rooms.generateRoom();
        });

        var fullSocketMock = {
          clients: function() { return Infinity; }
        };

        var emptySocketMock = {
          clients: function() { return 0; }
        };

        it('finds the available room', function() {
          room1.capacity = 3;
          room2.capacity = 3;

          var foundRoom = rooms.firstAvailable();

          expect(foundRoom.name)
                .to.equal(room3.name);
        });

        it('generates a new room if all rooms are already at capacity', function() {
          room1.capacity = 3;
          room2.capacity = 3;
          room3.capacity = 3;

          var foundRoom = rooms.firstAvailable();

          expect(foundRoom.name)
                .to.not.equal(room1.name);
          expect(foundRoom.name)
                .to.not.equal(room2.name);
        });
      });
    });
  });
});
