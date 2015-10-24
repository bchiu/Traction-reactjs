// Flip views on click
FlipCard = function(id) {
	this.card = $("#" + id);

	this.card.click(function() { 
		this.card.toggleClass('flipped'); 
	}.bind(this));

	this.isFlipped = function() {
		return this.card.hasClass('flipped');
	};
}
