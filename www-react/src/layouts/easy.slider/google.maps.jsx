var React = require('react');

var GoogleMaps = React.createClass({
    render: function() {
        return (
        	<div>
	            <div id="maps-canvas"></div>
    	        <button id="lockSwiperButton" class="maps-button swiper-unlocked"></button>
    	    </div>
        );
    }
});

module.exports = GoogleMaps;