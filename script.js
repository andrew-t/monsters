// Device orientation links:
// * http://www.html5rocks.com/en/tutorials/device/orientation/
// * https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation

var monsterBearing = 0,
	monsterDistance = 100,
	monsterHeight = 0,
	ballStartDistance = 0,
	ballStartHeight = -2.5,
	ballDistantLimit = 150,
	throwPower = 10,
	ballDrag = 0.95,
	ballElasticity = .75,
	gravity = -.8;

document.addEventListener('DOMContentLoaded', function(e) {

	var orientation = {
			alpha: 0, // bearing from north OR position when page opened (in Safari)
			beta: 90, // angle from horizontal
			gamma: 0 // horizontal rotation we can probably ignore?
		},
		ballBearing = 0,
		ballDistance = ballStartDistance,
		ballHeight = ballStartHeight,
		ballMoving = false,
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
			// console.log(orientation);
		});

	var lastTime = 0;
	requestAnimationFrame(update);
	function update(time) {
		var interval = time - lastTime;
		if (interval > 100)
			interval = 100;
		lastTime = time;
		interval /= 100;

		pos3d(monster, monsterBearing, monsterDistance, monsterHeight, true);
		pos3d(label, monsterBearing, monsterDistance, monsterHeight + 1, false);
		pos3d(ball, ballBearing, ballDistance, ballHeight, true);

		// TODO - position & scale ball if it's flying
		if (ballMoving) {
			ballDistance += ballZSpeed * interval;
			ballHeight += ballYSpeed * interval;
			ballZSpeed *= Math.pow(ballDrag, interval);
			ballYSpeed = ballYSpeed * Math.pow(ballDrag, interval) + gravity * interval;
			if (ballDistance > ballDistantLimit) {
				ballDistance = ballStartDistance;
				ballHeight = ballStartHeight;
				ballMoving = false;
				ballYSpeed = 0;
				ballZSpeed = 0;
			}
			if (ballHeight < floorHeight && ballYSpeed < 0) {
				ballYSpeed = ballYSpeed * -ballElasticity;
				ballHeight = floorHeight;
			}
			// console.log('d = ' + ballDistance, 'h = ' + ballHeight);
		} else {
			ballBearing = orientation.alpha;
		}

		requestAnimationFrame(update);
	}

	// TODO - choose a monster to capture

	// TODO - detect touches and throw the ball
	ball.addEventListener('click', function (e) {
		console.log('throw requested')
		if (!ballMoving) {
			console.log('throw granted')
			ballYSpeed = 4;
			ballZSpeed = throwPower;
			ballBearing = orientation.alpha;
			ballMoving = true;
		}
	});

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
			(-height * coordScale * 30) + 'vh - (' + layer.clientHeight + 'px / 2) + ' + Math.tan(orientation.beta) * 10 + 'vh + 50vh)';
		if (z < 1)
			z = 1;
		layer.style.zIndex = z;
	}

});