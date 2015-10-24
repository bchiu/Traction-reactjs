var React = require('react');

var Flipcard = React.createClass({

    flip: function(event) {
        var div = $(event.currentTarget);
        div.toggleClass('flipped');
        this.isFlipped = !this.isFlipped;
    },

    render: function() {
        var id = this.props.id;
        var cards = React.Children.toArray(this.props.children);

        this.div = $('#'+id).first();
        this.isFlipped = false;

        return (
            <div id={id} className="flipcard" onClick={this.flip}>
                <div className="flipcard-front">
                	{cards[0]}
                </div>
                <div className="flipcard-back">
                	{cards[1]}
                </div>
            </div>
        );
    }
});

module.exports = Flipcard;