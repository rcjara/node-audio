define([], function() {
  var public = {}
    , userName = "Talking to yourself"
    , clientEvents = {}
    ;

  var trigger = function(eventType, e) {
    if (typeof clientEvents[eventType] === 'undefined') {
      return;
    }

    $.each(clientEvents[eventType], function(i, cb) {
      cb(e);
    });
  };

  public.emit = function(eventType, e) {
    switch(eventType) {
      case 'synth-event':
        trigger('synth-event', e);
        break;
      case 'disconnect':
        console.log('Mockserver: disconnect');
        console.log("Why was a disconnect called on this mock server?");
        break;
      case 'request-room':
        trigger('join-room', { text: "You are playing in local mode"
                             , room: "local" });
        break;
      case 'request-beat':
        trigger('set-beat', { bpm: 100
                            , officialTime: 0 });
      case 'chat-event':
        e.userName = userName;
        trigger('message', e);
        break;
      case 'set-username':
        userName = e.userName;
        break;
    }
  };

  public.connect = function() {
    trigger('connect', {});
    trigger('authorized', { clientID: "Local" } );
  };


  public.on = function(eventType, cb) {
    if (typeof clientEvents[eventType] === 'undefined') {
      clientEvents[eventType] = [cb];
    } else {
      clientEvents[eventType].push(cb);
    }
  };

  return public;
})
