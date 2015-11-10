var React      = require('react');
var Radium     = require('radium');
var Flipcard   = require('../../components/Flipcard');
var ArcReactor = require('../../components/ArcReactor/ArcReactor');
var Gyro       = require('../../components/Gyro/Gyro');

module.exports = Radium(React.createClass({

    render: function() {
        var params = this.props.params;
        var data   = this.props.data;

        // params override
        params.battery_current.units = 'Amps';

        return (
            <div style={styles.dashboard}>
                <table width="100%" height="100%">
                    <tbody>
                        <tr valign="center">
                            <td id="left" width="42%" align="left">

                                <Flipcard id="flipcard1">

                                    <ArcReactor
                                        id="arcReactor1"
                                        invert={false}
                                        colors={0}
                                        params={params.speed_kph}
                                        value={data.speed_kph} />

                                    <ArcReactor
                                        id="arcReactor2"
                                        invert={false}
                                        colors={-45}
                                        params={params.speed_mph}
                                        value={data.speed_mph} />

                                </Flipcard>
                            </td>

                            <td id="center" width="16%" align="center">
                            </td>

                            <td id="right" width="42%" align="right">

                                <Flipcard id="flipcard3">

                                    <ArcReactor
                                        id="arcGauge3"
                                        invert={true}
                                        colors={90}
                                        params={params.power_kw}
                                        value={data.power_kw} />

                                    <ArcReactor
                                        id="arcGauge4"
                                        invert={true}
                                        colors={45}
                                        params={params.battery_current}
                                        value={data.battery_current} />

                                </Flipcard>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={styles.gyro}>
                    <Gyro id="gyro" />
                </div>

                <div style={styles.tripA}>
                    Trip A <b>1234</b> km
                </div>

                <div style={styles.tripB}>
                    Trip B <b>1234</b> km
                </div>
            </div>
        );
    }
}));

var styles = {

    dashboard: {
        height: '100%', 
        width: '100%',
    },

    tripA: {
        fontSize: '2.5vh',
        position: 'absolute',
        bottom: '30%',
        left: '35%'
    },

    tripB: {
        fontSize: '2.5vh',
        position: 'absolute',
        bottom: '30%',
        right: '35%'
    },

    gyro: {
        position: 'absolute',
        height: '25vh',
        top: '25%',
        left: '50%',
        transform: 'translateX(-50%)'
    }
}
