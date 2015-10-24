var React = require('react');

var MiniMeter = React.createClass({
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
                <span className="mini-meter-title">{title}:</span>
                
                <b><span id={id+'-value'} className="mini-meter-value">{value}</span> {units}</b>
                
                <meter className="mini-meter" 
                    id={id} 
                    min={min} 
                    max={max} 
                    low={low} 
                    high={high} 
                    optimum={optimum} 
                    value={value} />
            </div>
        );
    }
});

module.exports = MiniMeter;