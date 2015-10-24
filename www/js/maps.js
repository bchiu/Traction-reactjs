var Maps = (function() {
	var map;
	var markers = []; 
	var use_geo = false;

	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();

	var autocomplete;
	var countryRestrict = { 'country': 'tw' };

	var startPosition = new google.maps.LatLng(25.1236, 121.532);
	var endPosition = new google.maps.LatLng(25.127347, 121.536150);

	var styleMidnightCommander = [{'featureType':'water','stylers':[{'color':'#021019'}]},{'featureType':'landscape','stylers':[{'color':'#08304b'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#0c4152'},{'lightness':5}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#0b434f'},{'lightness':25}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'color':'#0b3d51'},{'lightness':16}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#000000'}]},{'elementType':'labels.text.fill','stylers':[{'color':'#ffffff'}]},{'elementType':'labels.text.stroke','stylers':[{'color':'#000000'},{'lightness':13}]},{'featureType':'transit','stylers':[{'color':'#146474'}]},{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'administrative','elementType':'geometry.stroke','stylers':[{'color':'#144b53'},{'lightness':14},{'weight':1.4}]}];
	var styleNeutralBlue = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}];
	var styleBlueEssence = [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill"},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#7dcdcd"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]}];
	var styleCobalt = [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}];

	function getLocation() {
		if (use_geo) {
			navigator.geolocation.watchPosition(function(position) {
				var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		    	map.setCenter(pos);
				addMarker(map, pos, "My Position", null);
			}, 
			function() {
				console.log("Geolocation not supported");
			});
		} else {
	    	map.setCenter(startPosition);
			addMarker(map, startPosition, "My Position", null);
		}
	}

	function initDirections(id) {
		directionsDisplay = new google.maps.DirectionsRenderer();
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel($("#"+id)[0]);
	}

	function initSearch(id) {
		//autocomplete = new google.maps.places.Autocomplete(input, { componentRestrictions: countryRestrict });
		//places = new google.maps.places.PlacesService(map);
		var searchBox = new google.maps.places.SearchBox($("#"+id)[0]);

		google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces();

			if (places.length == 0) return;

		    for (var i = 0, marker; marker = markers[i]; i++) {
		      marker.setMap(null);
		    }

		    // For each place, get the icon, place name, and location.
		    markers = [];
		    var bounds = new google.maps.LatLngBounds();
		    for (var i = 0, place; place = places[i]; i++) {
		    	var image = {
			        url: place.icon,
			        size: new google.maps.Size(71, 71),
			        origin: new google.maps.Point(0, 0),
			        anchor: new google.maps.Point(17, 34),
			        scaledSize: new google.maps.Size(25, 25)
			    };

		      	// Create a marker for each place.
		      	marker = addMarker(map, place.geometry.location, place.name, image);
		      	markers.push(marker);
		      	bounds.extend(place.geometry.location);
		    }
		    map.fitBounds(bounds);
		});

		google.maps.event.addListener(map, 'bounds_changed', function() {
		    var bounds = map.getBounds();
		    searchBox.setBounds(bounds);
		});
	}

	function calcRoute(start, end) {
		var request = {
	    	origin: start,
	    	destination: end,
	    	travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(response, status) {
	    	if (status == google.maps.DirectionsStatus.OK) {
	        	directionsDisplay.setDirections(response);
	    	}
	  	});
	}

	function addMarker(map, position, title, image) {
		return new google.maps.Marker({
		    map: map,
	       	icon: image,
		    title: title,
		    position: position,
		}); 
	}

	// public interface
	return {
    	initialize: function(canvasId) {
			map = new google.maps.Map($("#"+canvasId)[0], {
				mapTypeControl: true,
				mapTypeControlOptions: {
				    //style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				    //position:google.maps.ControlPosition.RIGHT_BOTTOM,
				},
				streetViewControlOptions: {
		        	//position: google.maps.ControlPosition.LEFT_CENTER
		    	},
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
			    //styles: styleMidnightCommander,
			});

			getLocation();
			//initSearch("autocomplete");
			//initDirections("directions-panel");
			//calcRoute(startPosition, endPosition);
    	},
    	publicMethod2: function() {
    	}
  	};
})();
