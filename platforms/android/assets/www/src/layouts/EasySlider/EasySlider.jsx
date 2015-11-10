/*
    Easy Slider - simple responsive layout that works with very small devices 
*/
var React      = require('react');
var Radium     = require('radium');
var Dashboard  = require('./Dashboard');
var ToolBar    = require('./Toolbar');
var GoogleMap  = require('../../components/GoogleMap');
var Sliders    = require('../../components/Sliders');
var JumboMeter = require('../../components/JumboMeter');

module.exports = Radium(React.createClass({
 
    lockSlider: function() {
    	this.refs.sliders.lock();
    },

    render: function() {
        var params = this.props.params;
        var data   = this.props.data;

        return (
        	<div style={{ height:'100%' }}>
                <div style={{ height:'10%' }}>

                    <ToolBar 
                        title={this.props.title}
                        showDevices={this.props.showDevices} 
                        deviceConnected={this.props.deviceConnected} />

                </div>

                <div style={{ height:'5%' }}>

                    <JumboMeter descend={true} 
                        params={params.battery_voltage}
                        value={data.battery_voltage} />

                </div>

                <div style={{ height:'80%' }}>

    		        <Sliders ref="sliders"
                        onTouchStart={this.props.onTouchStart}
                        onTouchEnd={this.props.onTouchEnd}>

                        <Dashboard data={data} params={params} />

                        <div style={{ height:'100%' }}>

                            <GoogleMap />
                            
                            <Sliders.Lock onToggle={this.lockSlider} />

                        </div>

    		        </Sliders>

                </div>

                <div style={{ height:'5%' }}>

                    <JumboMeter
                        params={params.odometer_km}
                        value={data.odometer_km} />

                </div>
		    </div>
        );
    }
}));
