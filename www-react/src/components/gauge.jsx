var React = require('react');

var Gauge = React.createClass({
    render: function() {
        this.id    = this.props.id;
        this.title = this.props.title;
        this.units = this.props.units;
        this.min   = this.props.min;
        this.max   = this.props.max;
        this.value = this.props.value;

        return (
            <div id={this.id} className="gauge" />
        );
    },

    componentDidMount: function() {
        this.gauge = new JustGage({
            id: this.id,
            value: 0,
            min: this.min,
            max: this.max,
            label: this.units,
            title: this.title,
            donut: true,
            donutStartAngle: 0,
            refreshAnimationType: 'linear',
            refreshAnimationTime: 0,
            relativeGaugeSize: true
        });
    },

    set: function(newVal) {
        newVal = parseFloat(newVal).toFixed(1);
        curVal = parseFloat(this.gauge.txtValue.attr("text")).toFixed(1);
        if (newVal != curVal) {
            this.gauge.refresh(newVal);
        }
    }
});

module.exports = Gauge;