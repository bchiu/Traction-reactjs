var React  = require('react');
var Radium = require('radium');
var Menu = require('material-ui/lib/menus/menu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var MenuDivider = require('material-ui/lib/menus/menu-divider');

module.exports = Radium(React.createClass({

    render: function() {
        return (

			<Menu desktop={false} width={320}>
				<MenuItem primaryText="Connect Device" />
				<MenuItem primaryText="Switch Interface" />

				<MenuDivider />

				<MenuItem primaryText="Sleep" />

				<MenuDivider />

			</Menu>

        );
    }
}));
