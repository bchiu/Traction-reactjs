var React  = require('react');
var Radium = require('radium');

module.exports = Radium(React.createClass({

    getInitialState: function() {
        return {
            flipped: false
        }
    },

    flip: function() {
        this.setState({ flipped: !this.state.flipped })
    },

    render: function() {
        var id = this.props.id;
        var cards = React.Children.toArray(this.props.children);
        var flipState = (this.state.flipped) ? styles.flipped : styles.unflipped;

        return (
            <div id={id} style={[styles.flipcard, flipState]} onClick={this.flip}>
                <div style={styles.front}>
                	{cards[0]}
                </div>
                <div style={styles.back}>
                	{cards[1]}
                </div>
            </div>
        );
    }
}));

var styles = {

    flipcard: {
        background: 'transparent',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.8s',
        textAlign: 'center',
        position: 'relative',
        width: '100%',
        height: '100%'
    },

    front: {
        position: 'absolute',
        backfaceVisibility: 'hidden',
        width: '100%',
        height: 'inherit',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: '2'
    },

    back: {
        position: 'absolute',
        backfaceVisibility: 'hidden',
        width: '100%',
        height: 'inherit',
        top: '50%',
        transform: 'translateY(-50%) rotateY(180deg)',
        zIndex: '1'
    },

    flipped: {
        transform: 'rotateY(180deg)'
    },

    unflipped: {
        transform: 'none'
    }
}
