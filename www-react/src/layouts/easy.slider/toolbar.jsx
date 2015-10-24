var React = require('react');

var NavBar      = require('react-bootstrap/lib/NavBar');
var NavBrand    = require('react-bootstrap/lib/NavBrand');
var Nav         = require('react-bootstrap/lib/Nav');
var NavItem     = require('react-bootstrap/lib/NavItem');
var NavDropdown = require('react-bootstrap/lib/NavDropdown');
var MenuItem    = require('react-bootstrap/lib/MenuItem');

var Toolbar = React.createClass({
    render: function() {
		var title = this.props.title;
		
        return (

            <nav class="navbar bg-primary" style="height:10%">
                <div class="row">
                    <div class="col-xs-4">
                        <button type="button" id="devices-button" class="btn btn-primary" data-toggle="modal" data-target="#devices">
                            <img src="img/ic_bluetooth_white_24px.svg" class="icon-bluetooth" style="height:20px">
                        </button>
                    </div>
                    <div class="col-xs-4">
                        <div class="brand">{title}</div>
                    </div>
                    <div class="col-xs-4">
                        <div id="channels" class="dropdown pull-right">
                            <button type="button" id="channels-button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                CH1 <span class="caret"></span>
                            </button>
                            <ul id="channels-menu" class="dropdown-menu">
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

        );
    }
});

module.exports = Toolbar;