var expect = require('expect.js')
  , _ = require('underscore')
  , rooms = require('../lib/rooms.js')
  ;

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
      // 26 chosen so that it ends up incrementing the last name
      for (var i = 0; i < 26; i++) {
        var result = rooms.generateRoom();

        expect(results.length) // make sure we are storing the results
              .to.equal(i);

        expect(_.indexOf(results)) // make sure no result is duplicated
              .to.equal(-1);

        results.push(result);
      }
    });
  });

  describe('a generated room', function() {
    var roomName;

    beforeEach( function() {
      roomName = rooms.generateRoom();
    });

    it('has the default capacity', function() {
      expect(rooms.room(roomName))
            .to.have.property('capacity', 4);
    });
  });
});

