var Vesc = (function() {
	var mote_state = function() {
		this.js_x = 0;
		this.js_y = 0;
		this.bt_c = false;
		this.bt_z = false;
		this.vbat = 0.0;
	};

	var bldcMeasure = function() {
		// 7 values int16_t not read(14 byte)
		this.avgMotorCurrent = 0.0;
		this.avgInputCurrent = 0.0;
		this.dutyCycleNow = 0.0;
		this.rpm = 0;
		this.inpVoltage = 0.0;
		this.ampHours = 0.0;
		this.ampHoursCharged = 0.0;
		// 2 values int32_t not read (8 byte)
		this.tachometer = 0;
		this.tachometerAbs = 0;
	};

	var CommPacketId = {
		COMM_FW_VERSION: 		  0,
		COMM_JUMP_TO_BOOTLOADER:  1,
		COMM_ERASE_NEW_APP: 	  2,
		COMM_WRITE_NEW_APP_DATA:  3,
		COMM_GET_VALUES: 		  4,
		COMM_SET_DUTY: 			  5,
		COMM_SET_CURRENT: 		  6,
		COMM_SET_CURRENT_BRAKE:   7,
		COMM_SET_RPM: 			  8,
		COMM_SET_POS: 			  9,
		COMM_SET_DETECT: 		 10,
		COMM_SET_SERVO_POS: 	 11,
		COMM_SET_MCCONF: 		 12,
		COMM_GET_MCCONF: 		 13,
		COMM_SET_APPCONF: 		 14,
		COMM_GET_APPCONF: 		 15,
		COMM_SAMPLE_PRINT: 		 16,
		COMM_TERMINAL_CMD: 		 17,
		COMM_PRINT: 			 18,
		COMM_ROTOR_POSITION: 	 19,
		COMM_EXPERIMENT_SAMPLE:  20,
		COMM_DETECT_MOTOR_PARAM: 21,
		COMM_REBOOT: 			 22,
		COMM_ALIVE: 			 23,
		COMM_GET_DECODED_PPM: 	 24,
		COMM_GET_DECODED_ADC: 	 25,
		COMM_GET_DECODED_CHUK:   26,
		COMM_FORWARD_CAN: 		 27
	};

	var pack = function(payload) {
		var crc = Util.crc16(payload);
		var count = 0;
		var msg = new Uint8Array(256);
		var len = payload.length;

		if (len <= 256) {
			msg[count++] = 2;
			msg[count++] = len;
		} else {
			msg[count++] = 3;
			msg[count++] = (len >> 8);
			msg[count++] = (len & 0xFF);
		}

		msg.set(payload, count, len);
		count += len;

		msg[count++] = (crc >> 8);
		msg[count++] = (crc & 0xFF);
		msg[count++] = 3;

		return msg;
	};

	var pack2 = function(payload) {
		var crc = Util.crc16(payload);
		var len = payload.length;
		var msg = "2" + len + payload + (crc >> 8) + (crc & 0xFF) + "3\n";
		return msg;
	};

    var onCommError = function(error) {
        console.log(error);
    };

    var onDataReceived = function(data) {
		// this.temp_mos1 = 0.0;
		// this.temp_mos3 = 0.0;
		// this.temp_mos2 = 0.0;
		// this.temp_mos4 = 0.0;
		// this.temp_mos5 = 0.0;
		// this.temp_mos6 = 0.0;
		// this.temp_pcb = 0.0;
		// this.current_motor = 0.0;
		// this.current_in = 0.0;
		// this.duty_now = 0.0;
		// this.rpm = 0.0;
		// this.v_in = 0.0;
		// this.amp_hours = 0.0;
		// this.amp_hours_charged = 0.0;
		// this.watt_hours = 0.0;
		// this.watt_hours_charged = 0.0;
		// this.tachometer = 0;
		// this.tachometer_abs = 0;
		// this.fault_code = '';
        console.log(data);
    };

	return {

		readValues: function() {
			console.log("reading values...");
			bluetoothSerial.read(
				function(data) {
					console.log(data);
				}, onCommError
			);
		},

		startListening: function() {
            bluetoothSerial.subscribe('\n', onDataReceived, onCommError);
            console.log("listening for data");
		},

		stopListening: function() {
            bluetoothSerial.unsubscribe(
            	function() {
            		console.log("stopped listening");
            	}, onCommError
            );
		},

		requestValues: function() {
			var cmd = CommPacketId.COMM_FW_VERSION.toString();
			var msg = pack2(cmd);
			var msg = new Uint8Array([0x02, 0x01, 0x04, 0x40, 0x84, 0x03]);

			for (var i=0; i< msg.length; i++) {
				bluetoothSerial.write(msg[i]);
			}

            // bluetoothSerial.write(msg, 
            // 	function() {
            // 		console.log(msg);
            // 	}, onCommError
            // );
		}
	};

})();