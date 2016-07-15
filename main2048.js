//  Game Data
var board = new Array();
var score = 0;

$(document).ready(function() {
    newgame();
});

function newgame(){
	// initialize play board
	init();	
	// Random generate 2 numbers
	generateOneNumber();
	generateOneNumber();
}


function init(){  // initialize play board
	for (var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			$("#grid_cell_"+i+"_"+j).css('top', getPosTop(i,j));
			$("#grid_cell_"+i+"_"+j).css('left', getPosLeft(i,j));
		}
	}

	//  Create a 2D array
	for (var i = 0; i < 4; i++) {
		board[i]=new Array();
		for(var j = 0; j < 4; j++) {
			board[i][j] = 0;
		}
	}

	updateBoardView();
}

function updateBoardView(){
	$(".number_cell").remove();

	for (var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			$("#grid_container").append('<div class="number_cell" id="number_cell_'+i+'_'+j+'"></div>');
			var theNumberCell = $('#number_cell_'+i+'_'+j);

			if(board[i][j] == 0){
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				theNumberCell.css('top', getPosTop(i,j) + 50);
				theNumberCell.css('left', getPosLeft(i,j) + 50);
			}else{
				theNumberCell.css('width', '100px');
				theNumberCell.css('height', '100px');
				theNumberCell.css('top', getPosTop(i,j));
				theNumberCell.css('left', getPosLeft(i,j));
				theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
		}
	}
}

function generateOneNumber(){
	if(nospace(board)){
		return false;
	}else{
		//  Get a random position
		var randx = parseInt(Math.floor(Math.random()*4));
		var randy = parseInt(Math.floor(Math.random()*4));

		while(1){
			if(board[randx][randy] == 0){
				break;
			}
			randx = parseInt(Math.floor(Math.random()*4));
			randy = parseInt(Math.floor(Math.random()*4));
		}

		//  Get a random number
		var randNumber = Math.random() < 0.5 ? 2 : 4;

		//  Show the number on that position
		board[randx][randy] = randNumber;
		showNumberWithAnimation(randx, randy, randNumber);

		return true;	
	}
}

/*
	for (var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			
		}
	}

*/
