// UI update looper
Looper = function(fps, onUpdate) {
  	this.fps = fps;
	this.onUpdate = onUpdate;
	this.paused = true;

	$(window).blur(function() {
		this.stop();
	}.bind(this));

	$(window).focus(function() {
		this.start();
	}.bind(this));

	this.setPause = function(id) {
	    $("#" + id).dblclick(function() {
	        if (this.paused) this.start();
	        else this.stop();
	    }.bind(this));
	};

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
		//console.log(document.title + " started");
	};

	this.stop = function() {
		this.paused = true;
		//console.log(document.title + " stopped");
	};
}
