var React      = require('react');
var ReactDOM   = require('react-dom');
var EasySlider = require('./layouts/easy.slider/easy.slider.jsx');
var DataFrame  = require('./models/common/data.frame.js');
var Vesc       = require('./models/vesc/vesc.js');
var Looper     = require('./helpers/looper.js');
var Util       = require('./helpers/util.js');
//var ProtoBuf   = require('protobufjs');

var Traction = React.createClass({

    getInitialState: function() {
        window.dev = !window.cordova;

        // disable device sleep
        this.enableWakeLock();

        // set controller
        this.bldc = Vesc;

        // bind data to controller
        this.data = new DataFrame();
        this.bldc.bindData(this.data);

        // data update loop
        this.looper = new Looper(15, function() {

            // send serial request
            this.bldc.requestValues();

            // randomize data for debug
            if (window.dev) this.data.randomize();

            // commit data updates to state
            this.setState({ data: this.data })

        }.bind(this));

        return {
            deviceConnected: false,
            data: this.data
        }
    },

    enableWakeLock: function() {
        document.addEventListener('deviceready', function() {
            window.powerManagement.acquire(function() {
                console.log('Wakelock acquired');
            }, function() {
                console.log('Failed to acquire wakelock');
            });
        });
    },

    componentDidMount: function() {
        $.material.init();
        if (window.dev) this.looper.test('app');
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

    render: function() {
        return (
        	<EasySlider 
        		title="Traction" 
        		data={this.state.data}
        		deviceConnected={this.state.deviceConnected}
        		onDeviceConnect={this.onDeviceConnect}
        		onDeviceDisconnect={this.onDeviceDisconnect} />
        )
    }
});

var App = React.createFactory(Traction);
ReactDOM.render(App(), document.getElementById('app'));
