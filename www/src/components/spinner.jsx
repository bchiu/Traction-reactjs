var React    = require('react');
var Radium   = require('radium');
var ReactDOM = require('react-dom');

var Spinner = React.createClass({
    render: function() {
        return (
            <svg 
                style={[styles.spinner, this.props.style]} 
                width={this.props.width} 
                height={this.props.height} 
                viewBox="0 0 66 66" 
                xmlns="http://www.w3.org/2000/svg">

                <circle 
                    style={styles.path} 
                    fill="none" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    cx="33" 
                    cy="33" 
                    r="30" />
            </svg>
        );
    }
});

var rotator = Radium.keyframes({
    '0%':   { WebkitTransform: 'rotate(0deg)',   transform: 'rotate(0deg)'   },
    '100%': { WebkitTransform: 'rotate(270deg)', transform: 'rotate(270deg)' }
}, 'Spinner');

var colors = Radium.keyframes({
    '0%':   { stroke: '#4285F4' },
    '25%':  { stroke: '#DE3E35' },
    '50%':  { stroke: '#F7C223' },
    '75%':  { stroke: '#1B9A59' },
    '100%': { stroke: '#4285F4' }
}, 'Spinner');

var dash = Radium.keyframes({
    '0%':   { strokeDashoffset: '187' },
    '50%':  { strokeDashoffset: '46.75', WebkitTransform: 'rotate(135deg)', transform: 'rotate(135deg)' },
    '100%': { strokeDashoffset: '187',   WebkitTransform: 'rotate(450deg)', transform: 'rotate(450deg)' }
}, 'Spinner');

var styles = {

    spinner: {
        WebkitAnimation: `${rotator} 1.4s linear infinite`,
        animation: `${rotator} 1.4s linear infinite`
    },

    path: {
        strokeDasharray: '187',
        strokeDashoffset: '0',
        WebkitTransformOrigin: 'center',
        transformOrigin: 'center',
        WebkitAnimation: `${dash} 1.4s ease-in-out infinite, ${colors} 5.6s ease-in-out infinite`,
        animation: `${dash} 1.4s ease-in-out infinite, ${colors} 5.6s ease-in-out infinite`
    }
}

module.exports = Radium(Spinner);