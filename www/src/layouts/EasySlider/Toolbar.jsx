var React    = require('react');
var Radium   = require('radium');
var Channels = require('./Channels');

module.exports = Radium(React.createClass({
    render: function() {
        var btButtonState = (this.props.deviceConnected) ? styles.btButtonOn : {};

        return (

            <table style={styles.navbar}>
                <tbody>
                    <tr valign="middle">
                        <td width="15%" align="left">
                            <button className="btn" style={[styles.btButton, btButtonState]} onClick={this.props.showDevices}>
                                <svg style={styles.btButtonIcon} fill="#FFFFFF" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
                                </svg>
                            </button>
                        </td>

                        <td width="70%" align="center">
                            <div style={styles.brand}>{this.props.title}</div>
                        </td>

                        <td width="15%" align="right">
                            <Channels />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}));

var styles = {

    navbar: {
        background: '#337ab7',
        width: '100%',
        height: '101%',
        minHeight: '10px',
        margin: '0',
        padding: '0',
    },

    brand: {
        color: '#fff',
        fontSize: '5vh',
        textAlign: 'center'
    },

    btButton: {
        border: 'none',
        width: '8vh',
        height: 'auto',
        padding: '1vh',
        marginLeft: '1vh',
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#000',
    },

    btButtonOn: {
        background: '#5cb85c',
    },

    btButtonIcon: {
        display: 'block'
    }
}
