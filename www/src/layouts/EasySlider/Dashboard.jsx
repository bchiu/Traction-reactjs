var React      = require('react');
var Radium     = require('radium');
var MiniMeter  = require("../../components/MiniMeter");
var Flipcard   = require("../../components/Flipcard");
var ZenGauge   = require("../../components/ZenGauge");
var Datum      = require("../../components/Datum");

var Dashboard = React.createClass({
    render: function() {
        var data = this.props.data;

        return (
            <div style={{ height:'100%' }}>

                {/* small meters */}
                <div style={styles.top}>

                    <table width="100%" height="100%">
                        <tbody>
                            <tr>
                                <td style={styles.cell}>

                                    <MiniMeter 
                                        title="Duty Cycle" 
                                        units="%" 
                                        min="0" 
                                        max="100" 
                                        low="50" 
                                        high="75" 
                                        optimum="0" 
                                        precision="0"
                                        value={data.duty_now} />
                                </td>
                            </tr>
                            <tr>
                                <td style={styles.cell}>

                                    <MiniMeter 
                                        title="Motorᵀ" 
                                        units="°C" 
                                        min="0" 
                                        max="120" 
                                        low="50" 
                                        high="90" 
                                        optimum="0" 
                                        precision="0"
                                        value={data.temp_motor} />
                                </td>
                            </tr>
                            <tr>
                                <td style={styles.cell}>

                                    <MiniMeter 
                                        title="Controlᵀ" 
                                        units="°C" 
                                        min="0" 
                                        max="120" 
                                        low="50" 
                                        high="90" 
                                        optimum="0" 
                                        precision="0"
                                        value={data.temp_pcb} />
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
                            title="Speed" 
                            units="KPH"   
                            min="0" 
                            max="100"  
                            step="1"
                            precision="0"
                            value={data.speed} />

                        <ZenGauge 
                            id="gaugePower" 
                            title="Power" 
                            units="Watts" 
                            min="0" 
                            max="9999" 
                            step="1"
                            precision="0"
                            value={data.power} />
                            
                    </Flipcard>
                </div>

                {/* simple telemetry */}
                <div style={styles.bottom}>

                    <div style={styles.table}>
                        
                        <div style={styles.row}>
                            <div style={styles.col}>
                                <Datum 
                                    title="Throttle"
                                    units="V"
                                    precision="1"
                                    value={data.throttle_v} />
                            </div>
                            <div style={styles.col}>
                                <Datum 
                                    title="RPM"
                                    units=""
                                    precision="0"
                                    value={data.rpm} />
                            </div>
                            <div style={styles.col}>
                                <Datum 
                                    title="Phase"
                                    units="A"
                                    precision="1"
                                    value={data.current_motor} />
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.col}>
                                <Datum 
                                    title="Current"
                                    units="A"
                                    precision="1"
                                    value={data.current_in} />
                            </div>
                            <div style={styles.col}>
                                <Datum 
                                    title="Used"
                                    units="Ah"
                                    precision="1"
                                    value={data.amp_hours} />
                            </div>
                            <div style={styles.col}>
                                <Datum
                                    title="Watt/H"
                                    units=""
                                    precision="1"
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
            top: '25%'
        },

        '@media screen and (orientation:landscape)': {
            position: 'absolute',
            width: '50%',
            height: '100%',
            left: '25%'
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