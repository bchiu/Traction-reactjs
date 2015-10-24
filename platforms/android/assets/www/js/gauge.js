/*
    Bi-directional donut gauge (negative values change direction)
    note: min and max must always be positive numbers
*/
Gauge = function(id, min, max, step, title, units) {
    this.dial = $('#'+id);

    this.dial.knob({
        min: Math.abs(min),
        max: Math.abs(max),
        step: step,
        angleOffset: 270,
        angleArc: 360,
        stopper: false,
        readOnly: true,
        rotation: 'clockwise',
        biDirectional: true,
        biColor: '#FF9900',
        displayMax: true
    });

    this.set = function(newVal) {
        this.dial.val(newVal).trigger('change');
    }
}
