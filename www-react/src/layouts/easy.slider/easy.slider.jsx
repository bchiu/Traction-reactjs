/*
    Easy Slider - simple layout with slide boxes
*/
var React = require('react');

var Dashboard  = require('dashboard.jsx');
var GoogleMaps = require('google.maps.jsx');
var Devices    = require('devices.jsx');

var Sliders    = require('../components/sliders.jsx');
var JumboMeter = require("../components/jumbo.meter.jsx");

var EasySlider = React.createClass({
    getInitialState() {
        return { 
            showDevicesModal: false 
        };
    },

    closeDevices() {
        this.setState({ showDevicesModal: false });
    },

    openDevices() {
        this.setState({ showDevicesModal: true });
    },

    toggleLock: function(event) {
    	this.refs.sliders.toggleLock(event);    	
    },

    render: function() {
		var title = this.props.title;

        return (
        	<div>
                <ToolBar style="height:10%" />

                <JumboMeter style="height:5%"
                    id="jumboMeterBattery" 
                    title="Battery"
                    units="V" 
                    min="12" 
                    max="16.8" 
                    low="14" 
                    high="16.8" 
                    optimum="16.8" 
                    value="15" />

		        <Sliders style="height:80%">
		            <Dashboard />
            		<GoogleMaps />
		        </Sliders>

                <JumboMeter style="height:5%"
                    id="jumboMeterDistance" 
                    title="Distance"
                    units="km" 
                    min="0" 
                    max="200" 
                    low="0" 
                    high="200" 
                    optimum="0" 
                    value="50" />

                {/* Bluetooth Devices Modal */}
                <Devices style="display:none" />
		    </div>
        );
    }
});

module.exports = EasySlider;