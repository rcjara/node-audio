var expect = require('expect.js')
  , _ = require('underscore')
  , namingScheme = require('../lib/naming-scheme.js')
  ;

describe('Naming Scheme', function() {
  beforeEach(function() {
    namingScheme.reset();
  });

  describe('Implementation Details', function() {
    describe('.nameForID',function() {
      it('room names from integers',function(){
        expect(namingScheme.nameForID(0))
              .to.equal('yellow-elephant-hoarders');
      });

      it('produces unique results for different keys', function() {
        var results = [];
        for (var i = 0; i < 6; i++) {
          var j = i + 20; //look at an interesting range that causes all 3 names to rotate over
          var result = namingScheme.nameForID(j);

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
        expect(namingScheme.convertFromName('yellow-elephant-hoarders'))
              .to.equal(0);
      });

      it('can get back the integer used to generate any valid name', function() {
        for(var i = 0; i < 26; i++) {
          var name = namingScheme.nameForID(i);
          var num  = namingScheme.convertFromName(name);

          expect(num)
                .to.equal(i);
        }
      });
    });

    describe('.nextName', function() {
      it('generates unique room names with each call', function() {
        var results = [];
        for (var i = 0; i < 4; i++) {
          var result = namingScheme.next();

          expect(results.length) // make sure we are storing the results
                .to.equal(i);

          expect(_.indexOf(results)) // make sure no result is duplicated
                .to.equal(-1);

          results.push(result);
        }
      });
    });
  });
});

