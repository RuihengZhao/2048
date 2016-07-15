function showNumberWithAnimation(randx, randy, randNumber){
	var numberCell = $('#number_cell_'+randx+'_'+randy);

	numberCell.css('background-color', getNumberBackgroundColor(randNumber));
	numberCell.css('color', getNumberColor(randNumber));
	numberCell.text(randNumber);

	numberCell.animate({
		width:"100px",
		height:"100px",
		top:getPosTop(randx, randy),
		left:getPosLeft(randx, randy)
	}, 50);
}