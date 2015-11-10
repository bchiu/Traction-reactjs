var React  = require('react');
var Radium = require('radium');

module.exports = Radium(React.createClass({

	getInitialState: function() {
		this.interval = this.props.interval || 200;

		return {
			left:  false,
			right: false
		}
	},

	componentDidMount: function() {
		//this.blink('both', 10000); // test blinkers
	},

	blink: function(side, duration) {
		var duration = duration || 5000;

		this.timer = setInterval(function() {
			if (side == 'left'  || side == 'both') this.setState({ left:  !this.state.left })
			if (side == 'right' || side == 'both') this.setState({ right: !this.state.right })
		}.bind(this), this.interval);

		if (duration != 0) {
			setTimeout(function() {
				this.stop();
			}.bind(this), duration);
		}
	},

	stop: function() {
		clearTimeout(this.timer);
		this.setState({ left: false, right: false });
	},

    render: function() {
    	var leftState  = (this.state.left)  ? styles.visible : styles.hidden; 
    	var rightState = (this.state.right) ? styles.visible : styles.hidden; 

        return (
            <div>
                <div style={[styles.blinker, styles.blinkerL,  leftState]}>
                	<div style={[styles.arrow, styles.arrowL]}>&lt;</div>
                </div>
                <div style={[styles.blinker, styles.blinkerR, rightState]}>
                	<div style={[styles.arrow, styles.arrowR]}>&lt;</div>
                </div>
            </div>
        );
    }
}));

var styles = {

	blinker: {
		width: '35vw',
		height: '100vh',
		top: '0',
		zIndex: 10,
		position: 'absolute',
		backgroundImage: '-webkit-linear-gradient(left, rgba(48,147,61,1) 0%, rgba(0,0,0,0) 90%)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		opacity: '0.8'
	},

	blinkerL: {
		left: '0'
	},

	blinkerR: {
		right: '0',
		transform: 'scaleX(-1)'
	},

	arrow: {
		top: '25%',
		position: 'relative',
		fontFamily: 'Calibri',
		fontSize: '30vh',
		textShadow: '1vh 1vh 1vh #333',
	},

	arrowL: {
		left: '15%',
	},

	arrowR: {
		right: '-15%',
	},

	visible: {
		display: 'block'
	},

	hidden: {
		display: 'none'
	}
}
