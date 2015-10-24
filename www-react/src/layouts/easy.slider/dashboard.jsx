var React      = require('react');
var MiniMeter  = require("../components/mini.meter.jsx");
var Flipcard   = require("../components/flipcard.jsx");
var Gauge      = require("../components/gauge.jsx");

var Dashboard = React.createClass({
    render: function() {
        return (
            <div>

                {/* battery voltmeter */}
                <div className="dash-header">
                    <JumboMeter 
                        id="jumboMeterBattery" 
                        title="Battery"
                        units="V" 
                        min="12" 
                        max="16.8" 
                        low="14" 
                        high="16.8" 
                        optimum="16.8" 
                        value="15" />
                </div>

                {/* small meters */}
                <div className="dash-top">
                    <MiniMeter 
                        id="miniMeterRegen" 
                        title="Regen" 
                        units="W" 
                        min="0" 
                        max="1000" 
                        low="0" 
                        high="1000" 
                        optimum="1000" 
                        value="10" />

                    <MiniMeter 
                        id="miniMeterThrottle" 
                        title="Throttle" 
                        units="%" 
                        min="0" 
                        max="100" 
                        low="0" 
                        high="100" 
                        optimum="0" 
                        value="50" />

                    <MiniMeter 
                        id="miniMeterMotorTemp" 
                        title="Motor (T)" 
                        units="C" 
                        min="0" 
                        max="120" 
                        low="0" 
                        high="120" 
                        optimum="0" 
                        value="80" />

                    <MiniMeter 
                        id="miniMeterControllerTemp" 
                        title="Control (T)" 
                        units="C" 
                        min="0" 
                        max="120" 
                        low="0" 
                        high="120" 
                        optimum="0" 
                        value="100" />
                </div>

                {/* speed & power gauges */}
                <div className="dash-center">
                    <Flipcard id="flipcard1">
                        <Gauge 
                            id="gaugeSpeed" 
                            title="Speed" 
                            units="Kph"   
                            min="0" 
                            max="100"  
                            value="0" />

                        <Gauge 
                            id="gaugePower" 
                            title="Power" 
                            units="Watts" 
                            min="0" 
                            max="9999" 
                            value="0" />
                    </Flipcard>
                </div>

                {/* simple telemetry */}
                <div className="dash-bottom">
                    &nbsp;
                </div>

                {/* trip odometer */}
                <div className="dash-footer">
                    <JumboMeter 
                        id="jumboMeterDistance" 
                        title="Distance"
                        units="km" 
                        min="0" 
                        max="200" 
                        low="0" 
                        high="200" 
                        optimum="0" 
                        value="50" />
                </div>
            </div>
        );
    }
});

module.exports = Dashboard;