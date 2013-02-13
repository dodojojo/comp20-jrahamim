function draw_pacman()
{
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var spritesheet = new Image(); //Load the sprite-sheet for use in the js file
	spritesheet.src = "pacman10-hp-sprite.png";
	ctx.drawImage(spritesheet, 320, 0, 464, 138, 0, 0, 464, 138); //Game board
	ctx.drawImage(spritesheet, 80, 0, 20, 20, 117, 3, 20, 20);		//Ms pacman
	ctx.drawImage(spritesheet, 0, 80, 20, 20, 117, 50, 20, 20);		//Ghost
}