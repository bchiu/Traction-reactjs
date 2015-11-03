var React  = require('react');
var Radium = require('radium');

var GoogleMaps = React.createClass({

    getInitialState: function() {
        this.map = null;
        this.markers = []; 
        this.use_geo = false;

        this.autocomplete = null;
        this.countryRestrict = { 'country': 'tw' };

        this.startPosition = new google.maps.LatLng(25.1236, 121.532);
        this.endPosition = new google.maps.LatLng(25.127347, 121.536150);

        this.themes = {
            MidnightCommander: [{'featureType':'water','stylers':[{'color':'#021019'}]},{'featureType':'landscape','stylers':[{'color':'#08304b'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#0c4152'},{'lightness':5}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#0b434f'},{'lightness':25}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'color':'#0b3d51'},{'lightness':16}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#000000'}]},{'elementType':'labels.text.fill','stylers':[{'color':'#ffffff'}]},{'elementType':'labels.text.stroke','stylers':[{'color':'#000000'},{'lightness':13}]},{'featureType':'transit','stylers':[{'color':'#146474'}]},{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'administrative','elementType':'geometry.stroke','stylers':[{'color':'#144b53'},{'lightness':14},{'weight':1.4}]}],
            NeutralBlue: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}],
            BlueEssence: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill"},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#7dcdcd"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]}],
            Cobalt: [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}],
        }

        return {
            theme: []
        }
    },

    componentDidMount: function() {

        this.map = new google.maps.Map($("#maps-canvas")[0], {
            mapTypeControl: true,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: this.state.theme,
        });

        this.getLocation();
    },

    addMarker: function(map, position, title, image) {
        return new google.maps.Marker({
            map: map,
            icon: image,
            title: title,
            position: position,
        }); 
    },

    getLocation: function() {
        if (this.use_geo) {
            navigator.geolocation.watchPosition(
                function(pos) {
                    var position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    this.map.setCenter(position);
                    this.addMarker(this.map, position, "My Position", null);
                }, 
                function() {
                    console.log("Geolocation not supported");
                }
            );
        } else {
            this.map.setCenter(this.startPosition);
            this.addMarker(this.map, this.startPosition, "My Position", null);
        }
    },

    render: function() {
        return (
            <div style={styles} id="maps-canvas"></div>
        );
    }
});

var styles = {
    position: 'absolute',
    width: '100%', 
    height: '100%' 
}

module.exports = Radium(GoogleMaps);