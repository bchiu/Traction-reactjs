var React = require('react');

var Sliders = React.createClass({

    toggleLock: function(event) {
        this.swiper.params.allowSwipeToNext = !this.swiper.params.allowSwipeToNext;
        this.swiper.params.allowSwipeToPrev = !this.swiper.params.allowSwipeToPrev;
        $(event.currentTarget).toggleClass("swiper-locked");
        $(event.currentTarget).toggleClass("swiper-unlocked");
    },

    componentDidMount: function() {
        this.swiper = new Swiper('.swiper-container', {
            preventClicksPropagation: false
        });
    },

    render: function() {
        return (
            <div className="swiper-container" style={this.props.style}>
                <div className="swiper-wrapper">
                    {
                        this.props.children.map(function(child) {
                            return (
                                <div className="swiper-slide">
                                    {child}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
});

module.exports = Sliders;