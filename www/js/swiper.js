PageSwiper = function(className) {
    var box = $(className);

	this.swiper = new Swiper(className, {
		preventClicksPropagation: false
	});

	this.toggleLock = function(event) {
	    this.swiper.params.allowSwipeToNext = !this.swiper.params.allowSwipeToNext;
	    this.swiper.params.allowSwipeToPrev = !this.swiper.params.allowSwipeToPrev;
	    $(event.currentTarget).toggleClass("swiper-locked");
	    $(event.currentTarget).toggleClass("swiper-unlocked");
	};
}