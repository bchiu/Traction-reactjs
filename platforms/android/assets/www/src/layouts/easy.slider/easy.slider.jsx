/*
    Easy Slider - simple layout with slide boxes
*/
var React      = require('react');
var Radium     = require('radium');
var Dashboard  = require('./dashboard.jsx');
var GoogleMaps = require('./google.maps.jsx');
var Devices    = require('./devices.jsx');
var ToolBar    = require('./toolbar.jsx');
var Sliders    = require('../../components/sliders.jsx');
var JumboMeter = require('../../components/jumbo.meter.jsx');

var EasySlider = React.createClass({
 
    showDevices: function() {
        this.refs.devices.showModal();
    },

    lockSlider: function() {
    	this.refs.sliders.lock();
    },

    render: function() {
        var data = this.props.data;

        return (
        	<div style={{ height:'100%' }}>
                <div style={{ height:'10%' }}>
                    <ToolBar 
                        title={this.props.title}
                        showDevices={this.showDevices} 
                        deviceConnected={this.props.deviceConnected} />
                </div>

                <div style={{ height:'5%' }}>
                    <JumboMeter 
                        title="Battery"
                        units="V" 
                        min="12" 
                        max="16.8" 
                        low="13" 
                        high="15" 
                        optimum="16.8" 
                        precision="1"
                        value={data.v_in} />
                </div>

                <div style={{ height:'80%' }}>
    		        <Sliders 
                        ref="sliders"
                        onTouchStart={this.props.onTouchStart}
                        onTouchEnd={this.props.onTouchEnd}>

                        <Dashboard data={data} />
                        <div style={{ height:'100%' }}>
                            <GoogleMaps />
                            <Sliders.Lock onToggle={this.lockSlider} />
                        </div>
    		        </Sliders>
                </div>

                <div style={{ height:'5%' }}>
                    <JumboMeter
                        title="Distance"
                        units="km" 
                        min="0" 
                        max="200" 
                        low="150" 
                        high="100" 
                        optimum="0" 
                        precision="1"
                        value={data.odometer} />
                </div>

                <Devices ref="devices" 
                    onConnect={this.props.onDeviceConnect} 
                    onDisconnect={this.props.onDeviceDisconnect} />
		    </div>
        );
    }
});

module.exports = Radium(EasySlider);