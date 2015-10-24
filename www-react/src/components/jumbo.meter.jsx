var React = require('react');

var JumboMeter = React.createClass({
    render: function() {
        var id      = this.props.id;
        var title   = this.props.title;
        var units   = this.props.units;
        var min     = this.props.min;
        var max     = this.props.max;
        var low     = this.props.low;
        var high    = this.props.high;
        var optimum = this.props.optimum;
        var value   = this.props.value;

        return (
            <div>
                <meter className='jumbo-meter'
                    id={id} 
                    min={min} 
                    max={max} 
                    low={low} 
                    high={high} 
                    optimum={optimum} 
                    value={value} />

                <div id={id+'-value'} className='jumbo-meter-value'> {value} {units}</div>
            </div>
        );
    }
});

module.exports = JumboMeter;