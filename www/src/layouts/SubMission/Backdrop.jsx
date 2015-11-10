var React      = require('react');
var Radium     = require('radium');

module.exports = Radium(React.createClass({

    render: function() {
        return (
            <div style={styles.backdrop}>
                <div style={[styles.spot, styles.left]} />
                <div style={[styles.spot, styles.right]} />
                <div style={[styles.spot, styles.center]} />
                <div style={[styles.drop, styles.left]} />
                <div style={[styles.drop, styles.right]} />
            </div>
        );
    }
}));

var styles = {

    backdrop: {
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
}
