var React  = require('react');
var Radium = require('radium');

/*
    Gyro - gyrometer
*/
module.exports = Radium(React.createClass({

    getInitialState: function() {
        this.cX         = 500;
        this.cY         = 500;
        this.tickY      = 180;
        this.gaugeR     = 270;
        this.legendR    = 450;
        this.rollMax    = 45;
        this.rollIncr   = 15;
        this.pitchMax   = 45;
        this.pitchIncr  = 5;
        this.pitchSpace = 15;
        this.isZeroed   = false;

        return {
            roll: 0.0,
            pitch: 0.0
        }
    },

    componentDidMount: function() {
        window.addEventListener('deviceorientation', this.update, false);

        this.svg = Snap("#" + this.props.id)

        // gauge & legend layers
        this.gauge  = this.svg.g().attr({ id:'gauge'  });
        this.legend = this.svg.g().attr({ id:'legend' });

        // roll markers
        this.marker_left  = this.svg.polygon(235,475, 235,525, 185,500).attr({ id:'marker_left',  value:0, fill:'#FF0000', stroke:'none' });
        this.marker_right = this.svg.polygon(765,525, 765,475, 815,500).attr({ id:'marker_right', value:0, fill:'#FF0000', stroke:'none' });

        // roll marker click handlers
        this.marker_left.click(this.resetMarker.bind(this, this.marker_left));
        this.marker_right.click(this.resetMarker.bind(this, this.marker_right));

        // horizon semi-circle
        this.horizon = this.gauge.circle(this.cX, this.cY, this.gaugeR).attr({
            id: 'horizon',
            fill: this.svg.gradient("r(0.5, 0.5, 0.5)#F99E39-#ED6430"),
            mask: this.svg.rect(this.cX - this.gaugeR, this.cY, this.gaugeR * 2, this.gaugeR).attr({ fill:'white' })
        });

        // circle outline
        this.circle_border = this.legend.circle(this.cX, this.cY, this.gaugeR).attr(styles.border);

        // pitch gauge layer mask
        this.pitch_mask = this.gauge.g().attr({ 
            id: 'pitch_mask', 
            mask: this.circle_border.clone().attr({ fill:'white' })
        });

        // moving pitch gauge
        this.pitch_gauge = this.pitch_mask.g().attr({ id:'pitch_gauge' });

        // pitch gauge lines & labels
        for (var i = 0; i <= this.pitchMax; i += this.pitchIncr) {
            this.pitch_gauge.line(this.cX-50, this.cY + i * this.pitchSpace, this.cX+50, this.cY + i * this.pitchSpace).attr({ stroke:'white', 'stroke-width':4 });
            this.pitch_gauge.line(this.cX-50, this.cY - i * this.pitchSpace, this.cX+50, this.cY - i * this.pitchSpace).attr({ stroke:'white', 'stroke-width':4 });
            this.pitch_gauge.text(this.cX-90, this.cY - i * this.pitchSpace,  i.toString()).attr(styles.font_50); // left positive
            this.pitch_gauge.text(this.cX+90, this.cY - i * this.pitchSpace,  i.toString()).attr(styles.font_50); // right positive
            this.pitch_gauge.text(this.cX-90, this.cY + i * this.pitchSpace, -i.toString()).attr(styles.font_50); // left negative
            this.pitch_gauge.text(this.cX+90, this.cY + i * this.pitchSpace, -i.toString()).attr(styles.font_50); // right negative
        }

        // attitude line
        this.legend.polyline(770.6,500, 575,500, 550,525, 500,475, 450,525, 425,500, 229.4,500).attr(styles.arrow);

        // thick roll ticks
        this.ticks_thick = this.legend.g().attr({ 'id':'ticks_thick', 'stroke':'white', 'stroke-width':8 });
        for (var i = this.rollMax; i <= this.rollMax + 90; i += this.rollIncr) {
            var tick = this.ticks_thick.line(this.cX, this.tickY, this.cX, this.tickY - 50);
            tick.transform("r" + i + "," + this.cX + "," + this.cY);
            tick.clone().transform("r-" + i + "," + this.cX + "," + this.cY);
        }

        // thin roll ticks
        this.ticks_thin = this.legend.g().attr({ 'id':'ticks_thin', 'stroke':'white', 'stroke-width':2 });
        for (var i = this.rollMax; i <= this.rollMax + 90; i += 5) {
            var tick = this.ticks_thin.line(this.cX, this.tickY, this.cX, this.tickY - 50);
            tick.transform("r" + i + "," + this.cX + "," + this.cY);
            tick.clone().transform("r-" + i + "," + this.cX + "," + this.cY);
        }

        // roll degree labels
        this.degree_labels = this.legend.g().attr({ 'id':'degree_labels' });
        for (var i = this.rollMax, j = this.rollMax; i <= this.rollMax + 90; i += this.rollIncr, j -= this.rollIncr) {
            var p  = this.getPointOnCircle(this.legendR, this.cX, this.cY,  i);    // positive points
            var p2 = this.getPointOnCircle(this.legendR, this.cX, this.cY, -i);    // negative points
            this.degree_labels.text(p.x,  p.y,  j.toString()).attr(styles.font_60B); // positive labels
            this.degree_labels.text(p2.x, p2.y, j.toString()).attr(styles.font_60B); // negative labels
        }

        // roll text value
        this.roll_text  = this.degree_labels.text(this.cX, this.cY - this.gaugeR - 150, "0°").attr(styles.font_80B);
        this.roll_text2 = this.roll_text.clone().transform("t0,80").attr({ text:'lean', 'font-size':60 });

        // pitch text value
        this.pitch_text  = this.degree_labels.text(this.cX, this.cY + this.gaugeR + 150, "0°").attr(styles.font_80B);
        this.pitch_text2 = this.pitch_text.clone().transform("t0,-80").attr({ text:'level', 'font-size':60 });
    },

    componentDidUpdate: function() {
    },

    render: function() {
        return (
            <div style={{ width:'100%', height:'100%' }}>
                <svg id="gyro" viewBox="0 0 1000 1000" height="100%"></svg>
            </div>
        );
    },

/* instance methods **********************************************************/

    setMarker: function(marker, degrees) {
        marker.animate({ transform: "r" + degrees + "," + this.cX + "," + this.cY }, 300, mina.bounce);
        marker.attr("value", degrees);
    },

    resetMarker: function(marker) {
        this.setMarker(marker, 0);
        window.event.stopPropagation();
    },

    // Function gets point(x,y) on circle at given angle
    getPointOnCircle: function(r, cx, cy, angle) {
        var x = cx + r * Math.sin(angle * Math.PI/180);
        var y = cy - r * Math.cos(angle * Math.PI/180);
        return { x: x, y: y };  
    },

    // set roll angle
    roll: function(degrees) {
        this.gauge.animate({ transform: "r" + degrees + "," + this.cX + "," + this.cY }, 300, mina.bounce);
        this.roll_text.attr({ text: degrees.toFixed(1) + "°" })

        if (Math.round(degrees) == 0) {
            this.roll_text2.attr({ text: "lean" });
        } else if (degrees > 0) {
            this.roll_text2.attr({ text: "< lean" });
            if (degrees > this.marker_left.attr("value")) this.setMarker(this.marker_left, degrees);
        } else {
            this.roll_text2.attr({ text: "lean >" });
            if (degrees < this.marker_right.attr("value")) this.setMarker(this.marker_right, degrees);
        }
    },

    // set pitch angle
    pitch: function(degrees) {
        this.pitch_gauge.animate({ transform: "t0," + (degrees * this.pitchSpace) }, 300, mina.bounce);
        this.pitch_text.attr({ text: degrees.toFixed(1) + "°" });
        
        if (Math.round(degrees) == 0) this.pitch_text2.attr({ text: "level" });
        else if (degrees > 0) this.pitch_text2.attr({ text: "uphill" });
        else this.pitch_text2.attr({ text: "downhill" });
    },

    // update roll, pitch on DeviceOrientationEvent
    update: function(eventData) {
        if (!window.DeviceOrientationEvent || isNaN(eventData.beta) || isNaN(eventData.gamma)) return;

        if (!this.isZeroed) {
            this.rollZero  = eventData.beta;
            this.pitchZero = eventData.gamma;
            this.isZeroed  = true;
            console.log("Roll, pitch zeroed to: " + this.rollZero + ", " + this.pitchZero);
        }

        var rollAngle  = this.rollZero  - eventData.beta;
        var pitchAngle = this.pitchZero - eventData.gamma;

        if (rollAngle  <= this.rollMax  && rollAngle  >= -this.rollMax)  this.roll(rollAngle);
        if (pitchAngle <= this.pitchMax && pitchAngle >= -this.pitchMax) this.pitch(pitchAngle);
        //console.log("gamma=" + eventData.gamma + ", beta=" + eventData.beta + ", alpha=" + eventData.alpha);              
    }
}));

var styles = {

    arrow: {
        'fill': 'none',
        'stroke': '#FF0000', 
        'stroke-width': 8,
        'stroke-miterlimit': 10,
    },

    border: {
        'fill': 'none',
        'stroke': 'cyan',
        'stroke-width': 8
    },

    font: {
        'color': 'white',
        'fill': '#ffffff',
        'stroke': 'none',
        'font-family': 'Calibri',
        'text-anchor': 'middle',
        'alignment-baseline': 'middle' 
    },

    font_50: {
        'font-size': '50'
    },

    font_60B: {
        'font-size': '60',
        'font-weight':'bold'
    },

    font_80B: {
        'font-size': '80',
        'font-weight': 'bold'
    }
}

$.extend(styles.font_50,  styles.font);
$.extend(styles.font_60B, styles.font);
$.extend(styles.font_80B, styles.font);
