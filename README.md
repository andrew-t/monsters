# [Monsters](https://andrew-tls.github.io/monsters)
A wholly-original AR monster-catching game.

## Gameplay
There is a monster in front of you. Aim by angling your phone toward it; tap the ball to throw it at the monster. If you hit, you catch the monster and may get chance to evolve it into a better one. When you are done, you can return to AR to catch another monster.

## Requirements

### Video Capture
The AR component uses the video-capture API, which is only available over HTTPS. [Github Pages does offer HTTPS, but not for custom domains](https://help.github.com/articles/securing-your-github-pages-site-with-https/), so my main [github.andrewt.net](https://github.andrewt.net) domain will not work. Therefore, I have created a Github org, [`andrew-tls`](https://github.com/andrew-tls) to host [`monsters`](https://andrew-tls.github.io/monsters).

Further, Safari on iOS does not support this API and so iDevices cannot play `monsters`.

Currently the video capture does not work in Firefox for Android.

## Accelerometers
Obviously only a mobile device will usually support the orientation APIs, so this is unlikely to work well on your laptop.

## Submitting monsters
Simply provide a PNG with transparency, a name and a type, as well as what it evolves from and/or into. If it's a pull request with [`data.js`](data.js) updated for me then so much the better.
