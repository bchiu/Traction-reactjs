var React  = require('react');
var Radium = require('radium');

module.exports = Radium(React.createClass({

    render: function() {
        var params = this.props.params;

        var range = params.max - params.min;
        var low   = params.min + range * 1/3;
        var high  = params.min + range * 2/3;
        var ideal = (this.props.descend) ? params.max : params.min // descend: high good, low bad

        var value = parseFloat(this.props.value).toFixed(params.precision)

        return (
            <div style={styles.container}>
                <meter 
                    style={styles.meter}
                    min={params.min} 
                    max={params.max} 
                    low={low} 
                    high={high} 
                    optimum={ideal} 
                    value={this.props.value} />

                <div style={styles.value}>
                    {value} {params.units}
                </div>
            </div>
        );
    }
}));

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
