var ProtoDrive = require('../ProtoDrive');

module.exports = new function() {

    ProtoDrive.call(this);

    this.packet = [];

    var FAULT_CODES = [
        "FAULT_CODE_NONE",
        "FAULT_CODE_OVER_VOLTAGE",
        "FAULT_CODE_UNDER_VOLTAGE",
        "FAULT_CODE_DRV8302",
        "FAULT_CODE_ABS_OVER_CURRENT",
        "FAULT_CODE_OVER_TEMP_FET",
        "FAULT_CODE_OVER_TEMP_MOTOR"
    ];

    var COMM_PACKET_ID = {
        COMM_FW_VERSION:          0,
        COMM_JUMP_TO_BOOTLOADER:  1,
        COMM_ERASE_NEW_APP:       2,
        COMM_WRITE_NEW_APP_DATA:  3,
        COMM_GET_VALUES:          4,
        COMM_SET_DUTY:            5,
        COMM_SET_CURRENT:         6,
        COMM_SET_CURRENT_BRAKE:   7,
        COMM_SET_RPM:             8,
        COMM_SET_POS:             9,
        COMM_SET_DETECT:         10,
        COMM_SET_SERVO_POS:      11,
        COMM_SET_MCCONF:         12,
        COMM_GET_MCCONF:         13,
        COMM_SET_APPCONF:        14,
        COMM_GET_APPCONF:        15,
        COMM_SAMPLE_PRINT:       16,
        COMM_TERMINAL_CMD:       17,
        COMM_PRINT:              18,
        COMM_ROTOR_POSITION:     19,
        COMM_EXPERIMENT_SAMPLE:  20,
        COMM_DETECT_MOTOR_PARAM: 21,
        COMM_REBOOT:             22,
        COMM_ALIVE:              23,
        COMM_GET_DECODED_PPM:    24,
        COMM_GET_DECODED_ADC:    25,
        COMM_GET_DECODED_CHUK:   26,
        COMM_FORWARD_CAN:        27
    }

/* prototype overrides *******************************************************/

    this.serialize = function(payload) {
        var packet = new Uint8Array(256);
        var crc = this.crc16_ccitt(payload);
        var len = payload.length;
        var count = 0;

        if (len <= 256) {
            packet[count++] = 2;
            packet[count++] = len;
        } else {
            packet[count++] = 3;
            packet[count++] = (len >> 8);
            packet[count++] = (len & 0xFF);
        }

        packet.set(payload, count, len);
        count += len;

        packet[count++] = (crc >> 8);
        packet[count++] = (crc & 0xFF);
        packet[count++] = 3;

        return packet.subarray(0, count);
    }

    this.deserialize = function(packet) {
        var firstByte = packet[0];
        var lastByte  = packet[packet.length-1];

        // start new packet if first byte found else concat packet
        this.packet = (firstByte == 2) ? packet : this.packet.concat(packet);

        // packet complete, execute command
        if (lastByte == 3) {
            var command = this.packet[2];
            var payload = this.packet.slice(3, this.packet.length-3);

            with (COMM_PACKET_ID) {
                switch (command) {
                    case COMM_GET_VALUES: 
                        this.receiveData(payload);
                        //console.log(payload);
                        break;
                    case COMM_FW_VERSION:         break;
                    case COMM_JUMP_TO_BOOTLOADER: break;
                    case COMM_ERASE_NEW_APP:      break;
                    case COMM_WRITE_NEW_APP_DATA: break;
                    case COMM_SET_DUTY:           break;
                    case COMM_SET_CURRENT:        break;
                    case COMM_SET_CURRENT_BRAKE:  break;
                    case COMM_SET_RPM:            break;
                    case COMM_SET_POS:            break;
                    case COMM_SET_DETECT:         break;
                    case COMM_SET_SERVO_POS:      break;
                    case COMM_SET_MCCONF:         break;
                    case COMM_GET_MCCONF:         break;
                    case COMM_SET_APPCONF:        break;
                    case COMM_GET_APPCONF:        break;
                    case COMM_SAMPLE_PRINT:       break;
                    case COMM_TERMINAL_CMD:       break;
                    case COMM_PRINT:              break;
                    case COMM_ROTOR_POSITION:     break;
                    case COMM_EXPERIMENT_SAMPLE:  break;
                    case COMM_DETECT_MOTOR_PARAM: break;
                    case COMM_REBOOT:             break;
                    case COMM_ALIVE:              break;
                    case COMM_GET_DECODED_PPM:    break;
                    case COMM_GET_DECODED_ADC:    break;
                    case COMM_GET_DECODED_CHUK:   break;
                    case COMM_FORWARD_CAN:        break;
                }
            }
        }
    }

/* public commands ***********************************************************/

    this.requestData = function() { this.send([COMM_PACKET_ID.COMM_GET_VALUES]) }

    this.receiveData = function(payload) {
        var i = 0;
        this.data['temp_mos1']           = this.sliceInt16(payload, 10.0,    i); i += 2;
        this.data['temp_mos2']           = this.sliceInt16(payload, 10.0,    i); i += 2;
        this.data['temp_mos3']           = this.sliceInt16(payload, 10.0,    i); i += 2;
        this.data['temp_mos4']           = this.sliceInt16(payload, 10.0,    i); i += 2;
        this.data['temp_mos5']           = this.sliceInt16(payload, 10.0,    i); i += 2;
        this.data['temp_mos6']           = this.sliceInt16(payload, 10.0,    i); i += 2;
        this.data['controller_temp_c']   = this.sliceInt16(payload, 10.0,    i); i += 2;
        this.data['motor_phase_current'] = this.sliceInt32(payload, 100.0,   i); i += 4;
        this.data['battery_current']     = this.sliceInt32(payload, 100.0,   i); i += 4;
        this.data['motor_duty_cycle']    = this.sliceInt16(payload, 1000.0,  i); i += 2;
        this.data['motor_rpm']           = this.sliceInt32(payload, 1.0,     i); i += 4;
        this.data['battery_voltage']     = this.sliceInt16(payload, 10.0,    i); i += 2;
        this.data['amp_hours']           = this.sliceInt32(payload, 10000.0, i); i += 4;
        this.data['amp_hours_charged']   = this.sliceInt32(payload, 10000.0, i); i += 4;
        this.data['watt_hours']          = this.sliceInt32(payload, 10000.0, i); i += 4;
        this.data['watt_hours_charged']  = this.sliceInt32(payload, 10000.0, i); i += 4;
        this.data['tachometer']          = this.sliceInt32(payload, 1.0,     i); i += 4;
        this.data['tachometer_abs']      = this.sliceInt32(payload, 1.0,     i); i += 4;
        this.data['fault_code']          = payload[i++];
        this.data['fault_str']           = FAULT_CODES[this.data.fault_code];
        //console.log(this.data);
    }
}
