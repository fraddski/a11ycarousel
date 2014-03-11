/**
* jQuery a11y-carousel v1.0
* http://github.com/skyebianca/a11y-carousel
* Licensed under MIT
*/
(function($) {    
    $.fn.a11ycarousel = function(options) {
		var carouselContainer;
		var itemList;
	    var index = 0;
	    var isPlaying = false;
	    var playTimeout;
	    var itemCount;
		var transformStyle = null;
		var transitionStyle = null;

		var settings = $.extend({
			width: 600,
			height: 300,
			autoPlay: true,
			playInterval: 9000,
			slideSpeed: 1000,
			easing: 'ease',
			additionalControlHeight: 0
		}, options);
		
		var animate = function(itemIndex) {
			if (transformStyle !== null && transitionStyle !== null){
				$(itemList).css(transformStyle, 'translateX(' + itemIndex * settings.width * -1 + 'px)');
			} else if (transitionStyle !== null) {
				$(itemList).css({ left: itemIndex * settings.width * -1 + 'px' });
			} else {
				$(itemList).animate({ left: itemIndex * settings.width * -1 }, settings.slideSpeed);
			}
            $(carouselContainer).find('.controls li button').each(function(){ $(this).removeClass('active'); });
            var selectedControl = $(carouselContainer).find('.controls li button')[itemIndex];
            $(selectedControl).addClass('active');
		};
		
        var goToItem = function(e) {
            clearTimeout(playTimeout);
            index = (e.target.value - 1);
            animate(index);
            if (isPlaying) {
                playTimeout = setTimeout(moveToNext, settings.playInterval);
            }
        }

		var moveToNext = function() {
            index++;
            if (index >= itemCount) {
                index = 0;
            }
            animate(index);
            playTimeout = setTimeout(moveToNext, settings.playInterval);
        }
        
        var togglePlay = function() {
            if (isPlaying) {
                clearTimeout(playTimeout);
            } else {
                playTimeout = setTimeout(moveToNext, 500);
            }
            isPlaying = !isPlaying;
            $(carouselContainer).find('.toggle-play').val(isPlaying ? 'Pause' : 'Play');
            $(carouselContainer).find('.toggle-play').prop('title', isPlaying ? 'Pause the slideshow' : 'Play the slideshow');
            return false;
        }

		var checkSupport = function() {
			var tstStyle = document.createElement('tst').style;
			var transformProps = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
			var transformStyles = ['transform', '-webkit-transform', '-moz-transform', '-o-transform', '-ms-transform'];
			for (var i=0; i < transformProps.length; i++) {
				if (tstStyle[transformProps[i]] !== undefined) {
					transformStyle = transformStyles[i];
					break;
				}
			}
			var transitionProps = ['transition', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
			var transitionStyles = ['transition', '-webkit-transition', '-moz-transition', '-o-transition', '-ms-transition'];
			for (var i=0; i < transitionProps.length; i++) {
				if (tstStyle[transitionProps[i]] !== undefined) {
					transitionStyle = transitionStyles[i];
					break;
				}
			}
		}
		
		carouselContainer = this;
		itemList = $(carouselContainer).find('ul')[0];
		itemCount = $(itemList).find('li').length;
        $(carouselContainer).width(settings.width).height(settings.height + settings.additionalControlHeight).css({ overflow: 'hidden', position: 'relative' }).addClass('carousel-container');
        $(itemList).width(itemCount * settings.width).height(settings.height).css({ overflow: 'hidden', position: 'absolute', top: 0, left: 0, margin: 0, padding: 0, 'list-style-type': 'none' });
		$(itemList).find('li').each(function() {
			$(this).width(settings.width).height(settings.height).css({ overflow: 'hidden', float: 'left', position: 'relative', margin: 0, padding: 0, 'list-style-type': 'none' });
		});
        
		checkSupport();
		if (transformStyle !== null && transitionStyle !== null) {
			$(itemList).css(transitionStyle, transformStyle + ' ' + settings.slideSpeed / 1000 + 's ' + settings.easing);
		} else if (transitionStyle !== null) {
			$(itemList).css(transitionStyle, 'left ' + settings.slideSpeed / 1000 + 's ' + settings.easing);
		}
		
      	if (itemCount > 1) {
    		$(carouselContainer).prepend('<div class="controls"></div>');
			var controlContainer = $(carouselContainer).find('.controls');
			if (settings.autoPlay){
				$(controlContainer).append('<input type="button" class="toggle-play" value="Pause" title="Pause the carousel" />');
	            $(controlContainer).find('.toggle-play').click(togglePlay);
			}
            $(controlContainer).append('<ul></ul>').css({ 'z-index': 1000, position: 'absolute' });
            for (var i=0; i<itemCount; i++){
                $(controlContainer).find('ul').append('<li><button' + (i==0 ? ' class="active"' : '') + ' type="button" value="' + (i+1) + '" title="Go to slide ' + (i+1) + '">' + (i+1) + '</button></li>');
            }
			$(controlContainer).find('ul').width($(controlContainer).find('li').first().width() * itemCount);
            $(controlContainer).find('li button').click(goToItem);
			if (settings.autoPlay){
            	isPlaying = true;
            	playTimeout = setTimeout(moveToNext, settings.playInterval);
			}
        }

        return this;
    };
 
}(jQuery));