// gauge wrapper
Gauge = function(id, minValue, maxValue, title, units) {

  this.obj = new JustGage({
    id: id,
    value: 0,
    min: minValue,
    max: maxValue,
    label: units,
    title: title,
    donut: true,
    donutStartAngle: 0,
    refreshAnimationType: 'linear',
    refreshAnimationTime: 0,
    relativeGaugeSize: true
  });

  this.min = minValue;

  this.max = maxValue;

  this.set = function(newVal) {
    newVal = parseFloat(newVal).toFixed(1);
    curVal = parseFloat(this.obj.txtValue.attr("text")).toFixed(1);
    if (newVal != curVal) {
      this.obj.refresh(newVal);
    }
  }
}