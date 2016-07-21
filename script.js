// Device orientation links:
// * http://www.html5rocks.com/en/tutorials/device/orientation/
// * https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation

var monsterBearing = 0,
	monsterDistance = 100,
	monsterHeight = -20,
	ballStartDistance = 0,
	ballStartHeight = -5,
	ballDistantLimit = 150,
	floorHeight = -30,
	throwPower = 10,
	ballDrag = 0.95,
	ballElasticity = .75,
	frameskip = 3,
	gravity = -.3;

document.addEventListener('DOMContentLoaded', function(e) {

	var orientation = {
			alpha: 0, // bearing from north OR position when page opened (in Safari)
			beta: 65, // angle from horizontal
			gamma: 0 // horizontal rotation we can probably ignore?
		},
		ballBearing = 0,
		ballDistance = ballStartDistance,
		ballHeight = ballStartHeight,
		ballMoving = false,
		ballYSpeed = 0,
		ballZSpeed = 0,
		whichMonster,
		inGame = true;
		gotOrientationData = false,
		monster = document.getElementById('monster'),
		label = document.getElementById('monster-label'),
		ball = document.getElementById('ball');

	if (window.DeviceOrientationEvent) {
		var orientationHistory = [],
			orientationHistoryPointer = 0;
		window.addEventListener('deviceorientation', function(e) {
			var snapshot = {}, variable;
			// Things that aren't supported are null:
			for (variable in orientation)
				snapshot[variable] = (e[variable] !== null) 
					? e[variable]
					: orientation[variable];
			// Put the monster in front of you when you open the page
			if (!gotOrientationData) {
				if (e.alpha !== null)
					monsterBearing = e.alpha;
				gotOrientationData = true;
			}
			// console.log(orientation);
			orientationHistory[orientationHistoryPointer] = snapshot;
			if (++orientationHistoryPointer >= 8)
				orientationHistoryPointer = 0;
			var count = 0;
			orientation = { alpha: 0, beta: 0, gamma: 0 };
			orientationHistory.forEach(function(o) {
				// forEach skips undefined values
				++count;
				for (variable in orientation)
					orientation[variable] += o[variable];
			});
			for (variable in orientation)
				orientation[variable] /= count;
		});
	}

	function chanceEncounter() {
		var i = Math.random();
		whichMonster = null;
		for (var j = 0; !whichMonster; ++j) {
			if (i -= window.monsterArray[j] < 0)
				whichMonster = window.monsterArray[j];
			if (j >= window.monsterArray.length)
				// this shouldn't happen but why risk it?
				j = 0;
		}
		monster.classList.remove('hidden');
		label.classList.remove('hidden');
		ball.classList.remove('hidden');
		label.innerText = whichMonster.name + ' / ' +
			Math.floor(Math.random() * 100 + 10) + 'CP';
		monster.style.backgroundImage =
			"url('" + whichMonster.imageUrl + "')";
	}
	chanceEncounter();

	var lastTime = 0, frameskipPointer = 0;
	requestAnimationFrame(update);
	function update(time) {
		if (frameskipPointer++ >= frameskip) {
			frameskipPointer = 0;
			return requestAnimationFrame(update);
		}
		if (!inGame)
			return;

		var interval = time - lastTime;
		if (interval > 100)
			interval = 100;
		lastTime = time;
		interval /= 100;

		pos3d(monster, monsterBearing, monsterDistance, monsterHeight, true);
		pos3d(label, monsterBearing, monsterDistance, monsterHeight + 15, false);
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

			if (ballDistance >= monsterDistance) {
				var error = Math.abs(ballBearing - monsterBearing);
				// 8.5º is about where you start to miss:
				if (error < 8.5 || error > 361.5) {
					console.log('You caught it!');
					ball.classList.add('hidden');
					monster.classList.add('hidden');
					label.classList.add('hidden');
					// todo - pop something up
					inGame = false;
				}
			}
		} else {
			ballBearing = orientation.alpha;
		}

		requestAnimationFrame(update);
	}

	// TODO - choose a monster to capture

	// detect touches and throw the ball
	// TODO - require some kind of skill? maybe?
	ball.addEventListener('click', function (e) {
		console.log('throw requested')
		if (!ballMoving) {
			console.log('throw granted')
			ballYSpeed = 1;
			ballZSpeed = throwPower;
			ballBearing = orientation.alpha;
			ballMoving = true;
			console.log('ball bearing = ' + ballBearing);
			console.log('monster bearing = ' + monsterBearing);
		}
	});

	// TODO - local storage so we know what you've seen before?

	// TODO - monster-dex

	function pos3d(layer, bearing, distance, height, doScale) {
		var coordScale = 10 / (distance + 20),
			scale = doScale ? coordScale : 1,
			diff = bearing - orientation.alpha,
			z = Math.round(10000 - distance);
		if (diff < -180) diff += 360;
		else if (diff > 180) diff -= 360;
		layer.style.transform = 'scale(' + scale + ')';

		var bearingComponent = (diff * -30 * coordScale);
		layer.style.left = 'calc(' +
			bearingComponent + 'vw  - (' + layer.clientWidth + 'px / 2) + 50vw)';
		// console.log('x - bearing: ', bearingComponent);

		var heightComponent = (-height * coordScale * 30),
			betaComponent = Math.tan((orientation.beta - 90) * Math.PI / 180) * 100;
		layer.style.top = 'calc(' +
			heightComponent + 'vh - (' + layer.clientHeight + 'px / 2) + ' +
			betaComponent + 'vh + 50vh)';
		// console.log('y - height: ', heightComponent);
		// console.log('y - beta: ', betaComponent);

		if (z < 1)
			z = 1;
		layer.style.zIndex = z;
	}

});