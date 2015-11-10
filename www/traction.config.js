/*
	Main config - set layout, model and data parameters for ui components 
*/
module.exports = {

	title: 'Traction',

	layout: 'SubMission', // EasySlider | SubMission

	model: 'Vesc', // Vesc | Mobipus

	fps: 30, 

 	// available layouts

	layouts: [
		'EasySlider',
		'SubMission'
	],

 	// data parameters

	params: {

		battery_voltage: {
			title: 'Battery',
			units: 'V',
			min: 12.0,
			max: 16.8,
			step: 0.5,
			precision: 1
		},

		battery_current: {
			title: 'Current',
			units: 'A',
			min: -80,
			max: 200,
			step: 20,
			precision: 0
		},

        power_kw: {
        	title: 'Power', 
            units: 'KW',
            min: -4.0, 
            max: 10.0,
            step: 1.0,
            precision: 1
        },

		power_w: {
        	title: 'Power', 
            units: 'W',
            min: -5000, 
            max: 10000,
            step: 100,
            precision: 0
		},

		speed_kph: {
			title: 'Speed',
			units: 'KPH',
			min: 0,
			max: 260,
			step: 20,
			precision: 0
		},

		speed_mph: {
			title: 'Speed',
			units: 'MPH',
			min: 0,
			max: 160,
			step: 20,
			precision: 0
		},

		odometer_km: {
			title: 'Distance',
			units: 'KM',
			min: 0,
			max: 200,
			step: 20,
			precision: 1
		},

		odometer_mi: {
			title: 'Distance',
			units: 'Miles',
			min: 0,
			max: 200,
			step: 20,
			precision: 1
		},

		motor_duty_cycle: {
			title: 'Duty Cycle',
			units: '%',
			min: 0,
			max: 100,
			step: 10,
			precision: 0
		},

		motor_temp_c: {
			title: 'Motor (T)',
			units: '°C',
			min: 24,
			max: 120,
			step: 10,
			precision: 0
		},

		motor_rpm: {
			title: 'RPM',
			units: '',
			min: 0,
			max: 10000,
			step: 200,
			precision: 0
		},

		motor_phase_current: {
			title: 'Phase',
			units: 'A',
			min: 0,
			max: 200,
			step: 40,
			precision: 0
		},

		controller_temp_c: {
			title: 'Drive (T)',
			units: '°C',
			min: 24,
			max: 120,
			step: 10,
			precision: 0
		},

		battery_temp_c: {
			title: 'Battery (T)',
			units: '°C',
			min: 24,
			max: 120,
			step: 5,
			precision: 0
		},

		throttle_voltage: {
			title: 'Throttle',
			units: 'V',
			min: 0.0,
			max: 5.0,
			step: 1.0,
			precision: 1
		},

		throttle_percent: {
			title: 'Throttle',
			units: '%',
			min: 0,
			max: 100,
			step: 10,
			precision: 0
		},

		amp_hours: {
			title: 'Amp Hrs',
			units: '',
			min: 0.0,
			max: 20.0,
			step: 1.0,
			precision: 1
		},

		watt_hours: {
			title: 'Watt Hrs',
			units: '',
			min: 0,
			max: 500,
			step: 50,
			precision: 0
		}
	},

	// user preferences

	user: {
		wheel_circumference_mm: {
			title: 'Wheel Circumference',
			units: 'mm',
			value: 1250,
			precision: 0
		}
	}
}