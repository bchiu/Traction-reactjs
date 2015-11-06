var React  = require('react');
var Radium = require('radium');

var Datum = React.createClass({
	
    render: function() {
    	var params = this.props.params;
        var value  = parseFloat(this.props.value).toFixed(params.precision)

        return (
            <div style={styles.datum}>
                <span style={styles.title}>{params.title}</span>&nbsp;
                <span style={styles.value}>{value}{params.units}</span>
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