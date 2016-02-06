/* ---------------------------------------------------------------
 * ------------------- Global variable | Bad ??? ----------------- 
   --------------------------------------------------------------- */

var actualQuote;
var windowWidth;
var windowHeight;
var quotePartOneID = '#quotePartOne';
var quotePartTwoID = '#quotePartTwo';
var quoteAuthorID = '#quoteAuthor';
var quoteClass = '.quote';
var redBG = '#ff6666';
var wheelSpeed = 10;
var horizontalScroll = false;
var scrollTrigger = -1;

/* ---------------------------------------------------------------
 * -------------------- Helpers Functions ------------------------ 
   --------------------------------------------------------------- */

/* 
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 */
function debounce(func, wait, immediate) {
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

/*
 * Activate the horizontal scroll with the wheel
 */
function activateHorizontalScroll() {
	//$("html, body, *").mousewheel(function(event, delta) {
	
	if(horizontalScroll){
		horizontalScroll = false;
		/*$("html, body").mousewheel(function(event, delta) {
			console.log("scroll top");
			this.scrollTop -= (delta * wheelSpeed);
			this.scrollLeft = delta;
		});*/
		console.log("scroll top");
		$("html, body").unmousewheel();
	} else {
		horizontalScroll = true;
		$("html, body").mousewheel(function(event, delta) {
			this.scrollLeft -= (delta * wheelSpeed);
			event.preventDefault();
		});
	}
}
/*
 * Select a random quote from the quote variable.
 */
function getAQuote(){
	var random = Math.floor(Math.random() * $.wedding.quote.length)
	if(actualQuote.id == $.wedding.quote[random].id){
		return getAQuote();
	}
	actualQuote = $.wedding.quote[random]
	return actualQuote;
}

/* ---------------------------------------------------------------
 * ------------------ Animation Functions ------------------------ 
   --------------------------------------------------------------- */

/*
 * Show and animate the quote content
 */
function quoteAnim(){

		quote = getAQuote();
		
		//Flush all citation data
		//$(quoteClass).contents().remove();
		
		//Processing the fadeIn
		$(quotePartOneID).text(quote.partOne);
		$(quotePartTwoID).text(quote.partTwo);
		$(quoteAuthorID).text(quote.author);
		$(quoteClass).fadeIn(1000);
		
		//Calculate the display duration time for the quote
		nbCar = quote.partOne.length + quote.partTwo.length + quote.author.length
		var timeCoef = 1;
		if(nbCar <= 50) {
			timeCoef = 250;
		}else if(nbCar > 50 && nbCar <= 70){
			timeCoef = 100;
		} else if(nbCar > 70 && nbCar <= 130){
			timeCoef = 80;
		}else if (nbCar > 130){
			timeCoef = 50;
		}
		
		//Processing the fadeOut
		$(quoteClass).delay(nbCar * timeCoef).fadeOut(700, function(){
			$(this).contents().remove();
			setTimeout(quoteAnim,2000);
		});
}

/*
 * Parallax to home
 */
function homePageAnim() {
	var timeline = new TimelineMax()
						.add([
								TweenMax.to('#bgImage', 1, {
									top: "-=100",
									ease: Linear.easeNone
								}),
								
						]);
	return new ScrollMagic.Scene({
		triggerElement: '#homeSection-trigger',
		triggerHook: 'onLeave',
		duration: 550
	})
	.setTween(timeline);
}

/*
 * Background changing to red
 */
function logoSectionColorBG() {
	// .to('@target', @length, {@object})
	var bg_tween = TweenMax.to('#logoPage', 1, {
		  backgroundColor: redBG, // Rouge
		  ease: Linear.easeNone,
		  onComplete: activateHorizontalScroll
		});
	
	var scene = new ScrollMagic.Scene({
		triggerElement: '#logoSection-trigger',
		triggerHook: 'onLeave',
		duration: 400
	})
	.setTween(bg_tween)
	.setPin("#logoPage");
	
	scene.on("update", function (event) {
		//if(horizontalScroll && $('html').scrollLeft() == 0 ){
		if(horizontalScroll && $('html').scrollLeft() == 0){
			console.log("scrollLeft = "+$('html').scrollLeft()+" | "+$('#logoPage').offset());
			activateHorizontalScroll();
		}
	});
	
	return scene; 
}

/*
 * Wedding logo bouncing
 */
function logoBoucing() {
	var timeline = new TimelineMax({repeat: -1, yoyo:true});
	
	timeline.add(
		TweenMax.to('#logo-wrapper', 1, {
			transform: 'rotate(20deg)',
			ease: Cubic.easeOut,
		})
	);
	timeline.add(
		TweenMax.to('#logo-wrapper', 1, {
			transform: 'rotate(-20deg)',
			ease: Cubic.easeOut,
		})
	);
	
	return new ScrollMagic.Scene({
		triggerElement: '#logoSection-trigger'
	})
	.setTween(timeline);
}


/* ---------------------------------------------------------------
 * ------------------------ Main function ------------------------ 
   --------------------------------------------------------------- */
$(document).ready(function(){
	/* ------ Disable vertical scroll ------ */
	var $body = $('document');
	$body.bind('scroll', function() {
		// "Disable" the horizontal scroll.
		if ($body.scrollLeft() !== 0) {
			$body.scrollLeft(0);
		}
	});
	 
	/* ------ Resizing Screen Management ------ */
	// Perform the content resizing at last all the 250 ms
	var resizeContent = debounce(function() {
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		$(".page").css({
			"height" :windowHeight,
			"width" : windowWidth
		});
	}, 250);

	$(window).on('resize', resizeContent);
	
	resizeContent();
	
	/* ------ Manual animation ------ */
	// Initiate and launch the quote animation on the home page
	actualQuote = {id:-1};
	quoteAnim();

	/* ------ ScrollMagic animation ------ */

	// init ScrollMagic Controller
	var controller = new ScrollMagic.Controller();
	
	// Home page parallax
	homePageAnim().addTo(controller);
	// Animation for the logo Section
	logoSectionColorBG().addTo(controller);
	logoBoucing().addTo(controller);
	
	/* ------ Restive.js init ------ */
	// Declaration for the screen size management
    $('body').restive({
          breakpoints: ['10000'],
          classes: ['nb'],
          turbo_classes: 'is_mobile=mobi,is_phone=phone,is_tablet=tablet,is_landscape=landscape,is_portrait=portrait'
    });

});
