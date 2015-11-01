var React  = require('react');
var Radium = require('radium');

var Gauge = React.createClass({

    render: function() {
        return (
            <div style={{ width:'100%', height:'100%' }}>
                <div style={styles.title}>{this.props.title}</div>
                <input id={this.props.id} value={this.props.value} data-width="100%" />
                <div style={styles.units}>{this.props.units}</div>
            </div>
        );
    },

    componentDidMount: function() {
        this.dial = $('#' + this.props.id);

        this.dial.knob({
            min: Math.abs(this.props.min),
            max: Math.abs(this.props.max),
            step: this.props.step,
            angleOffset: 270,
            angleArc: 360,
            stopper: false,
            readOnly: true,
            rotation: 'clockwise',
            biDirectional: true,
            biColor: '#FF9900',
            displayMax: true,
            relative: true
        });
    },

    componentDidUpdate: function() {
        var value = parseFloat(this.props.value).toFixed(this.props.precision)
        this.dial.val(value).trigger('change');
    }
});

var styles = {

    title: {
        color: '#ccc',
        fontSize: '4vw',
        fontWeight: 'bold',
        position: 'absolute',
        top: '30%',
        left: '0',
        right: '0'
    },

    units: {
        color: '#333',
        fontSize: '5vw',
        fontWeight: 'bold',
        position: 'absolute',
        top: '60%',
        left: '0',
        right: '0'
    }    
}

module.exports = Radium(Gauge);