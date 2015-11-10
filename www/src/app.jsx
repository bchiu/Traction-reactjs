/*
    Traction - main entry point, data loop, init layout 
*/
var React     = require('react');
var ReactDOM  = require('react-dom');
var Looper    = require('./helpers/Looper');
var Util      = require('./helpers/Util');
var Devices   = require('./components/Devices');
var AppMenu   = require('./components/AppMenu');
//var ProtoBuf  = require('protobufjs');

var Traction = React.createClass({

    getInitialState: function() {
        window.dev = !window.cordova;

        this.config = this.props.config;  // config alias
        this.params = this.config.params; // data parameters

        // disable device sleep
        this.enableWakeLock();

        // set controller & bind data
        this.bldc = this.props.model;
        this.data = this.dataFrame();
        this.bldc.bindData(this.data);

        return {
            data: this.data,
            layout: this.config.layout,
            deviceConnected: false,
        }
    },

    componentDidMount: function() {
        // material ui fx
        $.material.init();

        // data refresh rate
        var fps = this.config.fps;

        // data update loop
        this.looper = new Looper(fps, function() {

            // mock ui test
            //this.mockData(); // for ui testing

            // send serial request
            if (this.state.deviceConnected) {
                this.bldc.requestData();
            }

            // commit data updates to state
            this.setState({ data: this.data });

            this.logData(this.data);

        }.bind(this));

        //this.looper.start(); // for ui testing
    },

    render: function() {
        var Layout = require('./layouts/' + this.state.layout + '/' + this.state.layout);

        return (
            <div style={{ height:'100%'}}>
                <Layout
                    title={this.config.title}
                    data={this.state.data}
                    params={this.params}
                    showDevices={this.showDevices}
                    deviceConnected={this.state.deviceConnected}
                    onTouchStart={this.onTouchStart}
                    onTouchEnd={this.onTouchEnd} />

                <Devices ref="devices" 
                    onConnect={this.onDeviceConnect} 
                    onDisconnect={this.onDeviceDisconnect} />
            </div>
        )
    },

/* component callbacks *******************************************************/

    showDevices: function() {
        this.refs.devices.showModal();
        this.looper.stop();
    },

    onDeviceConnect: function() {
        this.setState({ deviceConnected: true })
        this.bldc.startListening();
        this.looper.start();
    },

    onDeviceDisconnect: function() {
        this.setState({ deviceConnected: false })
        this.bldc.stopListening();
        this.looper.stop();
    },

    onTouchStart: function() {
        this.looper.stop();
    },

    onTouchEnd: function() {
        this.looper.start();
    },

/* instance methods **********************************************************/

    enableWakeLock: function() {
        document.addEventListener('deviceready', function() {
            window.powerManagement.acquire(
                function() { console.info('Wakelock acquired') }, 
                function() { console.warn('Failed to acquire wakelock') }
            );
        });
    },

    setLayout: function(name) {
        setState({ layout: name }); // change layout on-the-fly
    },

    dataFrame: function() {
        var data = {}
        for (var key in this.params) {
            var min = this.params[key].min;
            data[key] = (min < 0) ? 0 : min; // init with positive values
        }
        return data;
    },

    logData: function() {
    },

    mockData: function() {
        if (this.fwd === undefined) this.fwd = {};

        for (var key in this.data) {
            if (this.fwd[key] === undefined) this.fwd[key] = true;

            var min  = this.params[key].min;
            var max  = this.params[key].max;
            var step = this.params[key].step/3;

            if (this.fwd[key]) {
                this.data[key] += step;
                if (this.data[key] + step >= max) this.fwd[key] = false; 
            } else {
                this.data[key] -= step;
                if (this.data[key] - step <= min) this.fwd[key] = true; 
            }
        }
    }
});


/* Run app *******************************************************************/


var Config = require('../traction.config.js');

var Model  = require('./models/' + Config.model + '/' + Config.model + '.js');

var appdom = document.getElementById('app');

ReactDOM.render(<Traction model={Model} config={Config} />, appdom);
