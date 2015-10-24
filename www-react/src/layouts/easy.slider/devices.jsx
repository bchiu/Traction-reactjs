/*
    Bluetooth devices modal window
*/
var React = require('react');

var Modal       = require('react-bootstrap/lib/Modal');
var ModalHeader = require('react-bootstrap/lib/ModalHeader');
var ModalTitle  = require('react-bootstrap/lib/ModalTitle');
var ModalBody   = require('react-bootstrap/lib/ModalBody');
var ModalFooter = require('react-bootstrap/lib/ModalFooter');
var Button      = require('react-bootstrap/lib/Button');

var Devices = React.createClass({

    getInitialState: function() {
        return {
            bluetooth: false,  // bluetooth on?
            container: null,   // modal container
            list:      null,   // devices list
            button:    null,   // devices button
            message:   null,   // discovery message
            spinner:   null,   // reusable spinner
            deviceId:  '',     // selected device id

            devices: [
                {"name":"HC-06",   "address":"98:D3:31:20:57:E0", "id":"98:D3:31:20:57:E0", "class":7936},
                {"name":"Mi Note", "address":"98:D3:31:20:57:E1", "id":"98:D3:31:20:57:E1", "class":7936},
                {"name":"Nexus 7", "address":"98:D3:31:20:57:E2", "id":"98:D3:31:20:57:E2", "class":7936},
                {"name":"Nexus 4", "address":"98:D3:31:20:57:E3", "id":"98:D3:31:20:57:E3", "class":7936}
            ]
        }
    },

    componentDidMount: {
        this.state.container = $('#'+id);
        this.state.list      = $('#'+id+'-list');
        this.state.button    = $('#'+id+'-button');
        this.state.message   = $('#'+id+'-message');
        this.state.spinner   = $('#'+id+'-spinner');

        this.state.container.on('show.bs.modal', this.openList);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    openList: function() {
        if (!window.cordova) { updateList(); message.show(); return } // for local development

        bluetoothSerial.enable(
            function() { 
                this.state.bluetooth = true;
                this.refreshDevices();
            }, 
            function(event) { 
                this.state.bluetooth = false; 
                this.handleError(event);
            }
        );
    },

    refreshDevices: function() {
        //this.state.message.show();

        bluetoothSerial.list(
            function(results) { 
                this.state.devices = results; 
            }, this.handleError
        );

        // bluetoothSerial.discoverUnpaired(
        //     function(results) { 
        //         this.state.devices = _.uniq(this.state.devices.concat(results), 'id');
        //         this.state.message.hide();
        //     }, this.handleError
        // );
    },

    handleError: function(error) {
        this.state.button.removeClass("btn-info");
        this.state.container.modal('hide');
        this.state.message.hide();
        this.state.deviceId = '';
        alert(error);
    },

    getDeviceById: function(uuid) {
        var results = $.grep(this.state.devices, function(d) { return d.id == uuid });
        return results[0];
    },

    onDataReady: function(data) {
        console.log(data);
    },

    onDataError: function(error) {
        console.log(error);
    },

    onDeviceReady: function() {
    },

    connect: function(uuid) {
        Spinner.remove(deviceId);
        Spinner.append(uuid, '20px', 'float:right');
        this.state.message.hide();
        this.state.deviceId = uuid;

        if (this.state.bluetooth) {
            bluetoothSerial.connect(uuid,
                function() {
                    bluetoothSerial.subscribe('\n', this.onDataReady, this.onDataError);
                    //bluetoothSerial.write("c4\n", onDataReady, onDataError);
                    this.state.button.addClass("btn-info");
                    Spinner.remove(uuid);
                    this.state.container.modal('hide');
                    console.log("Connected to: " + uuid);
                }, this.handleError
            );
        }
    },

    render: function() {
        this.refreshDevices();

        var list = this.state.devices.map(function(device) {
            var active = (device.id == deviceId) ? 'active' : '';

            return (
                <a id={device.id} href='#' class='list-group-item {active}'>
                    <img src='img/ic_bluetooth_black_24px.svg' />
                    {device.name} ({device.id})
                </a>
        });

        return (

            <div id="devices" class="modal fade devices-modal" tabindex="-1" role="dialog" aria-labelledby="devices-list" style={this.props.style}>
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">

                        <div class="modal-header bg-primary">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Bluetooth Devices</h4>
                        </div>

                        <div id="devices-list" class="list-group">
                            {list}
                        </div>

                        <div id="devices-message" style="padding:15px;padding-top:0">
                            Discovering devices...

                            {/* reusable spinner */}
                            <svg id="spinner" class="spinner" style="float:right" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
});

module.exports = Devices;