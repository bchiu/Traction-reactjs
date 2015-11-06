var React  = require('react');
var Radium = require('radium');

var JumboMeter = React.createClass({

    render: function() {
        var value = parseFloat(this.props.value).toFixed(this.props.precision)

        return (
            <div style={styles.container}>
                <meter 
                    style={styles.meter}
                    min={this.props.min} 
                    max={this.props.max} 
                    low={this.props.low} 
                    high={this.props.high} 
                    optimum={this.props.optimum} 
                    value={this.props.value} />

                <div style={styles.value}>
                    {value} {this.props.units}
                </div>
            </div>
        );
    }
});

var styles = {

    container: {
        height: '100%',
        position: 'relative',
    },

    meter: {
        background: '#ccc',
        WebkitAppearance: 'none',
        appearance: 'none',
        width: '100%',
        height: '100%',
        display: 'block'
    },

    value: {
        fontSize: '5vh',
        fontWeight: 'bold',
        position: 'absolute',
        top: '-1vh',
        right: '0'
    }
}

module.exports = Radium(JumboMeter);