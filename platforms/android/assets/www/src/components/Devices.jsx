/*
    Bluetooth devices modal dialog
*/
var React         = require('react');
var Radium        = require('radium');
var Modal         = require('react-bootstrap/lib/Modal');
var Button        = require('react-bootstrap/lib/Button');
var ListGroup     = require('react-bootstrap/lib/ListGroup');
var ListGroupItem = require('react-bootstrap/lib/ListGroupItem');
var Spinner       = require('./Spinner');

module.exports = Radium(React.createClass({

    getInitialState: function() {
        this.bluetooth = false;
        this.enableBluetooth();

        return {
            showModal: false,
            showMessage: 'block',
            deviceId:  '',
            spinnerId: '',
            devices: [
                {"name":"HC-06",   "address":"98:D3:31:20:57:E0", "id":"98:D3:31:20:57:E0", "class":7936},
                {"name":"Mi Note", "address":"98:D3:31:20:57:E1", "id":"98:D3:31:20:57:E1", "class":7936},
                {"name":"Nexus 7", "address":"98:D3:31:20:57:E2", "id":"98:D3:31:20:57:E2", "class":7936},
                {"name":"Nexus 4", "address":"98:D3:31:20:57:E3", "id":"98:D3:31:20:57:E3", "class":7936}
            ]
        }
    },

    showModal: function() {
        this.setState({ showModal: true, showMessage: 'block', spinnerId: '' });
        this.refreshDevices();
    },

    hideModal: function() {
        this.setState({ showModal: false });
    },

    showMessage: function() {
        this.setState({ showMessage: 'block' });
    },

    hideMessage: function() {
        this.setState({ showMessage: 'none' });
    },

    showSpinner: function(id) {
        this.setState({ spinnerId: id });
    },

    hideSpinner: function() {
        this.setState({ spinnerId: '' });
    },

    enableBluetooth: function() {
        document.addEventListener('deviceready', function() {
            bluetoothSerial.enable(
                function() { this.bluetooth = true  }.bind(this), 
                function() { this.bluetooth = false }.bind(this)
            );
        }.bind(this), false);
    },

    refreshDevices: function() {
        if (!this.bluetooth) return;

        bluetoothSerial.list(
            function(results) { 
                this.setState({ devices: results }); 
            }.bind(this), this.handleError
        );

        bluetoothSerial.discoverUnpaired(
            function(results) { 
                this.hideMessage();
            }.bind(this), this.handleError
        );

        bluetoothSerial.setDeviceDiscoveredListener(
            function(device) {
                this.setState({ devices: this.state.devices.concat(device) });
            }.bind(this)
        );
    },

    handleError: function(error) {
        this.disconnectDevice();
        console.error(error);
        alert(error);
    },

    getDeviceById: function(uuid) {
        var results = $.grep(this.state.devices, function(d) { return d.id == uuid });
        return results[0];
    },

    disconnectDevice: function() {
        if (!this.bluetooth) return;
        this.props.onDisconnect();
        this.setState({ deviceId: '', spinnerId: '' })
        bluetoothSerial.isConnected(function() { bluetoothSerial.disconnect() });
    },

    connectDevice: function(uuid) {
        this.disconnectDevice();
        this.showSpinner(uuid);
        this.hideMessage();
        //this.setState({ deviceId: uuid });

        if (!this.bluetooth) return;

        bluetoothSerial.clearDeviceDiscoveredListener();

        bluetoothSerial.connect(uuid,
            function() {
                this.setState({ deviceId: uuid });
                this.hideSpinner();
                this.hideModal();
                this.props.onConnect(); // onConnect() callback
                console.log("Connected to device: " + uuid);
            }.bind(this), this.handleError
        );
    },

    render: function() {
        var list = this.state.devices.map(
            function(device, index) {
                var active  = (device.id == this.state.deviceId)  ? true : false;
                var spinner = (device.id == this.state.spinnerId) ? <Spinner width="20px" height="20px" style={styles.spinner} /> : '';
                var onclick = (active) ? null : this.connectDevice.bind(this, device.id);

                return (
                    <ListGroupItem 
                        href='#' 
                        key={index}
                        onClick={onclick}
                        style={styles.item}
                        active={active} >

                            <svg fill="#000000" viewBox="0 0 24 24" style={styles.btIcon}>
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
                            </svg>

                            {device.name} ({device.id})
                            {spinner}

                    </ListGroupItem>
                );
            }, this
        );

        return (
            <div>
                <Modal 
                    backdrop='static'
                    show={this.state.showModal} 
                    onHide={this.hideModal} 
                    container={this}
                    bsSize="medium">

                    <Modal.Header style={styles.header} closeButton>
                        <Modal.Title>Bluetooth Devices</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ListGroup>
                            {list}
                        </ListGroup>
                        <div style={[{ display: this.state.showMessage }, styles.message]}>
                            Discovering devices...
                            <Spinner width="25px" height="25px" style={styles.spinner} />
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}));

var styles = {

    item: {
        fontSize: '2.5vh'
    },

    btIcon: {
        width: '2.5vh',
        height: '2.5vh',
        marginRight: '1vh',
    },

    header: {
        color: '#fff', 
        background: '#337ab7'
    },

    message: {
        padding: '0 15px 0 15px'
    },

    spinner: {
        float: 'right'
    }
}
