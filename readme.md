## Jam-r

This is a music app that allows people to play synthesized music with each other collaboratively over the internet.

It is an express app which makes heavy use of socket.io and the webaudio api.  As of this writing, that means that it is restricted to webkit browsers.

It is still a work in progress, but interesting technical features include

- Attempts to deal with lag.  Small amounts of lag that most apps can shrug off become major issues when attempting to make music line up with a beat.  Adding to the issue is that freely available hosting services (Heroku, nodejitsu, etc.) have particularly unpredictable lag.

- A music library that allows the easy changing of keys, modes, and the building of chords in any key with very little code.
