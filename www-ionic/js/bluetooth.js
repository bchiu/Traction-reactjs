var bt = {
    macAddress: "98:d3:31:20:57:e0",  // HC-06 98:d3:31:20:57:e0
    chars: "",

    // Application constructor
    initialize: function() {
        this.bindEvents();
    },

    // bind any events that are required on startup to listeners:
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //connectButton.addEventListener('touchend', bt.manageConnection, false);
    },

    // this runs when the device is ready for user interaction:
    onDeviceReady: function() {
        bluetoothSerial.isEnabled(bt.refreshDeviceList, bt.notEnabled);
        console.log("Bluetooth initialized");
    },

    // list bluetooth devices
    refreshDeviceList: function() {
        bluetoothSerial.list(
            function(results) {
                bt.display(JSON.stringify(results));
            },
            function(error) {
                bt.display(JSON.stringify(error));
            }
        );
    },

    // bluetooth not enabled
    notEnabled: function() {
        bt.display("Bluetooth is not enabled.")
    },

    // Connects if not connected, and disconnects if connected:
    manageConnection: function() {

        // connect() will get called only if isConnected() (below)
        // returns failure. In other words, if not connected, then connect:
        var connect = function () {
            // if not connected, do this:
            // clear the screen and display an attempt to connect
            bt.display("Attempting to connect. Make sure the serial port is open on the target device.");
            // attempt to connect:
            bluetoothSerial.connect(
                bt.macAddress,  // device to connect to
                bt.openPort,    // start listening if you succeed
                bt.showError    // show the error if you fail
            );
        };

        // disconnect() will get called only if isConnected() (below)
        // returns success  In other words, if  connected, then disconnect:
        var disconnect = function () {
            bt.display("attempting to disconnect");
            // if connected, do this:
            bluetoothSerial.disconnect(
                bt.closePort,     // stop listening to the port
                bt.showError      // show the error if you fail
            );
        };

        // here's the real action of the manageConnection function:
        bluetoothSerial.isConnected(disconnect, connect);
    },

    // subscribes to a Bluetooth serial listener for newline and changes the button:
    openPort: function() {
        // if you get a good Bluetooth serial connection:
        bt.display("Connected to: " + bt.macAddress);
        // change the button's name:
        connectButton.innerHTML = "Disconnect";
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        bluetoothSerial.subscribe('\n', function (data) {
            bt.display(data);
        });
    },

    // unsubscribes from any Bluetooth serial listener and changes the button:
    closePort: function() {
        // if you get a good Bluetooth serial connection:
        bt.display("Disconnected from: " + bt.macAddress);
        // change the button's name:
        connectButton.innerHTML = "Connect";
        // unsubscribe from listening:
        bluetoothSerial.unsubscribe(
                function (data) {
                    bt.display(data);
                },
                bt.showError
        );
    },

    // appends @error to the message div:
    showError: function(error) {
        bt.display(error);
    },

    // appends @message to the message div:
    display: function(message) {
        console.log(message);
    },
};

bt.initialize();