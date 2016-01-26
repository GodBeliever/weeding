/* ---------------------------------------------------------------
 * ------------------- Global variable | Bad ??? ----------------- 
   --------------------------------------------------------------- */
var actualQuote;
var hiddenSentence;
var dispercedSentence;
var ready;
var windowWidth;
var windowHeight;
/* ---------------------------------------------------------------
 * -------------------- Helpers Functions ------------------------ 
   --------------------------------------------------------------- */

// Get a Random color for the sentence
function getRandomColor (){
    return '#'+ Math.round(0xffffff * Math.random()).toString(16);
}

function getRandomPos (elemWidth,elemHeight){
    // make position sensitive to size and document's width
    //posX = (Math.random() * (windowWidth - elemWidth)).toFixed();
    //posY = (Math.random() * (windowHeight - elemHeight)).toFixed();
    
    posX = Math.floor((Math.random() * (windowWidth - elemWidth)));
    posY = Math.floor((Math.random() * (windowHeight - elemHeight)));
    
    return {x: posX, y: posY};
}

function getAQuote(){
	var random = Math.floor(Math.random() * $.wedding.quote.length)
	if(actualQuote.id == $.wedding.quote[random].id){
		return getAQuote();
	}
	actualQuote = $.wedding.quote[random]
	return actualQuote;
}

function addToHiddenQuote(text,classText,type){
	$elem = $('<'+type+'>'+text+'</'+type+'>').addClass(classText);
	hiddenSentence.push($elem);
	$elem.appendTo('#quotePlace');
}

function addToVisibleQuote(text,classText,type){
	$visibleDiv = $('<'+type+'>'+text+'</'+type+'>').addClass(classText);
	dispercedSentence.push($visibleDiv);
	pos = getRandomPos($visibleDiv.width(),$visibleDiv.height());

	$visibleDiv.css({
		'left':pos.x,
		'top':pos.y,
		'display':'none'
	}).appendTo( '#home' ).fadeIn(800);
}

function quoteMng(){
		actualQuote = {id:-1};
		hiddenSentence = [];
		dispercedSentence = [];

		color = getRandomColor();
		quote = getAQuote();

		nbCar = 0

		$('#quotePlace').contents().remove();
		
		//Processing the quote
		for(var i=0,len=quote.sentence.length;i<len;i++){
			nbCar += quote.sentence[i].length;

			addToHiddenQuote(quote.sentence[i],'hiddenQuote','span');
			addToHiddenQuote(' ','hiddenQuote','span');
			addToVisibleQuote(quote.sentence[i],'visibleQuote','div');
			addToVisibleQuote(' ','visibleQuote','div');
		}

		//Add the markup for the author
		addToHiddenQuote(quote.person,'hiddenQuoteAuthor','div');
		addToVisibleQuote(quote.person,'visibleQuoteAuthor','div');
		
		quotePlacePos = getRandomPos($('#quotePlace').width(),$('#quotePlace').height());
		
		console.log('Window Width = '+windowWidth+' | Windows Heigth = '+windowHeight);
		console.log('quote place x = '+quotePlacePos.x+' | quote place y = '+quotePlacePos.y);
		//Change the #quotePlace position
		$('#quotePlace').animate({
			'left':quotePlacePos.x,
			'top':quotePlacePos.y
		});
		//Processing the translation
		for(var i=0,len=dispercedSentence.length;i<len;i++){
			var trans = $(hiddenSentence[i]).offset();
			//$(dispercedSentence[i]).delay(nbCar * 500).transition({x:pos.left,y:pos.top},1000,'ease');
			$(dispercedSentence[i]).delay(1500).animate({
				'left':Math.floor(trans.left),
				'top':Math.floor(trans.top)
			},1300
			);
		}

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
		$('.visibleQuote').delay(nbCar * timeCoef).fadeOut(700, function(){
			$(this).remove();
		});
		$('.visibleQuoteAuthor').delay(nbCar * timeCoef).fadeOut(700, function(){
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
