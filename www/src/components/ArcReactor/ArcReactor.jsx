var React  = require('react');
var Radium = require('radium');

/*
    ArcReactor - bi-directional led arc guage
*/
var ArcReactor = React.createClass({

    getInitialState: function() {
        var params = this.props.params;

        // params
        this.min        = params.min;
        this.max        = params.max;
        this.step       = params.step;
        this.units      = params.units;
        this.precision  = params.precision;

        // props
        this.id         = this.props.id;
        this.colorshift = parseInt(this.props.colors) || 0;
        this.inverted   = this.props.invert           || false;
        this.bipolar    = false;

        // instance
        this.markerMax  = this.min;
        this.value      = this.min;

        if (this.min < 0) {
            this.neg = Math.abs(this.min);
            this.min = 0;
            this.value = 0;
            this.bipolar = true;
        }

        return {}
    },

    componentDidMount: function() {
        var xml = Snap.parse(require('./ArcReactor.svg'));

        this.svg         = Snap("#" + this.id);
        this.grp         = this.svg.g();
        this.legend      = this.svg.g();
        this.ticks       = this.svg.g();
        this.guides      = xml.select("#guides");
        this.scaleLine   = xml.select("#scale-line");
        this.ledBar      = xml.select("#led-bar");
        this.marker      = xml.select("#marker");
        this.markerText  = xml.select("#marker-text");
        this.arcX        = this.guides.select("#center").attr("cx");
        this.arcY        = this.guides.select("#center").attr("cy");
        this.viewBox     = this.svg.node.viewBox.baseVal;
        this.viewPort    = this.svg.node.getBoundingClientRect();
        this.clipPath    = xml.select("#clip-path > path");
        this.clipCopy    = this.clipPath.clone();

        // if bipolar set new clip and legend
        if (this.bipolar) {
            this.clipPath    = xml.select("#clip-path-bi > #pos-path");
            this.clipCopy    = this.clipPath.clone();
            this.clipPathNeg = xml.select("#clip-path-bi > #neg-path");
            this.clipCopyNeg = this.clipPathNeg.clone(); 
            this.drawLegend(this.min, this.neg, this.step, this.clipPathNeg);
            this.drawSticks(this.min, this.neg, this.step, this.clipPathNeg);
        }

        // draw legend & scale ticks
        this.drawLegend(this.min, this.max, this.step, this.clipPath);
        this.drawSticks(this.min, this.max, this.step, this.clipPath);

        // flip canvas horizontally
        if (this.inverted) this.flipCanvas(); 

        // click handler for marker
        this.marker.click(this.resetMarker);

        // color hue filter
        this.shiftColor(this.colorshift);

        // construct svg
        this.grp.append(this.marker);
        this.grp.append(this.ticks);
        this.grp.append(this.legend);
        this.grp.append(this.scaleLine);
        this.grp.append(this.ledBar);

        // set initial values
        this.setValue(this.min);
        this.setMarker(this.min);
    },

    componentDidUpdate: function() {
        this.setValue(this.value);
    },

    render: function() {
        this.value = parseFloat(this.props.value).toFixed(this.precision)

        var invert = (this.inverted) ? styles.inverted : {};

        return (
            <div style={{ width:'100%', height:'100%' }}>
                <svg id={this.id} viewBox="0 0 520 520" width="100%" height="100%" />
                <div style={[styles.value, invert]}>{this.value}</div>
                <div style={[styles.units, invert]}>{this.units}</div>
            </div>
        );
    },

    // instance methods -------------------------------------------------------

    setValue: function(val) {

        // negative direction
        if (this.bipolar && val < 0) {
            this.ledBar.attr({ 'mask': this.clipCopyNeg });
            var path = this.getSubPath(Math.abs(val), this.min, this.neg, this.clipPathNeg); 
            this.clipCopyNeg.attr('d', path);
            this.shiftColor(this.colorshift + 180);

        // positive direction
        } else {
            this.ledBar.attr({ 'mask': this.clipCopy });
            var path = this.getSubPath(val, this.min, this.max, this.clipPath); 
            this.clipCopy.attr('d', path);
            this.shiftColor(this.colorshift);
            if (val > this.markerMax) this.setMarker(val);
        }
    },

    flipCanvas: function() {
        this.inverted = true;
        this.markerText.attr({ display:'none' });
        this.markerText = this.marker.select("#marker-text-mirror").attr({ display:'block' });
        this.grp.transform("t" + this.viewBox.width + "s-1,1");
    },

    shiftColor: function(angle) {
        var filter = this.svg.filter(Snap.filter.hueRotate(angle));
        this.ledBar.attr({ 'filter': filter });
    },

    mapNum: function(val, in_min, in_max, out_min, out_max ) {
        return ( val - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
    },

    getPointOnPath: function(val, min, max, path) {
        var pathLen = path.getTotalLength();
        var subLen  = this.mapNum(val, min, max, 0, pathLen);
        var point   = path.getPointAtLength(subLen);
        return point;
    },

    getSubPath: function(val, min, max, path) {
        var pathLen = path.getTotalLength();
        var subLen  = this.mapNum(val, min, max, 0, pathLen);
        var subPath = path.getSubpath(0, subLen);
        return subPath;
    },

    drawLegend: function(min, max, step, path) {
        for (var n = min; n <= max; n += step) {

            var point = this.getPointOnPath(n, min, max, path);
            var text = this.legend.text(point.x, point.y, n.toString());

            $(text.node).css(styles.legendtext);
            if (this.inverted) text.transform("s -1 1");
        }
    },

    drawSticks: function(min, max, step, path) {
        $(this.ticks.node).css(styles.ticks);

        for (var n = min; n <= max; n += step/2) {
            var point = this.getPointOnPath(n, min, max, path);
            var angle = Snap.angle(this.arcX, this.arcY, point.x, point.y);

            if (angle > 90 && angle < 270) angle = 90; 

            this.ticks.line(point.x + 15, point.y, point.x + 10, point.y).
                transform("r" + angle + "," + point.x + "," + point.y);
        }
    },

    resetMarker: function() {
        this.setMarker(this.min);
        window.event.stopPropagation();
    },

    setMarker: function(val) {
        var point = this.getPointOnPath(val, this.min, this.max, this.clipPath);
        var angle = Snap.angle(this.arcX, this.arcY, point.x, point.y);

        if (angle > 90 && angle < 270) angle = 90; 
        this.marker.transform("R" + angle + ",0,0" + "T" + point.x + "," + point.y);

        this.markerText.attr({ text: val });
        this.markerMax = parseFloat(val);
    }
});

var styles = {

    value: {
        color: '#fff',
        fontFamily: 'Calibri',
        fontStyle: 'italic',
        fontSize: '25vh',
        fontWeight: 'bold',
        textShadow: '0 0 2vh #FFF',
        position: 'absolute',
        top: '50%',
        left: '60%',
        transform: 'translate(-50%, -50%)'
    },

    units: {
        color: '#fff',
        fontFamily: 'Calibri',
        fontSize: '5vh',
        fontWeight: 'bold',
        textShadow: '0 0 1vh #FFF',
        position: 'absolute',
        bottom: '25%',
        left: '60%',
        transform: 'translate(-50%)'
    },

    inverted: {
        left: '40%'
    },

    legendtext: {
        fill: '#fff', 
        textAnchor: 'middle',
        alignmentBaseline: 'middle',
        fontFamily: 'Calibri',
        fontSize: '1.5em'
    },

    ticks: {
        stroke: '#666',   
        strokeWidth: '3px',
    }
}

module.exports = Radium(ArcReactor);