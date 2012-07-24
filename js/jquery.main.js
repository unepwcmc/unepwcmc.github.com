// iepp v2.1pre @jon_neal & @aFarkas github.com/aFarkas/iepp
// html5shiv @rem remysharp.com/html5-enabling-script
// Dual licensed under the MIT or GPL Version 2 licenses
;(function(){
/*@cc_on(function(a,b){function r(a){var b=-1;while(++b<f)a.createElement(e[b])}if(!window.attachEvent||!b.createStyleSheet||!function(){var a=document.createElement("div");return a.innerHTML="<elem></elem>",a.childNodes.length!==1}())return;a.iepp=a.iepp||{};var c=a.iepp,d=c.html5elements||"abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|subline|summary|time|video",e=d.split("|"),f=e.length,g=new RegExp("(^|\\s)("+d+")","gi"),h=new RegExp("<(/*)("+d+")","gi"),i=/^\s*[\{\}]\s*$/,j=new RegExp("(^|[^\\n]*?\\s)("+d+")([^\\n]*)({[\\n\\w\\W]*?})","gi"),k=b.createDocumentFragment(),l=b.documentElement,m=b.getElementsByTagName("script")[0].parentNode,n=b.createElement("body"),o=b.createElement("style"),p=/print|all/,q;c.getCSS=function(a,b){try{if(a+""===undefined)return""}catch(d){return""}var e=-1,f=a.length,g,h=[];while(++e<f){g=a[e];if(g.disabled)continue;b=g.media||b,p.test(b)&&h.push(c.getCSS(g.imports,b),g.cssText),b="all"}return h.join("")},c.parseCSS=function(a){var b=[],c;while((c=j.exec(a))!=null)b.push(((i.exec(c[1])?"\n":c[1])+c[2]+c[3]).replace(g,"$1.iepp-$2")+c[4]);return b.join("\n")},c.writeHTML=function(){var a=-1;q=q||b.body;while(++a<f){var c=b.getElementsByTagName(e[a]),d=c.length,g=-1;while(++g<d)c[g].className.indexOf("iepp-")<0&&(c[g].className+=" iepp-"+e[a])}k.appendChild(q),l.appendChild(n),n.className=q.className,n.id=q.id,n.innerHTML=q.innerHTML.replace(h,"<$1font")},c._beforePrint=function(){if(c.disablePP)return;o.styleSheet.cssText=c.parseCSS(c.getCSS(b.styleSheets,"all")),c.writeHTML()},c.restoreHTML=function(){if(c.disablePP)return;n.swapNode(q)},c._afterPrint=function(){c.restoreHTML(),o.styleSheet.cssText=""},r(b),r(k);if(c.disablePP)return;m.insertBefore(o,m.firstChild),o.media="print",o.className="iepp-printshim",a.attachEvent("onbeforeprint",c._beforePrint),a.attachEvent("onafterprint",c._afterPrint)})(this,document)@*/
}());

// page init
jQuery(function(){
	initNavHover();
	initSameHeight();
	initCarousel();
	initGalleryFix();
	// initHoverImages();
});

// init navigation hover
function initNavHover(){
	jQuery('#nav ul > li > a').hover(function(){
		jQuery(this).parent().toggleClass('hover');
	})
}

// set same column height
function initSameHeight(){
	// basic examples
	jQuery('.gallery .mask ul').sameHeight();
	jQuery('.gallery.style2').sameHeight({
		elements: '.link-box'
	});
}

// scroll gallery init
function initCarousel() {
	jQuery('section.gallery').scrollGallery({
		step:1
	});
}
function initGalleryFix() {
	jQuery('.gallery').each(function(){
		var heightHolder = jQuery(this).find('.mask ul').height();
		jQuery(this).find('.mask').css('height', heightHolder);
	})
}

// init hover images 
function initHoverImages(){
	var images = jQuery('.gallery li img');
	var speed = 250;
	var k = 1.1;
	images.each(function(){
		var image = jQuery(this);
		image.data('origwidth', image.get(0).width);
		image.data('origheight', image.get(0).height);
		image.bind('mouseenter', function(){
			var left = (image.data('origwidth')*k - image.data('origwidth'))/2 + 2;
			image.stop().animate({
				width: image.data('origwidth')*k, 
				height: image.data('origheight')*k,
				marginLeft: -left},{duration:speed, complete:function(){
					initSameHeight();
				}});
			
		}).bind('mouseleave', function(){
			image.stop().animate({
				width:image.data('origwidth'), 
				height:image.data('origheight'),
				marginLeft:-2},{duration:speed, complete:function(){
					initSameHeight();
				}});
		});
	});
}

/* jQuery SameHeight plugin */
;(function($){
	$.fn.sameHeight = function(opt) {
		var options = $.extend({
			skipClass: 'same-height-ignore',
			elements: '>*',
			flexible: true,
			multiLine: true
		},opt);
		return this.each(function(){
			var holder = $(this);
			var elements = holder.find(options.elements).not('.' + options.skipClass);
			if(!elements.length) return;
			
			// resize handler
			function doResize() {
				elements.css({height:''});
				if(options.multiLine) {
					// resize elements row by row
					resizeElementsByRows(elements);
				} else {
					// resize elements by holder
					resizeElements(elements, holder);
				}
			}
			doResize();
			
			// flexible layout / font resize handling
			if(options.flexible) {
				$(window).bind('load resize orientationchange fontresize', function(e,d){
					doResize();
					setTimeout(doResize, 100);
				});
			}
		});
	}
	
	// get elements by rows
	function resizeElementsByRows(boxes) {
		var currentRow = $(), maxHeight, firstOffset = boxes.eq(0).offset().top;
		boxes.each(function(ind){
			var curItem = $(this);
			if(curItem.offset().top === firstOffset) {
				currentRow = currentRow.add(this);
			} else {
				maxHeight = getMaxHeight(currentRow);
				resizeElements(currentRow, maxHeight);
				currentRow = curItem;
				firstOffset = curItem.offset().top;
			}
		});
		if(currentRow.length) {
			maxHeight = getMaxHeight(currentRow);
			resizeElements(currentRow, maxHeight);
		}
	}
	
	// calculate max element height
	function getMaxHeight(boxes) {
		var maxHeight = 0;
		boxes.each(function(){
			maxHeight = Math.max(maxHeight, $(this).outerHeight());
		});
		return maxHeight;
	}
	
	// resize helper function
	function resizeElements(boxes, parent) {
		var parentHeight = typeof parent === 'number' ? parent : parent.height();
		boxes.each(function(){
			var element = $(this);
			var depthDiffHeight = 0;
			
			if(typeof parent !== 'number') {
				element.parents().each(function(){
					var tmpParent = $(this);
					if(this === parent[0]) {
						return false;
					} else {
						depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
					}
				});
			}
			element.css({
				height: parentHeight - depthDiffHeight - (element.outerHeight() - element.height())
			});
		});
	}
}(jQuery));

/* jQuery FontResize Event */
jQuery.onFontResize = (function($) {
	$(function() {
		var randomID = 'font-resize-frame-' + Math.floor(Math.random() * 1000);
		var resizeFrame = $('<iframe>').attr('id', randomID).addClass('font-resize-helper');
		
		// required styles
		resizeFrame.css({
			width: '100em',
			height: '10px',
			position: 'absolute',
			borderWidth: 0,
			top: '-9999px',
			left: '-9999px'
		}).appendTo('body');
		
		// use native IE resize event if possible
		if ($.browser.msie && $.browser.version < 9) {
			resizeFrame.bind('resize', function () {
				$.onFontResize.trigger(resizeFrame[0].offsetWidth / 100);
			});
		}
		// use script inside the iframe to detect resize for other browsers
		else {
			var doc = resizeFrame[0].contentWindow.document;
			doc.open();
			doc.write('<scri' + 'pt>window.onload = function(){var em = parent.jQuery("#' + randomID + '")[0];window.onresize = function(){if(parent.jQuery.onFontResize){parent.jQuery.onFontResize.trigger(em.offsetWidth / 100);}}};</scri' + 'pt>');
			doc.close();
		}
		jQuery.onFontResize.initialSize = resizeFrame[0].offsetWidth / 100;
	});
	return {
		// public method, so it can be called from within the iframe
		trigger: function (em) {
			$(window).trigger("fontresize", [em]);
		}
	};
}(jQuery));

/* jQuery Carousel plugin */
;(function($){
	function ScrollGallery(options) {
		this.options = $.extend({
			mask: 'div.mask',
			slider: '>*',
			slides: '>*',
			activeClass:'active',
			disabledClass:'disabled',
			btnPrev: 'a.prev',
			btnNext: 'a.next',
			generatePagination: false,
			pagerList: '<ul>',
			pagerListItem: '<li><a href="#"></a></li>',
			pagerListItemText: 'a',
			pagerLinks: '.pagination li',
			currentNumber: 'span.current-num',
			totalNumber: 'span.total-num',
			btnPlay: '.btn-play',
			btnPause: '.btn-pause',
			btnPlayPause: '.btn-play-pause',
			autorotationActiveClass: 'autorotation-active',
			autorotationDisabledClass: 'autorotation-disabled',
			circularRotation: true,
			disableWhileAnimating: false,
			autoRotation: false,
			pauseOnHover: isTouchDevice ? false : true,
			maskAutoSize: true,
			switchTime: 4000,
			animSpeed: 600,
			event:'click',
			swipeGap: false,
			swipeThreshold: 50,
			handleTouch: true,
			vertical: false,
			useTranslate3D: false,
			step: false
		}, options);
		this.init();
	}
	ScrollGallery.prototype = {
		init: function() {
			if(this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.refreshPosition();
				this.refreshState(true);
				this.resumeRotation();
				this.makeCallback('onInit', this);
			}
		},
		findElements: function() {
			// define dimensions proporties
			this.fullSizeFunction = this.options.vertical ? 'outerHeight' : 'outerWidth';
			this.innerSizeFunction = this.options.vertical ? 'height' : 'width';
			this.slideSizeFunction = 'outerHeight';
			this.maskSizeProperty = 'height';
			this.animProperty = this.options.vertical ? 'marginTop' : 'marginLeft';
			this.swipeProperties = this.options.vertical ? ['up', 'down'] : ['left', 'right'];
			
			// control elements
			this.gallery = $(this.options.holder);
			this.mask = this.gallery.find(this.options.mask);
			this.slider = this.mask.find(this.options.slider);
			this.slides = this.slider.find(this.options.slides);
			this.btnPrev = this.gallery.find(this.options.btnPrev);
			this.btnNext = this.gallery.find(this.options.btnNext);
			this.currentStep = 0; this.stepsCount = 0;
			
			// get start index
			if(this.options.step === false) {
				var activeSlide = this.slides.filter('.'+this.options.activeClass);
				if(activeSlide.length) {
					this.currentStep = this.slides.index(activeSlide);
				}
			}
			
			// calculate offsets
			this.calculateOffsets();
			$(window).bind('resize orientationchange', $.proxy(this.onWindowResize, this));
			
			// create gallery pagination
			if(typeof this.options.generatePagination === 'string') {
				this.buildPagination();
			} else {
				this.pagerLinks = this.gallery.find(this.options.pagerLinks);
				this.attachPaginationEvents();
			}
			
			// autorotation control buttons
			this.btnPlay = this.gallery.find(this.options.btnPlay);
			this.btnPause = this.gallery.find(this.options.btnPause);
			this.btnPlayPause = this.gallery.find(this.options.btnPlayPause);
			
			// misc elements
			this.curNum = this.gallery.find(this.options.currentNumber);
			this.allNum = this.gallery.find(this.options.totalNumber);
		},
		attachEvents: function() {
			this.btnPrev.bind(this.options.event, this.bindScope(function(e){
				this.prevSlide();
				e.preventDefault();
			}));
			this.btnNext.bind(this.options.event, this.bindScope(function(e){
				this.nextSlide();
				e.preventDefault();
			}));
			
			// pause on hover handling
			if(this.options.pauseOnHover) {
				this.gallery.hover(this.bindScope(function(){
					if(this.options.autoRotation) {
						this.galleryHover = true;
						this.pauseRotation();
					}
				}), this.bindScope(function(){
					if(this.options.autoRotation) {
						this.galleryHover = false;
						this.resumeRotation();
					}
				}));
			}
			
			// autorotation buttons handler
			this.btnPlay.bind(this.options.event, this.bindScope(this.startRotation));
			this.btnPause.bind(this.options.event, this.bindScope(this.stopRotation));
			this.btnPlayPause.bind(this.options.event, this.bindScope(function(){
				if(!this.gallery.hasClass(this.options.autorotationActiveClass)) {
					this.startRotation();
				} else {
					this.stopRotation();
				}
			}));
			
			// swipe event handling
			if(isTouchDevice) {
				// enable hardware acceleration
				if(this.options.useTranslate3D) {
					this.slider.css({'-webkit-transform': 'translate3d(0px, 0px, 0px)'});
				}
				
				// swipe gestures
				if(this.options.handleTouch && $.fn.swipe) {
					this.mask.swipe({
						threshold: this.options.swipeThreshold,
						allowPageScroll: 'vertical',
						swipeStatus: $.proxy(function(e, phase, direction, distance) {
							if(phase === 'start') {
								this.originalOffset = parseInt(this.slider.stop(true, false).css(this.animProperty));
							} else if(phase === 'move') {
								if(direction === this.swipeProperties[0] || direction === this.swipeProperties[1]) {
									var tmpOffset = this.originalOffset + distance * (direction === this.swipeProperties[0] ? -1 : 1);
									if(!this.options.swipeGap) {
										tmpOffset = Math.max(Math.min(0, tmpOffset), this.maxOffset);
									}
									this.tmpProps = {};
									this.tmpProps[this.animProperty] = tmpOffset;
									this.slider.css(this.tmpProps);
									e.preventDefault();
								}
							} else if(phase === 'cancel') {
								// return to previous position
								this.switchSlide();
							}
						},this),
						swipe: $.proxy(function(event, direction) {
							if(direction === this.swipeProperties[0]) {
								if(this.currentStep === this.stepsCount - 1) this.switchSlide();
								else this.nextSlide();
							} else if(direction === this.swipeProperties[1]) {
								if(this.currentStep === 0) this.switchSlide();
								else this.prevSlide();
							}
						},this)
					});
				}
			}
		},
		onWindowResize: function() {
			if(!this.galleryAnimating) {
				this.calculateOffsets();
				this.refreshPosition();
				this.buildPagination();
				this.refreshState();
				this.resizeQueue = false;
			} else {
				this.resizeQueue = true;
			}
		},
		refreshPosition: function() {
			this.currentStep = Math.min(this.currentStep, this.stepsCount - 1);
			this.tmpProps = {};
			this.tmpProps[this.animProperty] = this.getStepOffset();
			this.slider.stop().css(this.tmpProps);
		},
		calculateOffsets: function() {
			this.maskSize = this.mask[this.innerSizeFunction]();
			this.sumSize = this.getSumSize();
			this.maxOffset = this.maskSize - this.sumSize;
			
			// vertical gallery with single size step custom behavior
			if(this.options.vertical && this.options.maskAutoSize) {
				this.options.step = 1;
				this.stepsCount = this.slides.length;
				this.stepOffsets = [0];
				var tmpOffset = 0;
				for(var i = 0; i < this.slides.length; i++) {
					tmpOffset -= $(this.slides[i])[this.fullSizeFunction](true);
					this.stepOffsets.push(tmpOffset);
				}
				this.maxOffset = tmpOffset;
				return;
			}
			
			// scroll by slide size
			if(typeof this.options.step === 'number' && this.options.step > 0) {
				this.slideDimensions = [];
				this.slides.each($.proxy(function(ind, obj){
					this.slideDimensions.push( $(obj)[this.fullSizeFunction](true) );
				},this));
				
				// calculate steps count
				this.stepOffsets = [0];
				this.stepsCount = 1;
				var tmpOffset = 0, tmpStep = 0;
				while(tmpOffset > this.maxOffset) {
					tmpOffset -= this.getSlideSize(tmpStep, tmpStep + this.options.step);
					tmpStep += this.options.step;
					this.stepOffsets.push(Math.max(tmpOffset, this.maxOffset));
					this.stepsCount++;
				}
			}
			// scroll by mask size
			else {
				// define step size
				this.stepSize = this.maskSize;
				
				// calculate steps count
				this.stepsCount = 1;
				var tmpOffset = 0;
				while(tmpOffset > this.maxOffset) {
					tmpOffset -= this.stepSize;
					this.stepsCount++;
				}
			}
		},
		getSumSize: function() {
			var sum = 0;
			this.slides.each($.proxy(function(ind, obj){
				sum += $(obj)[this.fullSizeFunction](true);
			},this));
			this.slider.css(this.innerSizeFunction, sum);
			return sum;
		},
		getStepOffset: function(step) {
			step = step || this.currentStep;
			if(typeof this.options.step === 'number') {
				return this.stepOffsets[this.currentStep];
			} else {
				return Math.max(-this.currentStep * this.stepSize, this.maxOffset);
			}
		},
		getSlideSize: function(i1, i2) {
			var sum = 0;
			for(var i = i1; i < Math.min(i2, this.slideDimensions.length); i++) {
				sum += this.slideDimensions[i];
			}
			return sum;
		},
		buildPagination: function() {
			if(this.options.generatePagination) {
				this.pagerHolder = this.gallery.find(this.options.generatePagination).empty();
				this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
				for(var i = 0; i < this.stepsCount; i++) {
					$(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i+1);
				}
				this.pagerLinks = this.pagerList.children();
				this.attachPaginationEvents();
			}
		},
		attachPaginationEvents: function() {
			this.pagerLinks.each(this.bindScope(function(ind, obj){
				$(obj).bind(this.options.event, this.bindScope(function(){
					this.numSlide(ind);
					return false;
				}));
			}));
		},
		prevSlide: function() {
			if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
				if(this.currentStep > 0) {
					this.currentStep--;
					this.switchSlide();
				} else if(this.options.circularRotation) {
					this.currentStep = this.stepsCount - 1;
					this.switchSlide();
				}
			}
		},
		nextSlide: function(fromAutoRotation) {
			if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
				if(this.currentStep < this.stepsCount - 1) {
					this.currentStep++;
					this.switchSlide();
				} else if(this.options.circularRotation || fromAutoRotation === true) {
					this.currentStep = 0;
					this.switchSlide();
				}
			}
		},
		numSlide: function(c) {
			if(this.currentStep != c) {
				this.currentStep = c;
				this.switchSlide();
			}
		},
		switchSlide: function() {
			this.galleryAnimating = true;
			this.tmpProps = {}
			this.tmpProps[this.animProperty] = this.getStepOffset();
			this.slider.stop().animate(this.tmpProps,{duration: this.options.animSpeed, complete: this.bindScope(function(){
				// animation complete
				this.galleryAnimating = false;
				if(this.resizeQueue) {
					this.onWindowResize();
				}
				
				// onchange callback
				this.makeCallback('onChange', this);
				this.autoRotate();
			})});
			this.refreshState();
			
			// onchange callback
			this.makeCallback('onBeforeChange', this);
		},
		refreshState: function(initial) {
			if(this.options.step === 1 || this.stepsCount === this.slides.length) {
				this.slides.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
			}
			this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
			this.curNum.html(this.currentStep+1);
			this.allNum.html(this.stepsCount);
			
			// initial refresh
			if(this.options.maskAutoSize && typeof this.options.step === 'number') {
				this.tmpProps = {};
				this.tmpProps[this.maskSizeProperty] = this.slides.eq(Math.min(this.currentStep,this.slides.length-1))[this.slideSizeFunction](true);
				this.mask.stop()[initial ? 'css' : 'animate'](this.tmpProps);
			}
			
			// disabled state
			if(!this.options.circularRotation) {
				this.btnPrev.add(this.btnNext).removeClass(this.options.disabledClass);
				if(this.currentStep === 0) this.btnPrev.addClass(this.options.disabledClass);
				if(this.currentStep === this.stepsCount - 1) this.btnNext.addClass(this.options.disabledClass);
			}
		},
		startRotation: function() {
			this.options.autoRotation = true;
			this.galleryHover = false;
			this.autoRotationStopped = false;
			this.resumeRotation();
		},
		stopRotation: function() {
			this.galleryHover = true;
			this.autoRotationStopped = true;
			this.pauseRotation();
		},
		pauseRotation: function() {
			this.gallery.addClass(this.options.autorotationDisabledClass);
			this.gallery.removeClass(this.options.autorotationActiveClass);
			clearTimeout(this.timer);
		},
		resumeRotation: function() {
			if(!this.autoRotationStopped) {
				this.gallery.addClass(this.options.autorotationActiveClass);
				this.gallery.removeClass(this.options.autorotationDisabledClass);
				this.autoRotate();
			}
		},
		autoRotate: function() {
			clearTimeout(this.timer);
			if(this.options.autoRotation && !this.galleryHover && !this.autoRotationStopped) {
				this.timer = setTimeout(this.bindScope(function(){
					this.nextSlide(true);
				}), this.options.switchTime);
			} else {
				this.pauseRotation();
			}
		},
		bindScope: function(func, scope) {
			return $.proxy(func, scope || this);
		},
		makeCallback: function(name) {
			if(typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	}
	
	// detect device type
	var isTouchDevice = (function() {
		try {
			return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		} catch (e) {
			return false;
		}
	}());
	
	// jquery plugin
	$.fn.scrollGallery = function(opt){
		return this.each(function(){
			$(this).data('ScrollGallery', new ScrollGallery($.extend(opt,{holder:this})));
		});
	}
}(jQuery));

/*
 * touchSwipe - jQuery Plugin
 * http://plugins.jquery.com/project/touchSwipe
 * http://labs.skinkers.com/touchSwipe/
 *
 * Copyright (c) 2010 Matt Bryson (www.skinkers.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * $version: 1.2.5
 */
;(function(a){a.fn.swipe=function(c){if(!this){return false}var k={fingers:1,threshold:75,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,click:null,triggerOnTouchEnd:true,allowPageScroll:"auto"};var m="left";var l="right";var d="up";var s="down";var j="none";var u="horizontal";var q="vertical";var o="auto";var f="start";var i="move";var h="end";var n="cancel";var t="ontouchstart" in window,b=t?"touchstart":"mousedown",p=t?"touchmove":"mousemove",g=t?"touchend":"mouseup",r="touchcancel";var e="start";if(c.allowPageScroll==undefined&&(c.swipe!=undefined||c.swipeStatus!=undefined)){c.allowPageScroll=j}if(c){a.extend(k,c)}return this.each(function(){var D=this;var H=a(this);var E=null;var I=0;var x={x:0,y:0};var A={x:0,y:0};var K={x:0,y:0};function z(N){var M=t?N.touches[0]:N;e=f;if(t){I=N.touches.length}distance=0;direction=null;if(I==k.fingers||!t){x.x=A.x=M.pageX;x.y=A.y=M.pageY;if(k.swipeStatus){y(N,e)}}else{C(N)}D.addEventListener(p,J,false);D.addEventListener(g,L,false)}function J(N){if(e==h||e==n){return}var M=t?N.touches[0]:N;A.x=M.pageX;A.y=M.pageY;direction=v();if(t){I=N.touches.length}e=i;G(N,direction);if(I==k.fingers||!t){distance=B();if(k.swipeStatus){y(N,e,direction,distance)}if(!k.triggerOnTouchEnd){if(distance>=k.threshold){e=h;y(N,e);C(N)}}}else{e=n;y(N,e);C(N)}}function L(M){M.preventDefault();distance=B();direction=v();if(k.triggerOnTouchEnd){e=h;if((I==k.fingers||!t)&&A.x!=0){if(distance>=k.threshold){y(M,e);C(M)}else{e=n;y(M,e);C(M)}}else{e=n;y(M,e);C(M)}}else{if(e==i){e=n;y(M,e);C(M)}}D.removeEventListener(p,J,false);D.removeEventListener(g,L,false)}function C(M){I=0;x.x=0;x.y=0;A.x=0;A.y=0;K.x=0;K.y=0}function y(N,M){if(k.swipeStatus){k.swipeStatus.call(H,N,M,direction||null,distance||0)}if(M==n){if(k.click&&(I==1||!t)&&(isNaN(distance)||distance==0)){k.click.call(H,N,N.target)}}if(M==h){if(k.swipe){k.swipe.call(H,N,direction,distance)}switch(direction){case m:if(k.swipeLeft){k.swipeLeft.call(H,N,direction,distance)}break;case l:if(k.swipeRight){k.swipeRight.call(H,N,direction,distance)}break;case d:if(k.swipeUp){k.swipeUp.call(H,N,direction,distance)}break;case s:if(k.swipeDown){k.swipeDown.call(H,N,direction,distance)}break}}}function G(M,N){if(k.allowPageScroll==j){M.preventDefault()}else{var O=k.allowPageScroll==o;switch(N){case m:if((k.swipeLeft&&O)||(!O&&k.allowPageScroll!=u)){M.preventDefault()}break;case l:if((k.swipeRight&&O)||(!O&&k.allowPageScroll!=u)){M.preventDefault()}break;case d:if((k.swipeUp&&O)||(!O&&k.allowPageScroll!=q)){M.preventDefault()}break;case s:if((k.swipeDown&&O)||(!O&&k.allowPageScroll!=q)){M.preventDefault()}break}}}function B(){return Math.round(Math.sqrt(Math.pow(A.x-x.x,2)+Math.pow(A.y-x.y,2)))}function w(){var P=x.x-A.x;var O=A.y-x.y;var M=Math.atan2(O,P);var N=Math.round(M*180/Math.PI);if(N<0){N=360-Math.abs(N)}return N}function v(){var M=w();if((M<=45)&&(M>=0)){return m}else{if((M<=360)&&(M>=315)){return m}else{if((M>=135)&&(M<=225)){return l}else{if((M>45)&&(M<135)){return s}else{return d}}}}}try{this.addEventListener(b,z,false);this.addEventListener(r,C)}catch(F){}})}})(jQuery);
