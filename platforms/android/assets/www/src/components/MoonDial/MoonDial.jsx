var React  = require('react');
var Radium = require('radium');

var MoonDial = React.createClass({

    getInitialState: function() {
        this.min   = parseFloat(this.props.min) || 0;
        this.max   = parseFloat(this.props.max) || 100;
        this.value = this.min;
        this.flipcolor = this.props.flipcolor || false;
        this.precision = parseInt(this.props.precision) || 0;

        return {
        }
    },

    componentDidMount: function() {
        var xml = Snap.parse(require('./MoonDial.svg'));

        this.border    = xml.select("#border");
        this.dial      = xml.select("#dial");
        this.clipPath  = xml.select("#clip-path");
        this.textMin   = xml.select("#min");
        this.textMax   = xml.select("#max");
        this.textValue = xml.select("#value");
        this.textUnits = xml.select("#units");

        this.svg = Snap("#" + this.props.id);
        this.svg.append(xml.select("#moon-dial"));

        this.viewBox  = this.svg.node.viewBox.baseVal;
        this.viewPort = this.svg.node.getBoundingClientRect();

        this.cx = this.viewBox.width / 2;
        this.cy = this.viewBox.height / 2;

        this.textMin.attr("text-anchor", "middle");
        this.textMax.attr("text-anchor", "middle");
        this.textUnits.attr("text-anchor", "middle");
        this.textValue.attr("text-anchor", "middle");

        this.textMin.node.innerHTML   = this.props.min;
        this.textMax.node.innerHTML   = this.props.max;
        this.textUnits.node.innerHTML = this.props.units;

        this.setValue(this.min);
    },

    componentDidUpdate: function() {
        this.setValue(this.value);
    },

    setValue: function(val) {
        var angle = (val - this.min) / (this.max - this.min) * 180.0;
        this.clipPath.transform("r" + angle + " " + this.cx + " " + this.cy);
        this.textValue.node.innerHTML = val;
        this.shiftColor(angle);
    },

    shiftColor: function(angle) {
        angle = (this.flipcolor) ? angle/2 : 90 - angle/2; // 90 green, 45 yellow, 0 orange
        var filter = this.svg.filter(Snap.filter.hueRotate(angle));
        this.dial.attr({ 'filter': filter });
    },

    render: function() {
        this.value = parseFloat(this.props.value).toFixed(this.precision)
        this.value = Math.min(this.value, this.max);
        this.value = Math.max(this.value, this.min);

        return (
            <svg id={this.props.id} viewBox="0 0 180 180" width="60%" />
        );
    },
});

var styles = {
}

module.exports = Radium(MoonDial);