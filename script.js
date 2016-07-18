// Device orientation links:
// * http://www.html5rocks.com/en/tutorials/device/orientation/
// * https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation

document.addEventListener('DOMContentLoaded', function(e) {

	var orientation = {
			alpha: 0, // bearing from north OR position when page opened (in Safari)
			beta: 90, // angle from horizontal
			gamma: 0 // horizontal rotation we can probably ignore?
		},
		monsterBearing = 0,
		monsterDistance = 100,
		monsterHeight = 0,
		ballBearing = 0,
		ballDistance = 0,
		ballMoving = false,
		ballHeight = -2.5,
		ballYSpeed = 0,
		ballZSpeed = 0,
		floorHeight = -10,
		gotOrientationData = false,
		monster = document.getElementById('monster'),
		label = document.getElementById('monster-label'),
		ball = document.getElementById('ball');

	if (window.DeviceOrientationEvent)
		window.addEventListener('deviceorientation', function(e) {
			// Things that aren't supported are null:
			for (var variable in orientation)
				if (e[variable] !== null)
					orientation[variable] = e[variable];
			// Put the monster in front of you when you open the page
			if (!gotOrientationData) {
				if (e.alpha !== null)
					monsterBearing = e.alpha;
				gotOrientationData = true;
			}
			console.log(orientation);
		});

	var lastTime = 0;
	requestAnimationFrame(update);
	function update(time) {
		var interval = time - lastTime;
		if (interval > 100)
			interval = 100;
		lastTime = time;

		pos3d(monster, monsterBearing, monsterDistance, monsterHeight, true);
		pos3d(label, monsterBearing, monsterDistance, monsterHeight + 1, false);
		pos3d(ball, ballBearing, ballDistance, ballHeight, true);

		// TODO - position & scale ball if it's flying

		// requestAnimationFrame(update);
	}

	// TODO - choose a monster to capture

	// TODO - detect touches and throw the ball

	// TODO - local storage so we know what you've seen before?

	// TODO - monster-dex

	function pos3d(layer, bearing, distance, height, doScale) {
		var coordScale = doScale ? 10 / (distance + 20) : 1,
			scale = doScale ? coordScale : 1,
			diff = bearing - orientation.alpha,
			z = Math.round(10000 - distance);
		if (diff < -180) diff += 360;
		else if (diff > 180) diff -= 360;
		layer.style.transform = 'scale(' + scale + ')';
		layer.style.left = 'calc(' +
			(diff * 30 * coordScale) + 'vw  - (' + layer.clientWidth + 'px / 2) + 50vw)';
		layer.style.top = 'calc(' +
			(-height * coordScale * 30) + 'vh - (' + layer.clientHeight + 'px / 2)  + 50vh)';
		if (z < 1)
			z = 1;
		layer.style.zIndex = z;
	}

});