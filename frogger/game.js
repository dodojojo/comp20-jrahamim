function start_game()
{
	//Initialize global resources, i.e the canvas
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');
	spritesheet = new Image(); //Load the sprite-sheet for use in the js file
	spritesheet.src = "assets/frogger_sprites.png";
	
	var frogger = new Frogger_game; //Create the game
	
	spritesheet.onload = function()
	{
		frogger.start_game_loop();	//Then start it once the image has loaded
	}
}

//Frogger_game Class. The game itself is implemented as a class to hold private
//variables and public/private methods.
function Frogger_game(){
	//Default game values
	var startx = 190; //Player starting x-pos
	var starty = 495; //Player starting y-pos
	var logstartx = 200;
	var logstarty = 200;
	var car1startx = 150;
	var car1starty = 350;
	var car2startx = 350;
	var car2starty = 450;
	var lives = 3;
	var gameover = false;
	var level_number = 1;
	var time = 0;
	var vehicle_speed = 0;
	var log_speed = 0;
	var score = 0;
	var highscore = 0;
	
	//Objects
	var player = new Player();
	var log = new Log();
	var car1 = new Car();
	var car2 = new Car();
	var object_list = new Array(log, car1, car2); //stored in an array to ease rendering handling
	
	/////////////////////////////Game Methods///////////////////////////////////////

	//start_game_loop is a function that manages the game loop and controls the
	//grand scheme of events every frame.
	this.start_game_loop = function()
	{
		var gameon = true;
		initializeParameters();
		
		while(gameon)
		{
			drawScreen();
			gameon = false //for now
		}
	}
	
	//draw screen is the reusable function that renders all graphics to the screen
	//including all scenery and any objects.
	var drawScreen = function()
	{	
		//Draw Water
		ctx.fillStyle = "#191970";
		ctx.fillRect(0, 0, 399, 282);
			
		//Draw Road
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 282, 399, 282);
		
		//Draw Title
		ctx.drawImage(spritesheet, 0, 0, 364, 54, 0, 0, 364, 54);
		
		//Draw Grass
		ctx.drawImage(spritesheet, 0, 54, 399, 54, 0, 54, 399, 54);
		
		//Draw Road Edges
		ctx.drawImage(spritesheet, 0, 117, 399, 36, 0, 280, 399, 36);
		ctx.drawImage(spritesheet, 0, 117, 399, 36, 0, 488, 399, 36);
		
		//Draw Lives
		for (i = 1; i < lives; i++)
		{
			ctx.drawImage(spritesheet, 12, 330, 22, 26, 20*(i-1), 520, 22, 26);
		}
		
		//Draw Footer Info:
		ctx.fillStyle = "#00CA34";
		ctx.font = "16px Times New Roman";
		ctx.fillText("Score: " + score, 1, 560);
		ctx.fillText("Highscore: 0", 100, 560);
		ctx.font = "20px Times New Roman";
		ctx.fillText("Level: " + level_number, 60, 542);
		
		//Draw Objects:
		player.draw();
		for (i = 0; i < object_list.length; i++)
		{
			object_list[i].draw();
		}
		
	}
	
	//initializeParameters is the reusable function to reset many game variables to
	//particular values when starting a new game.
	var initializeParameters = function()
	{
		player.x = startx;
		player.y = starty;
		log.x = logstartx;
		log.y = logstarty;
		car1.x = car1startx;
		car1.y = car1starty;
		car2.x = car2startx;
		car2.y = car2starty;
		lives = 3;
		gameover = false;
		level_number = 1;
		time = 0;
		vehicle_speed = 0;
		log_speed = 0;
	}
	/////////////////////////////////////////////////
}

///////////////////////////Objects///////////////////////////////////////////

//Player class
function Player()
{
	this.x;
	this.y;
	
	this.draw = function(x, y){
		ctx.drawImage(spritesheet, 12, 366, 22, 26, this.x, this.y, 22, 26);
	}
}

//Log class
function Log()
{
	this.x;
	this.y;
	
	this.draw = function(x, y){
		ctx.drawImage(spritesheet, 12, 165, 187, 24, this.x, this.y, 187, 24);
	}
}

//Car class
function Car()
{
	this.x;
	this.y;
	
	this.draw = function(x, y){
		ctx.drawImage(spritesheet, 12, 261, 22, 26, this.x, this.y, 22, 26);
	}
}