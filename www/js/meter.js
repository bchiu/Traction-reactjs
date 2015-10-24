Meter = function(id) {
    this.meter   = $("#"+id).first();
    this.value   = $("#"+id+"-value").first();
    this.min     = this.meter.attr("min");
    this.max     = this.meter.attr("max");
    this.low     = this.meter.attr("low");
    this.high    = this.meter.attr("high");
    this.optimum = this.meter.attr("optimum");
    this.units   = this.meter.attr("units");

    this.set = function(newValue) {
        var currentValue = this.meter.attr("value");
        this.meter.attr("value", newValue);
        this.value.html(newValue + " " + this.units);
    }
}