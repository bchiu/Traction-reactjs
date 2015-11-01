var React  = require('react');
var Radium = require('radium');

var Sliders = React.createClass({

    lock: function(event) {
        this.swiper.params.allowSwipeToNext = !this.swiper.params.allowSwipeToNext;
        this.swiper.params.allowSwipeToPrev = !this.swiper.params.allowSwipeToPrev;
    },

    componentDidMount: function() {
        this.swiper = new Swiper('.swiper-container', {
            onTouchStart: function(swiper, event) { this.props.onTouchStart() }.bind(this),
            onTouchEnd:   function(swiper, event) { this.props.onTouchEnd()   }.bind(this)
        });
    },

    render: function() {
        return (
            <div style={styles.container} className="swiper-container">
                <div className="swiper-wrapper">
                    {
                        this.props.children.map(
                            function(child, index) {
                                return (
                                    <div key={index} style={styles.slide} className="swiper-slide">
                                        { child }
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            </div>
        );
    }
});

Sliders.Lock = Radium(React.createClass({

    getInitialState: function() {
        return {
            locked: false
        }
    },

    handleClick: function(event) {
        this.setState({ locked: !this.state.locked })
        this.props.onToggle();
    },

    render: function() {
        var lockState = (this.state.locked) ? styles.locked : styles.unlocked;

        return (
            <button 
                onClick={this.handleClick}
                style={[ styles.lockButton, lockState ]}>
            </button>
        );
    }
}));

var styles = {

    container: {
        height: '100%',
        background: '#ddd'
    },

    slide: {
        '@media screen and (orientation:portrait)': {
            background: '-webkit-linear-gradient(right, rgba(226,226,226,1) 0%,rgba(221,221,221,1) 0%,rgba(255,255,255,1) 30%,rgba(255,255,255,1) 100%)', 
        },
        '@media screen and (orientation:landscape)': {
            background: '-webkit-linear-gradient(left, rgba(226,226,226,1) 0%,rgba(221,221,221,1) 0%,rgba(255,255,255,1) 30%,rgba(255,255,255,1) 100%)',
        }
    },

    locked: {
        backgroundImage: "url('img/locked.png')" 
    },

    unlocked: {
        backgroundImage: "url('img/unlocked.png')" 
    },

    lockButton: {
        overflow: 'hidden',
        textAlign: 'center',
        color: 'rgb(0, 0, 0)',
        fontFamily: '"Roboto", Arial, sans-serif',
        WebkitUserSelect: 'none',
        fontSize: '11px !important',
        backgroundColor: 'rgb(255, 255, 255)',
        padding: '1px 6px',
        borderBottomLeftRadius: '2px',
        borderTopLeftRadius: '2px',
        WebkitBackgroundClip: 'padding-box',
        backgroundClip: 'padding-box',
        border: '1px solid rgba(0, 0, 0, 0.14902)',
        WebkitBoxShadow: 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px',
        boxShadow: 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px',
        minWidth: '37px',
        minHeight: '37px',
        fontWeight: '500',
        backgroundSize: 'contain',
        position: 'relative',
        float: 'right',
        margin: '10px',
        outline: 'none'
    }
}

module.exports = Radium(Sliders);
