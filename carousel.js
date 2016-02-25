
/**
 * [Carousel description]
 * @param {[type]} $ele    [description]
 * @param {[type]} options [description]
 */
var Carousel = function($container, options) {
  this.$container = $container;
  this.$leftArrow = $container.find('.left-arrow');
  this.$rightArrow = $container.find('.right-arrow');

  this.$images = $container.find('.carousel-image');
  this.currentIndex = 0;
  this.imageWidth = this.$images.width();

  this.infinite = options.infinite || false;
};

Carousel.prototype._bindEvents = function() {
  var self = this;
  this.$leftArrow.on('click', _.debounce(function() {
    self._move('left');
  }, 200));

  this.$rightArrow.on('click', _.debounce(function() {
    self._move('right');
  }, 200));

};

Carousel.prototype._move = function(direction) {
  var $currentImage = $(this.$images[this.currentIndex]), 
      $nextImage,
      nextIndex;

  if (!$currentImage.hasClass('active') || $currentImage.hasClass('to-left') || $currentImage.hasClass('to-right')) {
    return;
  }

  if (direction === 'right') {    
    if (this.currentIndex < this.$images.length-1) {      
      $nextImage = $(this.$images[this.currentIndex+1]);  
      nextIndex = this.currentIndex + 1;      
    } else {
      if (this.infinite) {
        $nextImage = $(this.$images[0]);
        nextIndex = 0;
      }
    }

    if ($nextImage) {
      // prepare the next image
      $nextImage.addClass('prepare next');

      setTimeout(function() {
        // animate current image
        $currentImage.addClass('to-left');            
      }, 0);

      setTimeout(function() {
        // animate next image
        $nextImage.removeClass('next');
      }, 60);
      
      setTimeout(function() {
        $currentImage.removeClass('active').removeClass('to-left');                 
      }, 510);

      setTimeout(function() {
        $nextImage.addClass('active').removeClass('prepare');     
        this.currentIndex = nextIndex;
      }.bind(this), 570);
    }
  } else {
    if (this.currentIndex > 0) {
      $nextImage = $(this.$images[this.currentIndex-1]);      
      nextIndex = this.currentIndex - 1;
    } else {
      if (this.infinite) {
        $nextImage = $(this.$images[this.$images.length-1]);
        nextIndex = this.$images.length-1;
      }
    }

    if ($nextImage) {
      $nextImage.addClass('prepare pre');
      

      setTimeout(function() {
        $currentImage.addClass('to-right');           
      }, 0);

      setTimeout(function() {
        $nextImage.removeClass('pre');
      }, 60);

      setTimeout(function() {
        $currentImage.removeClass('active').removeClass('to-right');                  
      }, 510);

      setTimeout(function() {       
        $nextImage.addClass('active').removeClass('prepare');
        this.currentIndex = nextIndex;
      }.bind(this), 570);
    }
  }

};

Carousel.prototype._constructDeck = function(direction) {
  for(var i=0; i<this.$images.length; i++) {
    var $img = $(this.$images[i]);
    $img.css({
      'background-image': 'url("' + $img.attr('data-image-src')+ '")'
    });

    if ( i === this.currentIndex) {
      // $img.css('left', 0);
      $img.addClass('active');
    } else {
      // $img.css('left', direction === 'right' ? this.imageWidth : -this.imageWidth);
    }
  }
};


Carousel.prototype.startCarousel = function() {
  // set up image urls
  this._constructDeck('right');
  this._bindEvents();
};

