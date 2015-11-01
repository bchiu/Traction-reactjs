var React  = require('react');
var Radium = require('radium');

var Datum = React.createClass({
    render: function() {
        var value = parseFloat(this.props.value).toFixed(this.props.precision)

        return (
            <div style={styles.datum}>
                <span style={styles.title}>{this.props.title}</span>&nbsp;
                <span style={styles.value}>{value}{this.props.units}</span>
            </div>
        );
    }
});

var styles = {

	datum: {
		fontSize: '4vmin',
		fontWeight: 'bold'
	},

	title: {
		color: '#999'
	},

	value: {
		color: '#333'
	}
}

module.exports = Radium(Datum);