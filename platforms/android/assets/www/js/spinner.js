var Spinner = (function() {
	var svg = null;

    return {

    	initialize: function() {
			svg = Snap("#spinner");
			// Snap.load('../img/spinner.svg', function(xml) {svg=xml});
    	},

		append: function(id, size, style) {
			var newSvg = svg.clone();
			newSvg.attr({
				width: size,
				height: size,
				style: style
			});
			$(document.getElementById(id)).append(newSvg.node); // getElementById need if id contains ':'
		},

		remove: function(id) {
			if (id=='') return;
			$(document.getElementById(id)).find('.spinner').remove();
		}
	}
})();
