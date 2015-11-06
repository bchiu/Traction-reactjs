module.exports = (function() {
    var currPacket = [];
    var data       = {};
    var listening  = false;

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
    };

    function crc16_ccitt(buf) {
        var table = [0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d, 0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823, 0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70, 0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067, 0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634, 0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a, 0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0];
        var crc = 0x0;
        var len = buf.length;
        for (var i = 0; i < len; i++) {
            var byte = buf[i];
            crc = (table[((crc >> 8) ^ byte) & 0xff] ^ (crc << 8)) & 0xffff;
        }
        return crc;
    }

    function pack(payload) {
        var msg = new Uint8Array(256);
        var crc = crc16_ccitt(payload);
        var len = payload.length;
        var count = 0;

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

        return msg.subarray(0, count);
    }

    function sliceInt16(buf, scale, index) {
        var res = buf[index] << 8 | buf[index+1];
        return res/scale;
    }

    function sliceInt32(buf, scale, index) {
        var res = buf[index] << 24 | buf[index+1] << 16 | buf[index+2] << 8 | buf[index+3];
        return res/scale;
    }

    function unpack(packet) {
        var i = 3;
        data['temp_mos1']           = sliceInt16(packet, 10.0,    i); i += 2;
        data['temp_mos2']           = sliceInt16(packet, 10.0,    i); i += 2;
        data['temp_mos3']           = sliceInt16(packet, 10.0,    i); i += 2;
        data['temp_mos4']           = sliceInt16(packet, 10.0,    i); i += 2;
        data['temp_mos5']           = sliceInt16(packet, 10.0,    i); i += 2;
        data['temp_mos6']           = sliceInt16(packet, 10.0,    i); i += 2;
        data['controller_temp_c']   = sliceInt16(packet, 10.0,    i); i += 2;
        data['motor_phase_current'] = sliceInt32(packet, 100.0,   i); i += 4;
        data['battery_current']     = sliceInt32(packet, 100.0,   i); i += 4;
        data['motor_duty_cycle']    = sliceInt16(packet, 1000.0,  i); i += 2;
        data['motor_rpm']           = sliceInt32(packet, 1.0,     i); i += 4;
        data['battery_voltage']     = sliceInt16(packet, 10.0,    i); i += 2;
        data['amp_hours']           = sliceInt32(packet, 10000.0, i); i += 4;
        data['amp_hours_charged']   = sliceInt32(packet, 10000.0, i); i += 4;
        data['watt_hours']          = sliceInt32(packet, 10000.0, i); i += 4;
        data['watt_hours_charged']  = sliceInt32(packet, 10000.0, i); i += 4;
        data['tachometer']          = sliceInt32(packet, 1.0,     i); i += 4;
        data['tachometer_abs']      = sliceInt32(packet, 1.0,     i); i += 4;
        data['fault_code']          = packet[i++];
        data['fault_str']           = FAULT_CODES[data.fault_code];
        //console.log(data);
    }

    function onError(error) {
        console.log(error);
    }

    function onDataReady(buf) {
        var packet = Array.prototype.slice.call(new Uint8Array(buf));
        var firstByte = packet[0];
        var lastByte  = packet[packet.length-1];

        currPacket = (firstByte == 2) ? packet : currPacket.concat(packet);

        if (lastByte == 3) {
            unpack(currPacket);
            //console.log(currPacket);
        }
    }

    return {

        bindData: function(dataToBind) {
            data = dataToBind;
        },

        startListening: function() {
            listening = true;
            bluetoothSerial.subscribeRawData(onDataReady, onError);
            console.log("Listening for data");
        },

        stopListening: function() {
            listening = false;
            bluetoothSerial.unsubscribeRawData();
            console.log("Stopped listening for data");
        },

        requestValues: function() {
            if (!listening) return;
            var cmd = COMM_PACKET_ID.COMM_GET_VALUES;
            var msg = pack([cmd]);
            bluetoothSerial.write(msg);
            //console.log(msg);
        }
    };

})();