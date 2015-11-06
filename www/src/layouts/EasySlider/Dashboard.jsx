var React      = require('react');
var Radium     = require('radium');
var MiniMeter  = require("../../components/MiniMeter");
var Flipcard   = require("../../components/Flipcard");
var ZenGauge   = require("../../components/ZenGauge");
var Datum      = require("../../components/Datum");

var Dashboard = React.createClass({
    
    render: function() {
        var params = this.props.params;
        var data   = this.props.data;

        return (
            <div style={{ height:'100%' }}>

                {/* small meters */}
                <div style={styles.top}>

                    <table width="100%" height="100%">
                        <tbody>
                            <tr>
                                <td style={styles.cell}>

                                    <MiniMeter 
                                        params={params.motor_duty_cycle}
                                        value={data.motor_duty_cycle} />
                                </td>
                            </tr>
                            <tr>
                                <td style={styles.cell}>

                                    <MiniMeter 
                                        params={params.motor_temp_c}
                                        value={data.motor_temp_c} />
                                </td>
                            </tr>
                            <tr>
                                <td style={styles.cell}>

                                    <MiniMeter 
                                        params={params.controller_temp_c}
                                        value={data.controller_temp_c} />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                {/* speed & power gauges */}
                <div style={styles.center}>
                    <Flipcard id="flipcard1">

                        <ZenGauge 
                            id="gaugeSpeed" 
                            params={params.speed_kph}
                            value={data.speed_kph} />

                        <ZenGauge 
                            id="gaugePower" 
                            params={params.power_w}
                            value={data.power_w} />
                            
                    </Flipcard>
                </div>

                {/* simple telemetry */}
                <div style={styles.bottom}>

                    <div style={styles.table}>
                        
                        <div style={styles.row}>
                            <div style={styles.col}>
                                <Datum 
                                    params={params.throttle_voltage}
                                    value={data.throttle_voltage} />
                            </div>
                            <div style={styles.col}>
                                <Datum 
                                    params={params.motor_rpm}
                                    value={data.motor_rpm} />
                            </div>
                            <div style={styles.col}>
                                <Datum 
                                    params={params.motor_phase_current}
                                    value={data.motor_phase_current} />
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.col}>
                                <Datum 
                                    params={params.battery_current}
                                    value={data.battery_current} />
                            </div>
                            <div style={styles.col}>
                                <Datum 
                                    params={params.amp_hours}
                                    value={data.amp_hours} />
                            </div>
                            <div style={styles.col}>
                                <Datum
                                    params={params.watt_hours}
                                    value={data.watt_hours} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var styles = {

    table: {
        display: 'table',
        width: '100%',
        height: '100%',
        fontSize: '3vmin'
    },

    col: {
        textAlign: 'center',
        verticalAlign: 'middle',

        '@media screen and (orientation:portrait)': {
            display: 'table-cell'
        },

        '@media screen and (orientation:landscape)': {
            height: '33.33%',
            display: 'block',
            paddingTop: '2.5vw'
        }
    },

    row: {
        '@media screen and (orientation:portrait)': {
            display: 'table-row'
        },

        '@media screen and (orientation:landscape)': {
            height: '50%',
            display: 'block'
        }
    },

    cell: {
        verticalAlign: 'middle',

        '@media screen and (orientation:portrait)': {
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        }
    },

    top: {
        '@media screen and (orientation:portrait)': {
            position: 'absolute',
            width: '100%',
            height: '25%',
            textAlign: 'right'
        },

        '@media screen and (orientation:landscape)': {
            position: 'absolute',
            width: '25%',
            height: '100%',
            textAlign: 'left'
        }
    },

    center: {
        '@media screen and (orientation:portrait)': {
            position: 'absolute',
            width: '100%',
            height: '50%',
            top: '25%',
            padding: '2vh'
        },

        '@media screen and (orientation:landscape)': {
            position: 'absolute',
            width: '50%',
            height: '100%',
            left: '25%',
            padding: '2vh'
        }
    },

    bottom: {
        '@media screen and (orientation:portrait)': {
            position: 'absolute',
            width: '100%',
            height: '25%',
            textAlign: 'right',
            left: '0',
            bottom: '0'
        },

        '@media screen and (orientation:landscape)': {
            position: 'absolute',
            width: '25%',
            height: '100%',
            textAlign: 'left',
            top: '0',
            right: '0'
        }
    }
}

module.exports = Radium(Dashboard);