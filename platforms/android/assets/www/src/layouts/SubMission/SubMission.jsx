/*
    Mission Impassable - tribute to the now defunct mission RS motorcycle
*/
var React      = require('react');
var Radium     = require('radium');
var ArcReactor = require("../../components/ArcReactor/ArcReactor");
var MoonDial   = require("../../components/MoonDial/MoonDial");
var Flipcard   = require("../../components/Flipcard");

var SubMission = React.createClass({
 
    showDevices: function() {
        //this.refs.devices.showModal();
    },

    render: function() {
        var data = this.props.data;

        return (
        	<div style={styles.container}>
                <img src="img/mission.png" style={styles.mission} />

                <div style={styles.backdrop.container}>
                    <div style={[styles.backdrop.spot, styles.backdrop.left]} />
                    <div style={[styles.backdrop.spot, styles.backdrop.right]} />
                    <div style={[styles.backdrop.spot, styles.backdrop.center]} />
                    <div style={[styles.backdrop.drop, styles.backdrop.left]} />
                    <div style={[styles.backdrop.drop, styles.backdrop.right]} />
                </div>

                <table style={styles.navbar}>
                    <tbody>
                        <tr valign="center">
                            <td>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={styles.line} />

                <table style={styles.main}>
                    <tbody>
                        <tr valign="center">
                            <td id="left" width="42%" align="left">

                                <Flipcard id="flipcard1">

                                    <ArcReactor
                                        id="arcReactor1"
                                        invert={false}
                                        colors={0}
                                        title="Speed" 
                                        units="MPH"
                                        min={0} 
                                        max={160}
                                        step={20}
                                        precision={0}
                                        value={data.speed} />

                                    <ArcReactor
                                        id="arcReactor2"
                                        invert={false}
                                        colors={-45}
                                        title="Speed" 
                                        units="KPH"
                                        min={0} 
                                        max={260}
                                        step={20}
                                        precision={0}
                                        value={data.speed} />

                                </Flipcard>
                            </td>

                            <td id="center" align="center">

                                <Flipcard id="flipcard2">
                                    <svg id="compass" viewBox="0 0 1000 1000" width="90%"></svg>
                                    <svg id="gyro" viewBox="0 0 1000 1000" width="90%"></svg>
                                </Flipcard>

                            </td>

                            <td id="right" width="42%" align="right">

                                <Flipcard id="flipcard3">

                                    <ArcReactor
                                        id="arcGauge3"
                                        bipolar={true}
                                        invert={true}
                                        colors={90}
                                        title="Power" 
                                        units="KW"
                                        min={0.0} 
                                        max={10.0}
                                        step={2.0}
                                        neg={4.0}
                                        negstep={2.0}
                                        precision={1}
                                        value={data.power_kw} />

                                    <ArcReactor
                                        id="arcGauge4"
                                        bipolar={true}
                                        invert={true}
                                        colors={45}
                                        title="Current" 
                                        units="Amps"
                                        min={0} 
                                        max={200}
                                        step={40}
                                        neg={80}
                                        negstep={40}
                                        precision={0}
                                        value={data.current_in} />

                                </Flipcard>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={styles.tripA}>
                    Trip A <b>1234</b> km
                </div>

                <div style={styles.tripB}>
                    Trip B <b>1234</b> km
                </div>

                <table style={styles.info}>
                    <tbody>
                        <tr valign="top">
                            <td width="25%">

                                <MoonDial
                                    id="moonDial1"
                                    min={20}
                                    max={120}
                                    units="Motor (°C)"
                                    precision={0}
                                    value={data.temp_motor} />

                            </td>
                            <td width="25%">

                                <MoonDial
                                    id="moonDial2"
                                    min={20}
                                    max={120}
                                    units="Battery (°C)"
                                    precision={0}
                                    value={data.temp_battery} />

                            </td>
                            <td width="25%">

                                <MoonDial
                                    id="moonDial3"
                                    min={20}
                                    max={120}
                                    units="Controller (°C)"
                                    precision={0}
                                    value={data.temp_pcb} />

                            </td>
                            <td width="25%">

                                <MoonDial
                                    id="moonDial4"
                                    min={12}
                                    max={16.8}
                                    units="Battery (V)"
                                    flipcolor={true}
                                    precision={1}
                                    value={data.v_in} />

                            </td>
                        </tr>   
                    </tbody>
                </table>
            </div>
        );
    }
});

var styles = {

    mission: {
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        opacity: '0.0',
    },

    backdrop: {
        container: {
            width: '100%',
            height: '100%',
            background: '#000',
            position: 'absolute',
            zIndex: '-1'
        },

        spot: {
            position: 'absolute',
            height: '50%',
            width: '50%',
            bottom: '0',
            opacity: '0.8',
            //background: '-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, rgba(18,80,109,1)), color-stop(90%, rgba(0,0,0,0.1)), color-stop(100%, rgba(0,0,0,0)))',
            background: '-webkit-radial-gradient(center, ellipse cover, rgba(18,80,109,1) 0%, rgba(0,0,0,0.1) 90%, rgba(0,0,0,0) 100%)',
        },

        drop: {
            position: 'absolute',
            height: '10%',
            width: '50%',
            bottom: '33%',
            opacity: '0.5',
            //background: '-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,rgba(0,0,0,0.65)), color-stop(30%,rgba(0,0,0,0)))',
            background: '-webkit-radial-gradient(center, ellipse cover,  rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 30%)',
        },

        left: {
            left: '0',
        },

        right: {
            right: '0',
        },

        center: {
            top: '-50%',
            left: '20%',
            width: '60%',
            height: '100%',
            opacity: '0.5'
        }
    },

    container: {
        height: '100%',
        width: '100%',
        color: '#fff',
    },

    navbar: {
        height: '6%',
        width: '100%',
    },

    line: {
        width: '100%',
        height: '1px',
        background: '#333',
    },

    main: {
        height: '68%', 
        width: '100%',
    },

    info: {
        height: '26%',
        width: '100%',
        textAlign: 'center',
        background: '#000',
    },

    indicator: {
        height: '100%',
        width: '40%',
        position: 'absolute',
        bottom: '36%',
        left: '30%'
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
    }
}

module.exports = Radium(SubMission);