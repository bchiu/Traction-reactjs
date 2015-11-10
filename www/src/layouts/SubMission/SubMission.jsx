/*
    Sub Mission - tribute to the Mission-R motorcycle which has now gone under
*/
var React      = require('react');
var Radium     = require('radium');
var Blinkers   = require('../../components/Blinkers');
var Toolbar    = require('./Toolbar');
var Backdrop   = require('./Backdrop');
var Console    = require('./Console');
var Dashboard  = require('./Dashboard');

module.exports = Radium(React.createClass({
 
    getInitialState: function() {
        document.addEventListener('deviceready', function() {
            screen.lockOrientation('landscape');
        });
        
        return {}
    },

    render: function() {
        var params = this.props.params;
        var data   = this.props.data;

        return (
        	<div style={styles.submission}>
                <img src="img/mission.png" style={styles.mission} />

                <Backdrop />

                <div style={{ height:'6%' }}>
                    <Toolbar
                        showDevices={this.props.showDevices}
                        deviceConnected={this.props.deviceConnected} />
                </div>

                <div style={{ height:'68%' }}>
                    <Dashboard
                        params={this.props.params}
                        data={this.props.data} />
                </div>

                <div style={{ height:'26%' }}>
                    <Console
                        params={this.props.params}
                        data={this.props.data} />
                </div>

                <Blinkers ref="blinkers" interval={200} />
            </div>
        );
    }
}));

var styles = {

    mission: {
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        opacity: '0.5',
        display: 'none'
    },

    submission: {
        height: '100%',
        width: '100%',
        color: '#fff',
    },
}
