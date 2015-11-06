/*
    Data channels dropdown menu
*/
var React          = require('react');
var Radium         = require('radium');
var DropdownButton = require('react-bootstrap/lib/DropdownButton');
var MenuItem       = require('react-bootstrap/lib/MenuItem');

var Channels = React.createClass({

    getInitialState: function() {
        return {
            channelId: 1,
            channels: [1, 2, 3, 4]
        }
    },

    render: function() {
        return (

            <DropdownButton 
                id="channelsButton"
                title={'CH'+this.state.channelId} 
                bsStyle={'primary'} 
                pullRight={true}
                style={styles.dropdown} >
                {
                    this.state.channels.map(
                        function(channel) {
                            return (
                                <MenuItem key={channel} eventKey={channel}>
                                    {'CH'+channel}
                                </MenuItem>
                            )
                        }
                    )
                }
            </DropdownButton>

        );
    }
});

var styles = {

    dropdown: {
        float: 'right',
        height: '85%'
    }
}

module.exports = Radium(Channels);