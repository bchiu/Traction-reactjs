var React      = require('react');
var ReactDOM   = require('react-dom');
var DataFrame  = require('./models/common/DataFrame');
var Vesc       = require('./models/vesc/Vesc');
var Looper     = require('./helpers/Looper');
var Util       = require('./helpers/Util');
var EasySlider = require('./layouts/EasySlider/EasySlider');
var SubMission = require('./layouts/SubMission/SubMission');
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

        return {
            deviceConnected: false,
            data: this.data
        }
    },

    componentDidMount: function() {
        $.material.init();

        // data update loop
        this.looper = new Looper(15, function() {

            if (window.dev) this.data.randomize();        // randomize data for debug
            else if (!this.state.deviceConnected) return; // disconnected, exit loop
            else this.bldc.requestValues();               // send serial request

            this.setState({ data: this.data }) // commit data updates to state

        }.bind(this));

        //if (window.dev) this.looper.test('app');
    },

    enableWakeLock: function() {
        document.addEventListener('deviceready', function() {
            window.powerManagement.acquire(
                function() { console.warn('Wakelock acquired') }, 
                function() { console.warn('Failed to acquire wakelock') }
            );
        });
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

    render: function() {
        return (
            <this.props.layout
                title="Traction" 
                data={this.state.data}                
                deviceConnected={this.state.deviceConnected}
                onDeviceConnect={this.onDeviceConnect}
                onDeviceDisconnect={this.onDeviceDisconnect} 
                onTouchStart={this.onTouchStart}
                onTouchEnd={this.onTouchEnd} />
        )
    }
});


//var layout = EasySlider;
var layout = SubMission;
ReactDOM.render(<Traction layout={layout} />, document.getElementById('app'));
