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

