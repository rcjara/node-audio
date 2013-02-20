var expect = require('expect.js')
  , _ = require('underscore')
  , rooms = require('../lib/rooms.js')
  ;

describe('Rooms', function() {
  beforeEach(function() {
    rooms.reset();
  });

  describe('Implementation Details', function() {
    describe('.nameForID',function() {
      it('room names from integers',function(){
        expect(rooms.nameForID(0))
              .to.equal('yellow-elephant-hoarders');
      });

      it('produces unique results for different keys', function() {
        var results = [];
        for (var i = 0; i < 6; i++) {
          var j = i + 20; //look at an interesting range that causes all 3 names to rotate over
          var result = rooms.nameForID(j);

          expect(results.length) // make sure we are storing the results
                .to.equal(i);

          expect(_.indexOf(results)) // make sure no result is duplicated
                .to.equal(-1);

          results.push(result);
        }
      });
    });

    describe('.convertFromName', function() {
      it('converts valid names to integers', function() {
        expect(rooms.convertFromName('yellow-elephant-hoarders'))
              .to.equal(0);
      });

      it('can get back the integer used to generate any valid name', function() {
        for(var i = 0; i < 26; i++) {
          var name = rooms.nameForID(i);
          var num  = rooms.convertFromName(name);

          expect(num)
                .to.equal(i);
        }
      });
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
      it('returns null if no rooms exist', function() {
        expect(rooms.firstAvailable())
              .to.equal(null);
      });

      describe('with three rooms', function() {
        var room1, room2, room3;

        beforeEach(function() {
          room1 = rooms.generateRoom();
          room2 = rooms.generateRoom();
          room3 = rooms.generateRoom();
        });

        it('finds the available room', function() {
          room1.occupancy = function() { return 1000; }
          room2.occupancy = function() { return 1000; }
          room3.occupancy = function() { return 2; }

          var foundRoom = rooms.firstAvailable();

          expect(foundRoom.name)
                .to.equal(room3.name);
        });

        it('returns null if no rooms are below capacity', function() {
          room1.occupancy = function() { return 1000; }
          room2.occupancy = function() { return 1000; }
          room3.occupancy = function() { return 2; }

          var foundRoom = rooms.firstAvailable();

          expect(foundRoom.name)
                .to.equal(room3.name);
        });
      });
    });
  });
});
