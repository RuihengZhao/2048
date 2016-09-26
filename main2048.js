<<<<<<< HEAD
//  Game Data
var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function() {
	prepareForMobile();
    newgame();
});

function prepareForMobile(){
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}

	if(documentWidth < 500){
		$('.info').css({
			width: '300px'
		});
		$('.gameover').css({
			top: '50%'
		});
		$('.score').css({
			margin: '-10px auto'
		});
	}

	$('#grid_container').css('width', gridContainerWidth-2*cellSpace);
	$('#grid_container').css('height', gridContainerWidth-2*cellSpace);
	$('#grid_container').css('padding', cellSpace);
	$('#grid_container').css('border-radius', 0.02*gridContainerWidth);

	$('.grid_cell').css('width', cellSideLength);
	$('.grid_cell').css('height', cellSideLength);
	$('.grid_cell').css('border-radius', 0.02*cellSideLength);
}

function newgame(){
	// initialize play board
	init();	
	$('.gameover').css({
		display: 'none'
	});
	$('#score').text('0');
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
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	updateBoardView();

	score = 0;
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
				theNumberCell.css('top', getPosTop(i,j) + cellSideLength/2);
				theNumberCell.css('left', getPosLeft(i,j) + cellSideLength/2);
			}else{
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top', getPosTop(i,j));
				theNumberCell.css('left', getPosLeft(i,j));
				theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

			hasConflicted[i][j] = false;
		}
	}

	$('.number_cell').css('line-height', cellSideLength+'px');
	$('.number_cell').css('font-size', 0.4*cellSideLength+'px');
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

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37:  // left
			event.preventDefault();
			if( moveLeft()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 38:  // up
			event.preventDefault();
			if( moveUp()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 39:  // right
			event.preventDefault();
			if( moveRight()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 40:  // down
			event.preventDefault();
			if( moveDown()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		default:break;  //  other key
	}
})

document.addEventListener('touchstart', function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchmove', function(event){
	event.preventDefault();
})

document.addEventListener('touchend', function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;

	if( Math.abs(deltax)<0.15*documentWidth && Math.abs(deltay)<0.15*documentWidth){
		return;
	}

	//  Determine it's moving updown or leftright
	if( Math.abs(deltax) >= Math.abs(deltay) ){  // leftright
		if(deltax > 0){  // right
			if( moveRight()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}else{  // left
			if( moveLeft()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
	}else{  // updown
		if(deltay > 0){  // down
			if( moveDown()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}else{  // up
			if( moveUp()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
	}
});

function isgameover(){
	if(nospace(board) && nomove(board)){
		gameover();
	}
}

function gameover(){
	$('.gameover').css({
		display: 'block'
	});
}

function moveLeft(){
	if(!canMoveLeft(board)){
		return false
	}else{
		for (var i = 0; i < 4; i++) {
			for(var j = 1; j < 4; j++) {
				if(board[i][j] != 0){
					for(var k = 0; k < j; k++){
						if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
							// You can move left
							showMoveAnimation(i, j, i, k);

							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
							//  You can move left and add two cell together
							showMoveAnimation(i, j, i, k);

							board[i][k] += board[i][j];
							board[i][j] = 0;

							// Add Score
							score += board[i][k];
							updateScore(score);

							hasConflicted[i][k] = true;
							continue;
						}
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()", 200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board)){
		return false
	}else{
		for (var i = 0; i < 4; i++) {
			for(var j = 2; j >= 0; j--){
				if(board[i][j] != 0){
					for(var k = 3; k > j; k--){
						if(board[i][k] == 0 && noBlockHorizontal(i, j, k, board)){
							// You can move left
							showMoveAnimation(i, j, i, k);

							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]){
							//  You can move left and add two cell together
							showMoveAnimation(i, j, i, k);

							board[i][k] += board[i][j];
							board[i][j] = 0;

							// Add Score
							score += board[i][k];
							updateScore(score);

							hasConflicted[i][k] = true;
							continue;
						}
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()", 200);
	return true;
}

function moveUp(){
	if(!canMoveUp(board)){
		return false
	}else{
		for(var j = 0; j < 4; j++) {
			for (var i = 1; i < 4; i++) {
				if(board[i][j] != 0){
					for(var k = 0; k < i; k++){
						if(board[k][j] == 0 && noBlockVertical(k, i, j, board)){
							// You can move left
							showMoveAnimation(i, j, k, j);

							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[k][j] == board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j]){
							//  You can move left and add two cell together
							showMoveAnimation(i, j, k, j);

							board[k][j] += board[i][j];
							board[i][j] = 0;

							// Add Score
							score += board[k][j];
							updateScore(score);

							hasConflicted[k][j] = true;
							continue;
						}
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()", 200);
	return true;
}

function moveDown(){
	if(!canMoveDown(board)){
		return false
	}else{
		for(var j = 0; j < 4; j++) {
			for (var i = 2; i >= 0; i--) {
				if(board[i][j] != 0){
					for(var k = 3; k > i; k--){
						if(board[k][j] == 0 && noBlockVertical(i, k, j, board)){
							// You can move left
							showMoveAnimation(i, j, k, j);

							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[k][j] == board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j]){
							//  You can move left and add two cell together
							showMoveAnimation(i, j, k, j);

							board[k][j] += board[i][j];
							board[i][j] = 0;

							// Add Score
							score += board[k][j];
							updateScore(score);

							hasConflicted[k][j] = true;
							continue;
						}
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()", 200);
	return true;
}
=======
//  Game Data
var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function() {
	prepareForMobile();
    newgame();
});

function prepareForMobile(){
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}

	$('#grid_container').css('width', gridContainerWidth-2*cellSpace);
	$('#grid_container').css('height', gridContainerWidth-2*cellSpace);
	$('#grid_container').css('padding', cellSpace);
	$('#grid_container').css('border-radius', 0.02*gridContainerWidth);

	$('.grid_cell').css('width', cellSideLength);
	$('.grid_cell').css('height', cellSideLength);
	$('.grid_cell').css('border-radius', 0.02*cellSideLength);
}

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
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	updateBoardView();

	score = 0;
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
				theNumberCell.css('top', getPosTop(i,j) + cellSideLength/2);
				theNumberCell.css('left', getPosLeft(i,j) + cellSideLength/2);
			}else{
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top', getPosTop(i,j));
				theNumberCell.css('left', getPosLeft(i,j));
				theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

			hasConflicted[i][j] = false;
		}
	}

	$('.number_cell').css('line-height', cellSideLength+'px');
	$('.number_cell').css('font-size', 0.4*cellSideLength+'px');
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

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37:  // left
			event.preventDefault();
			if( moveLeft()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 38:  // up
			event.preventDefault();
			if( moveUp()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 39:  // right
			event.preventDefault();
			if( moveRight()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 40:  // down
			event.preventDefault();
			if( moveDown()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		default:break;  //  other key
	}
})

document.addEventListener('touchstart', function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchmove', function(event){
	event.preventDefault();
})

document.addEventListener('touchend', function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;

	if( Math.abs(deltax)<0.3*documentWidth && Math.abs(deltay)<0.3*documentWidth){
		return;
	}

	//  Determine it's moving updown or leftright
	if( Math.abs(deltax) >= Math.abs(deltay) ){  // leftright
		if(deltax > 0){  // right
			if( moveRight()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}else{  // left
			if( moveLeft()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
	}else{  // updown
		if(deltay > 0){  // down
			if( moveDown()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}else{  // up
			if( moveUp()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
	}
});

function isgameover(){
	if(nospace(board) && nomove(board)){
		gameover();
	}
}

function gameover(){
	alert('Game over!');
}

function moveLeft(){
	if(!canMoveLeft(board)){
		return false
	}else{
		for (var i = 0; i < 4; i++) {
			for(var j = 1; j < 4; j++) {
				if(board[i][j] != 0){
					for(var k = 0; k < j; k++){
						if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
							// You can move left
							showMoveAnimation(i, j, i, k);

							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
							//  You can move left and add two cell together
							showMoveAnimation(i, j, i, k);

							board[i][k] += board[i][j];
							board[i][j] = 0;

							// Add Score
							score += board[i][k];
							updateScore(score);

							hasConflicted[i][k] = true;
							continue;
						}
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()", 200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board)){
		return false
	}else{
		for (var i = 0; i < 4; i++) {
			for(var j = 2; j >= 0; j--){
				if(board[i][j] != 0){
					for(var k = 3; k > j; k--){
						if(board[i][k] == 0 && noBlockHorizontal(i, j, k, board)){
							// You can move left
							showMoveAnimation(i, j, i, k);

							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]){
							//  You can move left and add two cell together
							showMoveAnimation(i, j, i, k);

							board[i][k] += board[i][j];
							board[i][j] = 0;

							// Add Score
							score += board[i][k];
							updateScore(score);

							hasConflicted[i][k] = true;
							continue;
						}
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()", 200);
	return true;
}

function moveUp(){
	if(!canMoveUp(board)){
		return false
	}else{
		for(var j = 0; j < 4; j++) {
			for (var i = 1; i < 4; i++) {
				if(board[i][j] != 0){
					for(var k = 0; k < i; k++){
						if(board[k][j] == 0 && noBlockVertical(k, i, j, board)){
							// You can move left
							showMoveAnimation(i, j, k, j);

							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[k][j] == board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j]){
							//  You can move left and add two cell together
							showMoveAnimation(i, j, k, j);

							board[k][j] += board[i][j];
							board[i][j] = 0;

							// Add Score
							score += board[k][j];
							updateScore(score);

							hasConflicted[k][j] = true;
							continue;
						}
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()", 200);
	return true;
}

function moveDown(){
	if(!canMoveDown(board)){
		return false
	}else{
		for(var j = 0; j < 4; j++) {
			for (var i = 2; i >= 0; i--) {
				if(board[i][j] != 0){
					for(var k = 3; k > i; k--){
						if(board[k][j] == 0 && noBlockVertical(i, k, j, board)){
							// You can move left
							showMoveAnimation(i, j, k, j);

							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[k][j] == board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j]){
							//  You can move left and add two cell together
							showMoveAnimation(i, j, k, j);

							board[k][j] += board[i][j];
							board[i][j] = 0;

							// Add Score
							score += board[k][j];
							updateScore(score);

							hasConflicted[k][j] = true;
							continue;
						}
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()", 200);
	return true;
}
>>>>>>> origin/master
