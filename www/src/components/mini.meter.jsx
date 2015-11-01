var React  = require('react');
var Radium = require('radium');

var MiniMeter = React.createClass({
    render: function() {
        var value = parseFloat(this.props.value).toFixed(this.props.precision)

        return (
            <div>
                <span style={styles.title}>{this.props.title}:</span>&nbsp;
                
                <span style={styles.value}>{value}{this.props.units}</span>&nbsp;
                
                <meter 
                    style={styles.meter} 
                    min={this.props.min} 
                    max={this.props.max} 
                    low={this.props.low} 
                    high={this.props.high} 
                    optimum={this.props.optimum} 
                    value={this.props.value} />
            </div>
        );
    }
});

var styles = {

    meter: {
        background: '#eee',
        WebkitAppearance: 'none',
        appearance: 'none',
        height: '3vw',

        '@media screen and (orientation:portrait)': {
            width: '50%'
        },

        '@media screen and (orientation:landscape)': {
            width: '100%'
        }
    },

    title: {
        fontSize: '3vw'
    },

    value: {
        fontSize: '3vw',
        fontWeight: 'bold'
    }
}

module.exports = Radium(MiniMeter);