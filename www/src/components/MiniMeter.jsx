var React  = require('react');
var Radium = require('radium');

var MiniMeter = React.createClass({

    render: function() {
        var params = this.props.params;

        var range = params.max - params.min;
        var low   = params.min + range * 1/3;
        var high  = params.min + range * 2/3;
        var ideal = (this.props.descend) ? params.max : params.min // descend: high good, low bad

        var value = parseFloat(this.props.value).toFixed(params.precision)

        return (
            <div>
                <span style={styles.title}>{params.title}:</span>&nbsp;
                
                <span style={styles.value}>{value}{params.units}</span>&nbsp;
                
                <meter 
                    style={styles.meter} 
                    min={params.min} 
                    max={params.max} 
                    low={low} 
                    high={high} 
                    optimum={ideal} 
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