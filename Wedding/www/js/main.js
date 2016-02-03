/* ---------------------------------------------------------------
 * ------------------- Global variable | Bad ??? ----------------- 
   --------------------------------------------------------------- */
var actualQuote;
var windowWidth;
var windowHeight;
var quotePartOneID = '#quotePartOne';
var quotePartTwoID = '#quotePartOne';
var quoteAuthorID = '#quoteAuthor';
/* ---------------------------------------------------------------
 * -------------------- Helpers Functions ------------------------ 
   --------------------------------------------------------------- */

function getAQuote(){
	var random = Math.floor(Math.random() * $.wedding.quote.length)
	if(actualQuote.id == $.wedding.quote[random].id){
		return getAQuote();
	}
	actualQuote = $.wedding.quote[random]
	return actualQuote;
}

function quoteMng(){
		actualQuote = {id:-1};
		dispercedSentence = [];

		quote = getAQuote();

		//Flush all citation data
		$(quotePartOneID).contents().remove();
		$(quotePartTwoID).contents().remove();
		$(quoteAuthorID).contents().remove();
		
		//Processing the fadeIn
		$(quote.partOne).appendTo( quotePartOneID ).fadeIn(800);
		$(quote.partTwo).appendTo( quotePartTwoID ).fadeIn(800);
		$(quote.author).appendTo( quoteAuthorID ).fadeIn(800);

		//Processing the fadeOut
		var timeCoef = 1;
		if(nbCar <= 10) {
			timeCoef = 300;
		}else if(nbCar > 10 && nbCar <= 50){
			timeCoef = 100;
		} else if(nbCar > 50 && nbCar <= 100){
			timeCoef = 80;
		}else if (nbCar > 100){
			timeCoef = 50;
		}
		$(quotePartOneID).delay(nbCar * timeCoef).fadeOut(700, function(){
			$(this).remove();
		});
		$(quotePartTwoID).delay(nbCar * timeCoef).fadeOut(700, function(){
			$(this).remove();
		});
		$(quoteAuthorID).delay(nbCar * timeCoef).fadeOut(700, function(){
			$(this).remove();
			setTimeout(quoteMng,2000);
		});
}

/* ---------------------------------------------------------------
 * ------------------------ Main function ------------------------ 
   --------------------------------------------------------------- */
$(document).ready(function(){
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	quoteMng();
});
