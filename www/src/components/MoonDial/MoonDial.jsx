var React  = require('react');
var Radium = require('radium');

var MoonDial = React.createClass({

    getInitialState: function() {
        this.scaleMin  = parseFloat(this.props.min)  || 0;
        this.scaleMax  = parseFloat(this.props.max)  || 100;
        this.precision = parseInt(this.props.precision) || 0;
        this.value     = this.scaleMin;

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

        this.textValue.attr("text-anchor", "middle");

        this.textMin.node.innerHTML   = this.props.min;
        this.textMax.node.innerHTML   = this.props.max;
        this.textUnits.node.innerHTML = this.props.units;

        this.setValue(this.scaleMin);
    },

    componentDidUpdate: function() {
        this.setValue(this.value);
    },

    setValue: function(val) {
        var angle = 180.0 / (this.scaleMax - this.scaleMin) * val;
        this.clipPath.transform("r" + angle + " " + this.cx + " " + this.cy);
        this.textValue.node.innerHTML = val;
    },

    render: function() {
        this.value = parseFloat(this.props.value).toFixed(this.precision)
        this.value = Math.min(this.value, this.scaleMax);
        this.value = Math.max(this.value, this.scaleMin);

        return (
            <svg id={this.props.id} viewBox="0 0 180 180" height="100%" />
        );
    },
});

var styles = {
}

module.exports = Radium(MoonDial);