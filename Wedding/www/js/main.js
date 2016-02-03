/* ---------------------------------------------------------------
 * ------------------- Global variable | Bad ??? ----------------- 
   --------------------------------------------------------------- */
var actualQuote;
var windowWidth;
var windowHeight;
var quotePartOneID = '#quotePartOne';
var quotePartTwoID = '#quotePartTwo';
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

		quote = getAQuote();

		//Flush all citation data
		$(quotePartOneID).contents().remove();
		$(quotePartTwoID).contents().remove();
		$(quoteAuthorID).contents().remove();
		
		//Processing the fadeIn
		$(quotePartOneID).text(quote.partOne).fadeIn(800);
		$(quotePartTwoID).text(quote.partTwo).fadeIn(800);
		$(quoteAuthorID).text(quote.author).fadeIn(800);

		//Processing the fadeOut
		nbCar = quote.partOne.length + quote.partTwo.length
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
			$(this).contents().remove();
		});
		$(quotePartTwoID).delay(nbCar * timeCoef).fadeOut(700, function(){
			$(this).contents().remove();
		});
		$(quoteAuthorID).delay(nbCar * timeCoef).fadeOut(700, function(){
			$(this).contents().remove();
			setTimeout(quoteMng,2000);
		});
}

/* ---------------------------------------------------------------
 * ------------------------ Main function ------------------------ 
   --------------------------------------------------------------- */
$(document).ready(function(){
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	actualQuote = {id:-1};
	quoteMng();
});
