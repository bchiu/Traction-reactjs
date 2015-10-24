// Cordova device info
function getDeviceInfo() {
	return 	{  
		platform:   device.platform,
    	version:    device.version,
    	uuid: 	    device.uuid, 
    	name: 	    device.name,
    	width: 	    screen.width, 
    	height:     screen.height, 
    	colorDepth: screen.colorDepth
    }
}

// Function gets point(x,y) on circle at given angle
function getPointOnCircle(r, cx, cy, angle) {
	var x = cx + r * Math.sin(angle * Math.PI/180);
	var y = cy - r * Math.cos(angle * Math.PI/180);
	return { x: x, y: y };	
}

function randInt(ceiling) {
	return Math.round(Math.random() * ceiling);
}

function randFloat(floor, ceiling, decimals) {
	return parseFloat(Math.random().map(0, 1, floor, ceiling).toFixed(decimals));
}

function setToggleButtonState(id, state) {
	var suffix = (state) ? "On" : "Off";
	$("#" + id).attr("class", id + suffix);
}

function setCycleButtonState(id, state) {
	$("#" + id).attr("class", id + state);
}

Number.prototype.map = function (in_min, in_max, out_min, out_max ) {
	return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

// Flip views on click
FlipCard = function(id) {
	this.card = $("#" + id);

	this.card.click(function() { 
		this.card.toggleClass('flipped'); 
	}.bind(this));

	this.isFlipped = function() {
		return this.card.hasClass('flipped');
	};
}

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
