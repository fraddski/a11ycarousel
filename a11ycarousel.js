/**
* jQuery a11ycarousel v1.2
* http://github.com/fraddski/a11ycarousel
* Licensed under MIT
*/
(function($) {
	$.fn.a11ycarousel = function(options) {
		var carouselContainer;
		var itemList;
		var index = 0;
		var isPlaying = false;
		var playTimeout;
		var resizingTimeout;
		var itemCount;
		var transformStyle = null;
		var transitionStyle = null;

		var settings = $.extend({
			autoPlay: false,
			playInterval: 9000,
			slideSpeed: 1000,
			easing: 'ease',
			additionalControlHeight: 0,
			dResize: false
		}, options);

		var animate = function(itemIndex) {
			var itm = $(itemList).find('li:nth-child(' + (itemIndex + 1) + ')');
			var leftPos = $(itm).position().left;
			if (transformStyle !== null && transitionStyle !== null){
				$(itemList).css(transformStyle, 'translateX(' + leftPos * -1 + 'px)');
			} else if (transitionStyle !== null) {
				$(itemList).css({ left: leftPos * -1 + 'px' });
			} else {
				$(itemList).animate({ left: leftPos * -1 }, settings.slideSpeed);
			}
			$(carouselContainer).find('.controls li button').each(function(){ $(this).removeClass('active'); });
			var selectedControl = $(carouselContainer).find('.controls li button')[itemIndex];
			$(selectedControl).addClass('active');
		};

		var itemSelected = function(e) {
			goToItem(e.target.value - 1);
		}

		var goToItem = function(targetIndex) {
			clearTimeout(playTimeout);
			index = (targetIndex);
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

		var adjustSize = function() {
			var containerWidth = $(carouselContainer).width();
			$(itemList).width(itemCount * containerWidth);
			$(itemList).find('li').each(function() {
				$(this).width(containerWidth);
			});
			goToItem(index);
		}

		var windowResized = function() {
			clearTimeout(playTimeout);
			clearTimeout(resizingTimeout);
      resizingTimeout = setTimeout(adjustSize, 100);
		}

		carouselContainer = this;
		itemList = $(carouselContainer).find('ul')[0];
		itemCount = $(itemList).find('li').length;
		var wdth = $(carouselContainer).width();
		$(carouselContainer).css({ overflow: 'hidden', position: 'relative' }).addClass('carousel-container');
		$(itemList).width(itemCount * wdth).css({ overflow: 'hidden', position: 'absolute', top: 0, left: 0, margin: 0, padding: 0, 'list-style-type': 'none' });
		$(itemList).find('li').each(function() {
			$(this).width(wdth).css({ overflow: 'hidden', float: 'left', position: 'relative', margin: 0, padding: 0, 'list-style-type': 'none' });
		});
		if (settings.additionalControlHeight) {
			$(carouselContainer).height($(carouselContainer).height() + settings.additionalControlHeight);
		}
		if (settings.doResize) {
			$(window).resize(windowResized);
		} else {
			$(carouselContainer).width($(carouselContainer).width());
		}

		checkSupport();
		if (transformStyle !== null && transitionStyle !== null) {
			$(itemList).css(transitionStyle, transformStyle + ' ' + settings.slideSpeed / 1000 + 's ' + settings.easing);
		} else if (transitionStyle !== null) {
			$(itemList).css(transitionStyle, 'left ' + settings.slideSpeed / 1000 + 's ' + settings.easing);
		}

		if (itemCount > 1) {
			$(carouselContainer).prepend('<div class="controls"></div>');
			var controlContainer = $(carouselContainer).find('.controls');
			$(controlContainer).append('<div class="offscreen">The following controls have a visual effect only</div>');
      $(controlContainer).append('<input type="button" class="toggle-play" value="' + (settings.autoPlay ? 'Pause' : 'Play') + '" title="' + (settings.autoPlay ? 'Pause' : 'Play') + ' the carousel" />');
			$(controlContainer).find('.toggle-play').click(togglePlay);
			$(controlContainer).append('<ul></ul>').css({ 'z-index': 1000, position: 'absolute' });
			for (var i=0; i<itemCount; i++){
				$(controlContainer).find('ul').append('<li><button' + (i==0 ? ' class="active"' : '') + ' type="button" value="' + (i+1) + '" title="Go to slide ' + (i+1) + '">' + (i+1) + '</button></li>');
			}
			$(controlContainer).find('ul').width($(controlContainer).find('li').first().outerWidth() * itemCount);
			$(controlContainer).find('li button').click(itemSelected);

			if (settings.autoPlay) {
				isPlaying = true;
				playTimeout = setTimeout(moveToNext, settings.playInterval);
			}
		}

		return this;
	};

}(jQuery));
