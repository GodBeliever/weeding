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
var greyBG = '#333333';
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
	console.log('Scroll on');
	horizontalScroll = true;
	$('html, body').mousewheel(function(event, delta) {
		this.scrollLeft -= (delta * wheelSpeed);
		event.preventDefault();
	});
}

function desactivateHorizontalScroll() {
	console.log('Scroll off');
	horizontalScroll = false;
	$('html, body').unmousewheel();
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
									top: '-=100',
									ease: Linear.easeNone
								}),
								
						]);
	return new ScrollMagic.Scene({
		triggerElement: '#homeSection-trigger',
		triggerHook: 'onLeave',
		//loglevel: 3,
		duration: 550
	})
	.setTween(timeline);
}

/*
 * Wedding logo rotation
 * Background changing to red
 */
function logoPageAnim() {
	
	var timeline = new TimelineMax()
			.from('#weddingLogo', 1.5,
			{
				scale : 0.05,
				opacity: 0,
				rotation: 360,
				ease: Cubic.easeOut
			})
			.to('#logoPage', 1,
			{
				backgroundColor: redBG,
				ease: Linear.easeNone,
				onComplete: activateHorizontalScroll
			});
	
	return new ScrollMagic.Scene({
		triggerElement: '#logoSection-trigger',
		triggerHook: 'onLeave',
		//loglevel: 3,
		duration: $(window).height()
	})
	.setTween(timeline)
	.setPin('#logoSection-trigger')
	.on('update', function (event) {
		if(horizontalScroll && $('html').scrollLeft() == 0){
			//console.log("scrollLeft = "+$('html').scrollLeft()+" | #logoPage.offset="+$('#logoPage').offset());
			desactivateHorizontalScroll();
		}
	});
}

/*
 * Background changing to grey
 * Text Animation 
 */
function lylysPageAnim() {
	
	var timeline = new TimelineMax()
			/*.to('.animeToGrey', 0,
			{
				backgroundColor: greyBG,
				ease: Linear.easeNone
			})*/
			.from('#lylyPage > h1',1,
			{
				scale : 0.5,
				opacity: 0,
				ease: Cubic.easeOut
			})
			.from('#lylyArrow',1,
			{
				scale : 0.5,
				opacity: 0,
				rotation: -20,
				ease: Cubic.easeOut
			})
			//Ajouter ici anim pour photo lyly
			.from('#lylyPage > h2',2,
			{
				scale : 0.5,
				opacity: 0,
				ease: Cubic.easeOut
			});
	
	return new ScrollMagic.Scene({
		triggerElement: '#lylySection-trigger',
		triggerHook: 'onLeave',
		//loglevel: 3,
		duration: $(window).width()*1.5
	})
	.setTween(timeline)
	.setPin('#lylyPage');
}

/*
 * Background changing to grey
 * Text Animation 
 */
function alexsPageAnim() {
	
	var timeline = new TimelineMax()
			.to('body', 0,
			{
				backgroundColor: greyBG,
				ease: Linear.easeNone
			})
			.staggerTo('#cause > span',1,
			{
				textDecoration: 'line-through',
				ease: Cubic.easeOut
			}
			,0.07)
			.from('#grace',1,
			{
				opacity: 0,
				ease: Cubic.easeOut
			});
	
	return new ScrollMagic.Scene({
		triggerElement: '#alexSection-trigger',
		triggerHook: 'onEnter',
		//loglevel: 3,
		duration: $(window).width()
	})
	.setTween(timeline)
	.setPin('#alexSection-trigger');
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
		$('.page').css({
			'height' :windowHeight,
			'width' : windowWidth
		});
	}, 250);

	$(window).on('resize', resizeContent);
	
	resizeContent();
	/* ------ Canvas Drawing (Lyly's Page)  ------ */
	/*var canvas = document.getElementById('lylysCanvas');
    var context = canvas.getContext('2d');

    context.beginPath();
    context.moveTo(0, 0);
    context.quadraticCurveTo(canvas.width, canvas.height/2, 0, canvas.height);

    context.fillStyle = redBG;
    context.fill();*/
    
	/* ------ Manual animation ------ */
	// Initiate and launch the quote animation on the home page
	actualQuote = {id:-1};
	quoteAnim();

	/* ------ ScrollMagic animation ------ */

	// init ScrollMagic Controller
	var controller = new ScrollMagic.Controller({addIndicators: true});
	var horizontalController = new ScrollMagic.Controller({vertical:false,addIndicators: true});
	
	// Home page parallax
	homePageAnim().addTo(controller);
	// Animation for the logo Section
	logoPageAnim().addTo(controller);
	// Animation for the Lyly's Section
	lylysPageAnim().addTo(horizontalController);
	// Animation for the Alex's Section
	alexsPageAnim().addTo(horizontalController);
	
	/* ------ Restive.js init ------ */
	// Declaration for the screen size management
    $('body').restive({
          breakpoints: ['10000'],
          classes: ['nb'],
          turbo_classes: 'is_mobile=mobi,is_phone=phone,is_tablet=tablet,is_landscape=landscape,is_portrait=portrait'
    });

});
