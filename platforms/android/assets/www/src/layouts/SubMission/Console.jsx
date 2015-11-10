var React      = require('react');
var Radium     = require('radium');
var SunDial    = require('../../components/SunDial/SunDial');

module.exports = Radium(React.createClass({

    render: function() {
        var params = this.props.params;
        var data   = this.props.data;

        return (
            <table style={styles.console}>
                <tbody>
                    <tr valign="top">
                        <td width="25%">

                            <SunDial
                                id="sunDial1"
                                params={params.motor_temp_c}
                                value={data.motor_temp_c} />
                        </td>
                        <td width="25%">

                            <SunDial
                                id="sunDial2"
                                params={params.battery_temp_c}
                                value={data.battery_temp_c} />
                        </td>
                        <td width="25%">

                            <SunDial
                                id="sunDial3"
                                params={params.controller_temp_c}
                                value={data.controller_temp_c} />
                        </td>
                        <td width="25%">

                            <SunDial
                                id="sunDial4"
                                flipcolor={true}
                                params={params.battery_voltage}
                                value={data.battery_voltage} />

                        </td>
                    </tr>   
                </tbody>
            </table>
        );
    }
}));

var styles = {

    console: {
        height: '100%',
        width: '100%',
        textAlign: 'center',
        background: '#000',
    }
}
