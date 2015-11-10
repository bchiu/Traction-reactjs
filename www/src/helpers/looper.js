/*
	data updater and ui looper
*/
module.exports = function(fps, onUpdate) {

	var requestAnimationFrame = window.requestAnimationFrame
	    || window.webkitRequestAnimationFrame
	    || window.mozRequestAnimationFrame
	    || window.msRequestAnimationFrame
	    || function(callback) { return setTimeout(callback, 1000 / fps) };

  	this.fps = fps;
	this.onUpdate = onUpdate;
	this.paused = true;

	if (window.dev) {
		$(window).blur(function() {
			this.stop();
		}.bind(this));

		$(window).focus(function() {
			this.start();
		}.bind(this));
	}

	this.update = function() {
		setTimeout(function() {
			if (this.paused) return;
		   	requestAnimationFrame(this.update);
		   	this.onUpdate();
		}.bind(this), 1000 / this.fps);
	}.bind(this);

	this.start = function() {
		this.paused = false;
		this.update();
	};

	this.stop = function() {
		this.paused = true;
	};
}
