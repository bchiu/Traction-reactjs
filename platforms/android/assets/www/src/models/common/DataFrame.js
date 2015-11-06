module.exports = function() {

	function randInt(ceiling) {
		return Math.round(Math.random() * ceiling);
	}

	function randFloat(floor, ceiling, decimals) {
		return parseFloat(Math.random().map(0, 1, floor, ceiling).toFixed(decimals));
	}

	this.temp_mos1 = 0.0;
	this.temp_mos3 = 0.0;
	this.temp_mos2 = 0.0;
	this.temp_mos4 = 0.0;
	this.temp_mos5 = 0.0;
	this.temp_mos6 = 0.0;
	this.temp_pcb = 0.0;
    this.temp_motor = 0.0;
	this.current_motor = 0.0;
	this.current_in = 0.0;
	this.duty_now = 0.0;
	this.rpm = 0.0;
	this.v_in = 0.0;
	this.amp_hours = 0.0;
	this.amp_hours_charged = 0.0;
	this.watt_hours = 0.0;
	this.watt_hours_charged = 0.0;
	this.tachometer = 0;
	this.tachometer_abs = 0;

	this.temp_battery = 0.0;
    this.odometer = 0.0;
    this.speed = 0;
    this.power = 0;
    this.power_kw = 0.0;
    this.throttle_v = 0.0;
	this.fault_code = '';

	this.randomize = function() {
		this.temp_mos1          = randFloat(20, 120, 0);
		this.temp_mos3          = randFloat(20, 120, 0);
		this.temp_mos2          = randFloat(20, 120, 0);
		this.temp_mos4          = randFloat(20, 120, 0);
		this.temp_mos5          = randFloat(20, 120, 0);
		this.temp_mos6          = randFloat(20, 120, 0);
		this.temp_pcb           = randFloat(20, 120, 0);
        this.temp_motor         = randFloat(20, 120, 0);
		this.current_motor      = randFloat(20, 120, 1);
		this.current_in         = randFloat(-80, 200, 0);
		this.duty_now           = randFloat(0, 100, 0);
		this.rpm                = randFloat(0, 1000, 0);
		this.v_in               = randFloat(12.0, 16.8, 1);
		this.amp_hours          = randFloat(0, 20, 1);
		this.amp_hours_charged  = randFloat(0, 20, 1);
		this.watt_hours         = randFloat(0, 500, 1);
		this.watt_hours_charged = randFloat(0, 500, 1);
		this.tachometer         = randInt(1000);
		this.tachometer_abs     = randInt(1000);

		this.temp_battery 		= randFloat(20, 80, 0);
        this.odometer           = randFloat(0, 100, 1);
        this.speed              = randFloat(0, 100, 0);
        this.power              = randFloat(-1000, 1000, 0);
        this.power_kw           = randFloat(-5, 10, 1);
        this.throttle_v         = randFloat(0, 5, 1);
	}
}
