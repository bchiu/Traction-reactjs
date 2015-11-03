var React  = require('react');
var Radium = require('radium');

var ArcReactor = React.createClass({

    getInitialState: function() {
        this.scaleMin   = parseFloat(this.props.min)  || 0;
        this.scaleMax   = parseFloat(this.props.max)  || 100;
        this.scaleTick  = parseFloat(this.props.step) || 10;
        this.scaleUnit  = this.props.units  || "";
        this.inverted   = this.props.invert || false;
        this.colorshift = parseInt(this.props.colors) || 0;
        this.markerMax  = this.scaleMin;
        this.precision  = parseInt(this.props.precision) || 0;
        this.value      = this.scaleMin;

        return {
        }
    },

    componentDidMount: function() {
        var xml = Snap.parse(require('./ArcReactor.svg'));

        this.svg         = Snap("#" + this.props.id);
        this.grp         = this.svg.g();
        this.legend      = this.svg.g();
        this.ticks       = this.svg.g();
        this.guides      = xml.select("#guides");
        this.scaleLine   = xml.select("#scale-line");
        this.ledBar      = xml.select("#led-bar");
        this.marker      = xml.select("#marker");
        this.markerText  = xml.select("#marker-text");
        this.clipNode    = xml.select("#clip-path");
        this.clipPath    = this.clipNode.select("path");
        this.clipSubPath = this.clipPath.clone();
        this.arcX        = this.guides.select("#center").attr("cx");
        this.arcY        = this.guides.select("#center").attr("cy");
        this.viewBox     = this.svg.node.viewBox.baseVal;
        this.viewPort    = this.svg.node.getBoundingClientRect();

        if (this.inverted) this.invert(); // flip gauge horizontally

        this.marker.click(this.resetMarker); // click on marker to reset
        
        this.drawLegend();
        this.drawTicks();
        this.shiftColor(this.colorshift);

        this.ledBar.attr({ 'mask': this.clipSubPath });

        this.grp.append(this.marker);
        this.grp.append(this.ticks);
        this.grp.append(this.legend);
        this.grp.append(this.scaleLine);
        this.grp.append(this.ledBar);

        this.setValue(this.scaleMin);
        this.setMarker(this.scaleMin);
    },

    componentDidUpdate: function() {
        this.setValue(this.value);
    },

    render: function() {
        this.value = parseFloat(this.props.value).toFixed(this.precision)
        this.value = Math.min(this.value, this.scaleMax);
        this.value = Math.max(this.value, this.scaleMin);

        var invertStyle = (this.inverted) ? styles.inverted : {};

        return (
            <div style={{ width:'100%', height:'100%' }}>
                <svg id={this.props.id} viewBox="0 0 520 520" width="100%" height="100%" />
                <div style={[styles.value, invertStyle]}>{this.value}</div>
                <div style={[styles.units, invertStyle]}>{this.props.units}</div>
            </div>
        );
    },

    // instance methods -------------------------------------------------------

    setValue: function(val) {
        var path = this.getSubPath(val, this.clipPath); 
        this.clipSubPath.attr('d', path);

        if (val > this.markerMax) this.setMarker(val);
    },

    invert: function() {
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

    getPointOnPath: function(val, path) {
        var pathLen = path.getTotalLength();
        var subLen  = this.mapNum(val, this.scaleMin, this.scaleMax, 0, pathLen);
        var point   = path.getPointAtLength(subLen);
        return point;
    },

    getSubPath: function(val, path) {
        var pathLen = path.getTotalLength();
        var subLen  = this.mapNum(val, this.scaleMin, this.scaleMax, 0, pathLen);
        var subPath = path.getSubpath(0, subLen);
        return subPath;
    },

    drawLegend: function() {
        for (var n = this.scaleMin; n <= this.scaleMax; n += this.scaleTick) {
            var point = this.getPointOnPath(n, this.clipPath);
            var text = this.legend.text(point.x, point.y, n);
            $(text.node).css(styles.legendtext);
            if (this.inverted) text.transform("s-1,1");
        }
    },

    drawTicks: function() {
        $(this.ticks.node).css(styles.ticks);

        for (var n = this.scaleMin; n <= this.scaleMax; n += this.scaleTick/2) {
            var point = this.getPointOnPath(n, this.clipPath);
            var angle = Snap.angle(this.arcX, this.arcY, point.x, point.y);

            if (angle > 90 && angle < 270) angle = 90; 

            this.ticks.line(point.x + 15, point.y, point.x + 10, point.y).
                transform("r" + angle + "," + point.x + "," + point.y);
        }
    },

    resetMarker: function() {
        this.setMarker(this.scaleMin);
        window.event.stopPropagation();
    },

    setMarker: function(val) {
        var point = this.getPointOnPath(val, this.clipPath);
        var angle = Snap.angle(this.arcX, this.arcY, point.x, point.y);

        if (angle > 90 && angle < 270) angle = 90; 
        this.marker.transform("R" + angle + ",0,0" + "T" + point.x + "," + point.y);

        this.markerText.attr({ text: val });
        this.markerMax = val;
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
        fontSize: '2vh'
    },

    ticks: {
        stroke: '#666',   
        strokeWidth: '3px',
    }
}

module.exports = Radium(ArcReactor);