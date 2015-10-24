// gauge wrapper
Gauge = function(id, min, max, title, label) {

    this.obj = new JustGage({
        id: id,
        value: 0,
        min: min,
        max: max,
        label: label,
        title: title,
        donut: true,
        donutStartAngle: 0,
        refreshAnimationType: 'linear',
        refreshAnimationTime: 0,
        relativeGaugeSize: true
    });

    this.min = min;

    this.max = max;

    this.set = function(newVal) {
        newVal = parseFloat(newVal).toFixed(1);
        curVal = parseFloat(this.obj.txtValue.attr("text")).toFixed(1);
        if (newVal != curVal) {
          this.obj.refresh(newVal);
        }
    };
}
