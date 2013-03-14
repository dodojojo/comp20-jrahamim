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
	var lives = 3;
	var gameover = false;
	var level_number = 1;
	var time = 0;
	var vehicle_speed = 0;
	var log_speed = 0;
	var score = 0;
	var highscore = 0;
	
	//FPS variables
	var lastLoop = new Date;
	var fps = 30;
	
	//Objects
	var player = new Player();
	var object_list = new Array(); //stored in an array to ease rendering handling
	
	/////////////////////////////Game Methods///////////////////////////////////////

	//start_game_loop is a function that manages the game loop and controls the
	//grand scheme of events every frame.
	this.start_game_loop = function()
	{
		var gameon = true;
		add_event_listeners();
		initializeParameters();
		
		if(gameon)
		{	
			setInterval(game_loop, 33);
		}
	}
	
	//The function game loop
	var game_loop = function()
	{
		calculate_fps();
		onEvent();
		onLoop();
		drawScreen();
	}
	
	var calculate_fps = function()
	{
		var thisLoop = new Date;
	    fps = 1000 / (thisLoop - lastLoop);
   		lastLoop = thisLoop;
	}
	
	//Handles inputs, collisions etc
	var onEvent = function()
	{
	
	}
	
	//Updates objects e.g. change position, react to event etc
	var onLoop = function()
	{
		//Objects
		player.onLoop();
	}
	
	//Creates event listeners that will monitor for user keyboard input
	var add_event_listeners = function()
	{
		//Keydowns
		document.addEventListener('keydown', function(event) {
   		 if(event.keyCode == 37) {
        	player.move_horiz = -1;
  		 }
  		  else if(event.keyCode == 39) {
     	   player.move_horiz = 1;
  		 }
  		 else if(event.keyCode == 38) {
     	   player.move_vert = 1;
  		 }
  		 else if(event.keyCode == 40) {
     	   player.move_vert = -1;
  		 }
		});
	}
	
	//draw screen is the reusable function that renders all graphics to the screen
	//including all scenery and any objects.
	var drawScreen = function()
	{	
		//Draw Water
		ctx.fillStyle = "#191970";
		ctx.fillRect(0, 0, 399, 286);
			
		//Draw Road
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 286, 399, 282);
		
		//Draw Title
		ctx.drawImage(spritesheet, 0, 0, 364, 54, 0, 0, 364, 54);
		
		//Draw Grass
		ctx.drawImage(spritesheet, 0, 54, 399, 54, 0, 54, 399, 54);
		
		//Draw Road Edges
		ctx.drawImage(spritesheet, 0, 117, 399, 36, 0, 284, 399, 36);
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
		lives = 3;
		gameover = false;
		level_number = 1;
		time = 0;
		vehicle_speed = 0;
		log_speed = 0;
	}
	/////////////////////////////////////////////////


///////////////////////////Game Objects///////////////////////////////////////////

//Player class
	function Player()
	{
		this.x;
		this.y;
		this.move_vert = 0; //0 be still, 1 move up, -1 move down
		this.move_horiz = 0; //0 be still, 1 move right, -1 move left
		
		var step_size = 34;
		var facing_direction = 0; //0 up, 1 down, 2 left, 3 right
		
		this.onLoop = function(){
			//Move the player
			if(this.move_vert != 0)
			{
				if(this.move_vert==1){
					this.y -= step_size;
					facing_direction = 0;
				} else if(this.move_vert== -1){
					this.y += step_size;
					facing_direction = 1;
				}
				this.move_vert = 0;
			}
			else if(this.move_horiz != 0)
			{
				if(this.move_horiz==1){
					this.x += step_size;
					facing_direction = 3;
				} else if(this.move_horiz== -1){
					this.x -= step_size;
					facing_direction = 2;
				}
				this.move_horiz = 0;
			}
		}
		
		this.draw = function(x, y){
			if(facing_direction == 0){
				ctx.drawImage(spritesheet, 12, 366, 22, 26, this.x, this.y, 22, 26);
			} else if(facing_direction ==1){
				ctx.drawImage(spritesheet, 80, 366, 22, 26, this.x, this.y, 22, 26);
			} else if(facing_direction ==2){
				ctx.drawImage(spritesheet, 80, 332, 22, 26, this.x, this.y, 22, 26);
			} else if(facing_direction ==3){
				ctx.drawImage(spritesheet, 12, 332, 22, 26, this.x, this.y, 22, 26);
			}
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
}