//Write game as a class with default parameters,
//Initialization method sets parameters, spritesheet etc
//newgame init method resets game
//new game
//game.run

function start_game()
{
	var frogger = new Frogger_game;
	frogger.start_game_loop();
}

function Frogger_game(){
	//Default values for a new game, to be used when starting a new game
	var frogx = 0;
	var frogy = 0;
	var lives = 3;
	var gameover = false;
	var level_number = 1;
	var time = 0;
	var vehicle_spawn_locations = [[0,0],[0,0],[0,0],[0,0],[0,0]];
	var log_spawn_locations = [[0,0],[0,0],[0,0],[0,0],[0,0]];
	var vehicle_speed = 0;
	var log_speed = 0;
	var score = 0;
	
	//Resources
	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');
	var spritesheet = new Image();
	spritesheet.src = "assets/frogger_sprites.png";
	
	//Game Methods:
	//This function handles the game loop ///
	this.start_game_loop = function()
	{
		var gameon = true;
		
		while(gameon)
		{
			drawScreen();
			gameon = false //for now
		}
	}
	
	//This is responsible for screen rendering ////
	var drawScreen = function()
	{	
		//Draw water
		ctx.fillStyle = "#191970";
		ctx.fillRect(0, 0, 399, 282);
			
		//Draw road
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 282, 399, 282);
		
		//Draw Title
		ctx.drawImage(spritesheet, 0, 0, 364, 54, 0, 0, 364, 54)
		
		//Draw Grass
		ctx.drawImage(spritesheet, 0, 54, 399, 54, 0, 54, 399, 54)
		
		//Draw Road Edges
		ctx.drawImage(spritesheet, 0, 117, 399, 36, 0, 280, 399, 36)
		ctx.drawImage(spritesheet, 0, 117, 399, 36, 0, 488, 399, 36)
		
		//Draw Lives
		for (i = 1; i < lives; i++)
		{
			ctx.drawImage(spritesheet, 12, 330, 22, 26, 20*(i-1), 520, 22, 26)
		}
		
		//Draw Footer Info:
		ctx.fillStyle = "#00CA34";
		ctx.font = "16px Times New Roman";
		ctx.fillText("Score: " + score, 1, 560);
		ctx.fillText("Highscore: 0", 100, 560);
		ctx.font = "20px Times New Roman";
		ctx.fillText("Level: " + level_number, 60, 542);
		
	}
	
	//Initializes game parameters
	var initializeParameters = function()
	{
		var frogx = 0;
		var frogy = 0;
		var lives = 3;
		var gameover = false;
		var level_number = 1;
		var time = 0;
		var vehicle_spawn_locations = [[0,0],[0,0],[0,0],[0,0],[0,0]];
		var log_spawn_locations = [[0,0],[0,0],[0,0],[0,0],[0,0]];
		var vehicle_speed = 0;
		var log_speed = 0;
		return frogx, frogy
	}
	/////////////////////////////////////////////////
}

//frog class

//log class

//car class
