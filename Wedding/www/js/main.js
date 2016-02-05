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
	
	console.log(windowWidth);
	console.log(windowHeight);
	// ScrollPath drawing
	/*var path = $.fn.scrollPath("getPath");/*, {
	    scrollSpeed: 80, // Default is 50
	    rotationSpeed: Math.PI / 10 // Default is Math.PI / 15
	});
	
	path.moveTo(windowWidth/2,windowHeight/2)
	// Line to the center of the scrren to 
		.lineTo(windowWidth/2,windowHeight)
		.arc(windowWidth * 0.75,windowHeight * 1.5 ,Math.PI,0.5*Math.PI,true);
	
	$("#pageWrapper").scrollPath({
	    drawPath: true,
	    wrapAround: false,
	    scrollBar: true
	});*/
	// Declaration for the screen size management
    $('body').restive({
          breakpoints: ['10000'],
          classes: ['nb'],
          turbo_classes: 'is_mobile=mobi,is_phone=phone,is_tablet=tablet,is_landscape=landscape,is_portrait=portrait'
    });

	// Initiate and launch the quote animation on the home page
	actualQuote = {id:-1};
	quoteMng();
});
