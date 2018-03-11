(function($) { 
    
  $.fn.kwSlideShow = function() { 
        
    var $modal = ($(document.createElement('div'))).addClass('modal-gallery').appendTo($('body'));
    var $closeBtn = ($(document.createElement('a'))).addClass('btn btn--close')
                    .html('<i class="icon-cancel"></i>')
                    .appendTo($modal);

    const prevBtn = ($(document.createElement('a'))).addClass('btn btn--prev')
                        .html('<i class="icon-left-open"></i>')
                        .appendTo($modal);
    var nextBtn = ($(document.createElement('a'))).addClass('btn btn--next')
                        .html('<i class="icon-right-open"></i>')
                        .appendTo($modal);

    var modalInner = ($(document.createElement('div'))).addClass('modal-inner').appendTo($modal);
    var modalImg = ($(document.createElement('img'))).addClass('modal-img').appendTo(modalInner);
    var prevImage;
    var nextImage;
    var currentIndex;
    var that = this;
    this.each(function(index, el) {$(el).attr('data-index', index); });
    this.on('click', function() {
        currentIndex = $(this).attr('data-index');
        prevImage = $('[data-index="'+(parseFloat(currentIndex-1))+'"]');
        nextImage = $('[data-index="'+(parseFloat(currentIndex)+1)+'"]');
        if(parseFloat(currentIndex) === that.length-1) nextBtn.css({display:'none'});
        if(parseFloat(currentIndex) === 0) prevBtn.css({display:'none'});
        $modal.appendTo($('body')).fadeIn().css({display: 'flex'});
        modalImg.attr('src', this.src);
        modalImg.attr('alt', $(this).alt);
    });
    
    function debounce(func, wait = 500, immediate = true) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };
    
    function getNextImage() {
         if(currentIndex>=that.length-1) { currentIndex=that.length-1; return; } 
        nextImage = $('[data-index="'+(parseFloat(currentIndex)+1)+'"]');
        modalImg.addClass('right-to-left');
        modalImg.on('animationend', function() { 
            modalImg.removeClass('right-to-left').hide().fadeIn('fast');
            modalImg.attr('src', nextImage.attr('src'));
        });
        currentIndex++;
        if(currentIndex===that.length-1) nextBtn.css({display:'none'})
        if(currentIndex!==0) prevBtn.css({display:'block'})
    }
    
    function getPreviousImage() {
        if(currentIndex<=0) { currentIndex=0; return; } 
        prevImage = $('[data-index="'+(parseFloat(currentIndex-1))+'"]');
        modalImg.addClass('left-to-right');
        modalImg.on('animationend', function() {
            modalImg.removeClass('left-to-right').hide().fadeIn('fast');
            modalImg.attr('src', prevImage.attr('src'));
        });
        currentIndex--;
        if(currentIndex===0) prevBtn.css({display:'none'})
        if(currentIndex!==that.length-1) nextBtn.css({display:'block'})
    }

     $(window).on('keydown', function(e) {
        if(e.keyCode===37)  debounce(getPreviousImage());
        else if(e.keyCode===39)  debounce(getNextImage()); 
        else return ;
    });
    
    $closeBtn.click(function() {$modal.fadeOut(); }); 
    prevBtn.on('click', debounce(getPreviousImage, 200));
    nextBtn.on('click', debounce(getNextImage, 200));
      
    var startedTouch = false; 
    var touchStartPoint = 0;
    var touchEndPoint = 0;
      
    modalImg.on('touchstart', debounce(function(e) {
        startedTouch = true;
        var touch = event.targetTouches[0];
        touchStartPoint = touch.clientX;
    }, 200));
      
      modalImg.on('touchend', debounce(function(e) {
        startedTouch = false;
    }, 200));
      
    modalImg.on('touchmove',debounce(function(e) {
        
        if(startedTouch) {
            
            var touch = event.targetTouches[0];
            touchEndPoint =  touch.clientX;
            
            if(touchStartPoint-touchEndPoint>0) {
              
                startedTouch = false;
                touchEndPoint = 0;
                touchEndPoint = 0;
                getPreviousImage();
            } 
      
            if(touchStartPoint-touchEndPoint<0) {
                startedTouch = false;
                touchEndPoint = 0;
                touchEndPoint = 0;
                getNextImage();
            } 
        }
    }, 200));
      
    return this;
  };
    
})(jQuery);