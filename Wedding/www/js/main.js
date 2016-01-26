/* ---------------------------------------------------------------
 * ------------------- Global variable | Bad ??? ----------------- 
   --------------------------------------------------------------- */
var actualQuote;
var hiddenSentence;
var dispercedSentence;
var ready;

/* ---------------------------------------------------------------
 * -------------------- Helpers Functions ------------------------ 
   --------------------------------------------------------------- */

// Get a Random color for the sentence
function getRandomColor (){
    return '#'+ Math.round(0xffffff * Math.random()).toString(16);
}

function getRandomPos (elemWidth,elemHeight){
    // make position sensitive to size and document's width
    posX = (Math.random() * ($(window).width() - elemWidth)).toFixed();
    posY = (Math.random() * ($(window).height() - elemHeight)).toFixed();
    
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

/*function getRandomColor (){
    var color = '#'+ Math.round(0xffffff * Math.random()).toString(16);
    $newdiv = $('<div/>').css({
        'width':divsize+'px',
        'height':divsize+'px',
        'background-color': color
    });

    // make position sensitive to size and document's width
    var posx = (Math.random() * ($(document).width() - divsize)).toFixed();
    var posy = (Math.random() * ($(document).height() - divsize)).toFixed();

    $newdiv.css({
        'position':'absolute',
        'left':posx+'px',
        'top':posy+'px',
        'display':'none'
    }).appendTo( 'body' ).fadeIn(100).delay(1000).fadeOut(500, function(){
      $(this).remove();
      makeDiv(); 
    }); 
}*/
//TODO remove id car inutile
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
		'position':'absolute',
		'left':pos.x+'px',
		'top':pos.y+'px',
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

		//Change the #quotePlace position
		$('#quotePlace').css({
			'position':'absolute',
			'left':quotePlacePos.x+'px',
			'top':quotePlacePos.y+'px'
		});
		//Processing the translation
		for(var i=0,len=dispercedSentence.length;i<len;i++){
			var trans = $(hiddenSentence[i]).offset();
			//$(dispercedSentence[i]).delay(nbCar * 500).transition({x:pos.left,y:pos.top},1000,'ease');
			$(dispercedSentence[i]).delay(1500).animate({
				'left':trans.left,
				'top':trans.top
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
	quoteMng();
});
