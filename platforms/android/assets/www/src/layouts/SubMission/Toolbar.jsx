var React      = require('react');
var Radium     = require('radium');

module.exports = Radium(React.createClass({

    render: function() {
        var btButtonState = (this.props.deviceConnected) ? styles.btButtonOn : {};

        return (
            <div style={styles.toolbar}>
                <table width="100%" height="100%">
                    <tbody>
                        <tr valign="center" align="center">
                            <td width="7%" nowrap>67°F</td>

                            <td width="12%" nowrap>2,398 mi</td>

                            <td width="5%" nowrap><div style={{ border:'2px solid #3487ca' }}>SMS</div></td>

                            <td width="41%" nowrap></td>

                            <td width="5%" nowrap><div style={{ background:'#374d5a' }}>SOS</div></td>

                            <td width="10%" nowrap>Fri Jan 25</td>

                            <td width="10%" nowrap>12:46PM</td>

                            <td width="5%" nowrap>3G&nbsp;|||</td>                            

                            <td width="5%" style={{ textAlign: "right" }}>
                                <button className="btn" style={[styles.btButton, btButtonState]} onClick={this.props.showDevices}>
                                    <svg style={styles.btButtonIcon} fill="#FFFFFF" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={styles.line} />
            </div>
        );
    }
}));

var styles = {

    toolbar: {
        height: '100%',
        width: '100%',
        fontSize: '2.5vh',
        textAlign: 'center'
    },

    line: {
        width: '100%',
        height: '1px',
        background: '#333',
    },

    btButton: {
        border: 'none',
        width: '4vh',
        height: 'auto',
        padding: '0.2vh',
        marginRight: '1vh',
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#337ab7',
    },

    btButtonOn: {
        background: '#5cb85c',
    },

    btButtonIcon: {
        display: 'block'
    }
}
