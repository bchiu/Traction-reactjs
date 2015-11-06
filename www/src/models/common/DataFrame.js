module.exports = function(config) {
	this.data = {}

	function randInt(ceiling) {
		return Math.round(Math.random() * ceiling);
	}

	function randFloat(floor, ceiling, decimals) {
		return parseFloat(Math.random().map(0, 1, floor, ceiling).toFixed(decimals));
	}

	for (var key in config) {
		this.data[key] = config[key].min;
	}

	// this.temp_mos1 = 0.0;
	// this.temp_mos3 = 0.0;
	// this.temp_mos2 = 0.0;
	// this.temp_mos4 = 0.0;
	// this.temp_mos5 = 0.0;
	// this.temp_mos6 = 0.0;
	// this.controller_temp_c = 0.0;
 //    this.motor_temp_c = 0.0;
	// this.motor_phase_current = 0.0;
	// this.battery_current = 0.0;
	// this.motor_duty_cycle = 0.0;
	// this.motor_rpm = 0.0;
	// this.battery_voltage = 0.0;
	// this.amp_hours = 0.0;
	// this.amp_hours_charged = 0.0;
	// this.watt_hours = 0.0;
	// this.watt_hours_charged = 0.0;
	// this.motor_rpm = 0;
	// this.tachometer_abs = 0;

	// this.battery_temp_c = 0.0;
 //    this.odometer_km = 0.0;
 //    this.speed_kph = 0;
 //    this.speed_mph = 0;
 //    this.power_w = 0;
 //    this.power_kw = 0.0;
 //    this.throttle_voltage = 0.0;
	// this.fault_code = '';

	this.randomize = function() {
		for (var key in this.data) {
			var min = this.data[key].min;
			var max = this.data[key].max;
			var precision = this.data[key].precision;
			this.data[key] = randFloat(min, max, precision);
		}

		// this.temp_mos1           = randFloat(20, 120, 0);
		// this.temp_mos3           = randFloat(20, 120, 0);
		// this.temp_mos2           = randFloat(20, 120, 0);
		// this.temp_mos4           = randFloat(20, 120, 0);
		// this.temp_mos5           = randFloat(20, 120, 0);
		// this.temp_mos6           = randFloat(20, 120, 0);
		// this.controller_temp_c   = randFloat(20, 120, 0);
  //       this.motor_temp_c        = randFloat(20, 120, 0);
		// this.motor_phase_current = randFloat(0,  200, 0);
		// this.battery_current     = randFloat(-80, 200, 0);
		// this.motor_duty_cycle    = randFloat(0, 100, 0);
		// this.motor_rpm           = randFloat(0, 1000, 0);
		// this.battery_voltage     = randFloat(12.0, 16.8, 1);
		// this.amp_hours           = randFloat(0, 20, 1);
		// this.amp_hours_charged   = randFloat(0, 20, 1);
		// this.watt_hours          = randFloat(0, 500, 1);
		// this.watt_hours_charged  = randFloat(0, 500, 1);
		// this.motor_rpm           = randInt(10000);
		// this.tachometer_abs      = randInt(1000);

		// this.battery_temp_c      = randFloat(20, 80, 0);
  //       this.odometer_km         = randFloat(0, 200, 1);
  //       this.speed_kph           = randFloat(0, 100, 0);
  //       this.speed_mph           = randFloat(0, 100, 0);
  //       this.power_w             = randFloat(-3000, 10000, 0);
  //       this.power_kw            = randFloat(-5, 10, 1);
  //       this.throttle_voltage    = randFloat(0, 5, 1);
	}
}
