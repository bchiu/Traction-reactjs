var Devices = (function() {
    var connected = false;
    var bluetooth = false;  // bluetooth on?
    var container = null;   // modal container
    var list = null;        // devices list
    var button = null;      // devices button
    var message = null;     // discovery message
    var spinner = null;     // reusable spinner
    var deviceId = '';      // selected device id
    var data = '';

    var devices = [
        {"name":"HC-06",   "address":"98:D3:31:20:57:E0", "id":"98:D3:31:20:57:E0", "class":7936},
        {"name":"Mi Note", "address":"98:D3:31:20:57:E1", "id":"98:D3:31:20:57:E1", "class":7936},
        {"name":"Nexus 7", "address":"98:D3:31:20:57:E2", "id":"98:D3:31:20:57:E2", "class":7936},
        {"name":"Nexus 4", "address":"98:D3:31:20:57:E3", "id":"98:D3:31:20:57:E3", "class":7936}
    ];

    // this runs when the device is ready for user interaction:
    var onDeviceReady = function() {
    };

    var openList = function() {
        if (!window.cordova) { updateList(); message.show(); return } // for local development

        bluetoothSerial.enable(
            function() { 
                bluetooth = true;
                refreshDevices();
            }, 
            function(event) { 
                bluetooth = false; 
                handleError(event);
            }
        );
    };

    var refreshDevices = function() {
        //message.show();

        bluetoothSerial.list(
            function(results) { 
                devices = results; 
                updateList();
            }, handleError
        );

        bluetoothSerial.discoverUnpaired(
            function(results) { 
                message.hide();
                bluetoothSerial.clearDeviceDiscoveredListener();
            }, handleError
        );

        bluetoothSerial.setDeviceDiscoveredListener(
            function(device) {
                devices = devices.concat(device);
                updateList();
            }
        );
    };

    var updateList = function() {
        list.empty();
        devices.map(function(device) {
            var a = $("<a href='#' class='list-group-item'>" + 
                    "<img src='img/ic_bluetooth_black_24px.svg'/> " +
                    device.name + 
                    " (" + device.id + ")</a>");
            a.attr('id', device.id);
            a.click(function() { Devices.connect(device.id) });
            if (device.id == deviceId) a.addClass('active');
            list.append(a);
        });
    };

    var handleError = function(error) {
        bluetoothSerial.clearDeviceDiscoveredListener();
        button.removeClass("btn-info");
        container.modal('hide');
        message.hide();
        deviceId = '';
        alert(error);
    };

    var getDeviceById = function(uuid) {
        var results = $.grep(devices, function(d) { return d.id == uuid });
        return results[0];
    };

    // public interface
    return {
        initialize: function(id) {
            container = $('#'+id);
            list      = $('#'+id+'-list');
            button    = $('#'+id+'-button');
            message   = $('#'+id+'-message');
            spinner   = $('#'+id+'-spinner');

            container.on('show.bs.modal', openList);
            document.addEventListener('deviceready', onDeviceReady, false);
        },

        connect: function(uuid) {
            Spinner.remove(deviceId);
            Spinner.append(uuid, '20px', 'float:right');
            message.hide();
            deviceId = uuid;
            connected = false;

            if (bluetooth) {
                bluetoothSerial.connect(uuid,
                    function() {
                        bluetoothSerial.clearDeviceDiscoveredListener();
                        button.addClass("btn-info");
                        Spinner.remove(uuid);
                        container.modal('hide');
                        connected = true;
                        console.log("Connected to: " + uuid);

                        Vesc.startListening();
                        setTimeout(function() {
                            Vesc.requestValues();
                        }, 5000);
                    }, handleError
                );
            }
        }
    };
})();
