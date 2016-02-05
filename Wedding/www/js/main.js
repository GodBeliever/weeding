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
function quoteMng(){

		quote = getAQuote();
		
		//Flush all citation data
		$(quoteClass).contents().remove();
		
		//Processing the fadeIn
		$(quotePartOneID).text(quote.partOne).fadeIn(1300);
		$(quotePartTwoID).text(quote.partTwo).fadeIn(1300);
		$(quoteAuthorID).text(quote.author).fadeIn(1300);

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
			setTimeout(quoteMng,2500);
		});
}

/*
 * Animation for the logo Section :
 * 		Background changing to red
 * 		Wedding logo bouncing
 */
function logoSectionAnim() {
	// .to('@target', @length, {@object})
	var bg_tween = TweenMax.to('#logoSection-trigger', 2, {
	  backgroundColor: '#ff6666',
	  ease: Linear.easeNone
	});
	var temp = new ScrollMagic.Scene({
		  triggerElement: '#logoSection-trigger'
	})
	.setTween(bg_tween);
	
	return temp;
}
/* ---------------------------------------------------------------
 * ------------------------ Main function ------------------------ 
   --------------------------------------------------------------- */
$(document).ready(function(){
	
	// Perform the content resizing at last all the 250 ms
	var resizeContent = debounce(function() {
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		$(".page").css(
			"height",windowHeight
		);
	}, 250);

	$(window).on('resize', resizeContent);
	
	resizeContent();

	// Initiate and launch the quote animation on the home page
	actualQuote = {id:-1};
	quoteMng();

	/* ------ ScrollMagic animation ------ */

	// init ScrollMagic Controller
	var controller = new ScrollMagic.Controller();
	
	var bg_tween = TweenMax.to('#logoSection-trigger', 2, {
		  backgroundColor: '#ff6666',
		  ease: Linear.easeNone
		});
		var temp = new ScrollMagic.Scene({
			  triggerElement: '#logoSection-trigger'
		})
		.setTween(bg_tween);
		
		
	controller.addScene(temp);
	
	// Declaration for the screen size management
    $('body').restive({
          breakpoints: ['10000'],
          classes: ['nb'],
          turbo_classes: 'is_mobile=mobi,is_phone=phone,is_tablet=tablet,is_landscape=landscape,is_portrait=portrait'
    });

});
