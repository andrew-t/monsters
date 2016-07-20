/*
	References:
		http://www.html5rocks.com/en/tutorials/getusermedia/intro/
		https://simpl.info/getusermedia/sources/
		https://davidwalsh.name/browser-camera
*/

var canvas,
	video,
	dropdown,
	base64,
	form,
	overlay,
	screenElement;

window.addEventListener("DOMContentLoaded", function() {
	canvas = document.getElementById("canvas");
	video = document.getElementById("video");
	dropdown = document.getElementById('camera-select');

	window.addEventListener('resize', sizeThings);

	if (MediaStreamTrack && MediaStreamTrack.getSources)
		MediaStreamTrack.getSources(function(sources) {
			console.log(sources);
			var last = null;
			for (var i = 0; i !== sources.length; ++i) {
				var sourceInfo = sources[i];
				var option = document.createElement('option');
				option.value = sourceInfo.id;
				if (sourceInfo.kind === 'video') {
					option.text = sourceInfo.label || 'camera ' + (dropdown.length + 1);
					dropdown.appendChild(option);
					last = dropdown.value;
				} else
					console.log('Don\'t care about this: ', sourceInfo);
			}
			if (last)
				startCapture(last);
			dropdown.addEventListener('change', function(e) {
				console.log(dropdown.value);
				startCapture(dropdown.value);
				e.preventDefault();
			});
		});
	else {
		dropdown.classList.add('hidden');
		startCapture();
	}
});

function startCapture(source) {
	var opts = { video: source
			? { optional: [{ sourceId: source }] }
			: true
		};
	// Put video listeners into place
	if (navigator.getUserMedia) { // Standard
		navigator.getUserMedia(opts, function(stream) {
			video.src = stream;
			then();
		}, errBack);
	} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(opts, function(stream){
			video.src = window.webkitURL.createObjectURL(stream);
			then();
		}, errBack);
	/*} else if (navigator.mediaDevices) { // Firefox-prefixed
		navigator.mediaDevices.getUserMedia(opts, function(stream){
			video.src = window.URL.createObjectURL(stream);
			then();
		}, errBack);*/
	} else if (navigator.mozGetUserMedia) { // Firefox-prefixed
		navigator.mozGetUserMedia(opts, function(stream){
			video.src = window.URL.createObjectURL(stream);
			then();
		}, errBack);
	}

	video.onloadedmetadata = sizeThings;

	function then() {
		try {
			video.play();
		} catch (e) {
			var cta = document.getElementById('click-to-play');
			cta.classList.remove('hidden');
			cta.addEventListener('click', function(e) {
				cta.classList.add('hidden');
				video.play();
				e.preventDefault();
			});
		}
	}
}

function sizeThings() {
	video.width = window.innerWidth;
	video.height = window.innerHeight;
}

function errBack(error) {
	console.log("Video capture error: ", error); 
};