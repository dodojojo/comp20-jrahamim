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
	var lives = 5;
	var level_number = 1;
	var time = 0;
	var vehicle_speed = 0;
	var log_speed = 0;
	var score = 0;
	var highscore = 0;
	
	//FPS variables
	var lastLoop = new Date;
	var fps = 30;
	var target_fps = 30;
	
	//Objects
	var player = new Player(190, 495);
	var object_list = new Array(); //stored in an array to ease rendering handling
	
	//Victory boxes first so we know they're the first 5 boxes
	for(var i = 0; i < 5; i++)
	{
		object_list.push(new Victory_Box(12 + (i * 85),72));
	}
	
	for(var i=0; i<3; i++){
		object_list.push(new Car(0, 50 + (133*i) , 461));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Car(1, 50 + (133*i) , 427));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Car(2, 50 + (133*i) , 393));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Car(3, 50 + (133*i) , 359));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Car(4, 50 + (133*i) , 325));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Log(0, 50 + (133*i) , 257));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Log(1, 50 + (133*i) , 223));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Log(2, 50 + (133*i) , 189));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Log(3, 50 + (133*i) , 155));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Log(4, 50 + (133*i) , 121));
	}
	
	/////////////////////////////Game Methods///////////////////////////////////////

	//start_game_loop is a function that manages the game loop and controls the
	//grand scheme of events every frame.
	this.start_game_loop = function()
	{
		var gameon = true;
		add_event_listeners();
		initialize_new_round();
		
		if(gameon)
		{	
			setInterval(game_loop, 1000/target_fps);
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
		for (i = 0; i < object_list.length; i++)
		{
			object_list[i].onLoop();
		}
		player.onLoop();
		check_for_level_win();
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
		ctx.fillText("Level: " + level_number, 360, 542);
		
		//Draw Objects:
		for (i = 0; i < object_list.length; i++)
		{
			object_list[i].draw();
		}
		player.draw();
		
	}
	
	//initializeParameters is the reusable function to reset many game variables to
	//particular values when starting a new game.
	var initialize_new_round = function()
	{
		player.reset();
		
		for (i = 0; i < object_list.length; i++)
		{
			object_list[i].reset();
		}
		
		time = 0;
	}
	
	var is_colliding = function(x1, y1, width1, height1, x2, y2, width2, height2)
	{
		var left1 = x1;
		var left2 = x2;
		var right1 = x1 + width1;
		var right2 = x2 + width2;
		
		var top1 = y1;
		var top2 = y2;
		var bottom1 = y1 + height1;
		var bottom2 = y2 + height2;
		
		if(bottom1 < top2){
			return false;
		} else if(bottom2 < top1) {
			return false;
		} else if(right1 < left2) {
			return false;
		} else if(right2 < left1) {
			return false;
		} else {
			return true;
		}
	}
	
	var check_for_level_win = function()
	{
		//Check for win
		var victory = true;
		for(var i = 0; i < 5; i++)
		{
			if(object_list[i].occupied == false){
				victory = false;
			}
		}
		
		//If there's a win, end round
		if(victory)
		{
			initialize_new_round();
		}
	}
	
	var gameover = function()
	{
		level = 1;
		score = 0;
		lives = 5;
		initialize_new_round();
	}
	/////////////////////////////////////////////////


///////////////////////////Game Objects///////////////////////////////////////////

//Player class
	function Player(X, Y)
	{
		var Defaultx = X;
		var Defaulty = Y;
		this.x = Defaultx;
		this.y = Defaulty;
		this.move_vert = 0; //0 be still, 1 move up, -1 move down
		this.move_horiz = 0; //0 be still, 1 move right, -1 move left
		
		var width = 22;
		var height = 26;
		var step_size = 34;
		var facing_direction = 0; //0 up, 1 down, 2 left, 3 right
		var onLog = false;
		var inWater = false;
		
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
			
			//Check for collisions
			onLog = false;
			inWater = false;
			check_collisions();
			if(inWater && !onLog){
				die();
			}
		}
		
		var check_collisions = function()
		{
			//Check we're in bounds
			if(player.x < 0 || player.x > (399 - width)
			                || player.y < 0 || player.y > (565 - height)){
				die();
			}
		
			//Check if we're in water
			if(player.y < 286){
				inWater = true;
			}
		
			for (i = 0; i < object_list.length; i++)
			{
				if(is_colliding(player.x, player.y, width, height,
				   object_list[i].x, object_list[i].y, object_list[i].getWidth(), object_list[i].getHeight() ))
				{
					
					if(object_list[i].type == "Car"){
						die();
					} else if(object_list[i].type == "Log"){
						onLog = true;
						player.x += (2*(object_list[i].getRow()%2) - object_list[i].speed )/ (fps/30);//Move with log
					} else if(object_list[i].type == "Victory_Box"){
						if(object_list[i].occupied){
							die();
						} else if(!(object_list[i].occupied)){
							object_list[i].become_occupied();
							onLog = true;
							player.reset();
						}
					}
					//if victory, initiate victory spot functions
				}
			}
		}
		
		this.draw = function(x, y){
			if(facing_direction == 0){
				ctx.drawImage(spritesheet, 12, 366, width, height, this.x, this.y, width, height);
			} else if(facing_direction ==1){
				ctx.drawImage(spritesheet, 80, 366, width, height, this.x, this.y, width, height);
			} else if(facing_direction ==2){
				ctx.drawImage(spritesheet, 80, 332, width, height, this.x, this.y, width, height);
			} else if(facing_direction ==3){
				ctx.drawImage(spritesheet, 12, 332, width, height, this.x, this.y, width, height);
			}
		}
		
		var die = function()
		{
			player.reset();
			lives--;
			if(lives <= 0){
				gameover();
			}
		}
		
		this.reset = function()
		{
			this.x = Defaultx;
			this.y = Defaulty;
		}
	}

//Log class
	function Log(row, X, Y)
	{
		var Defaultx = X;
		var Defaulty = Y;
		this.x = Defaultx;
		this.y = Defaulty;
		this.type = "Log";
		this.speed = 1;
		
		var row_number = row // 0 to 4, 0 being the furthest down
		var spritesheet_x = 8;
		var spritesheet_y = 165;
		var box_width = 182;
		var box_height = 24;
		
		if(row_number == 0){
			spritesheet_y = 196;
			box_width = 122;
		} else if(row_number == 1){
			spritesheet_y = 228;
			box_width = 89;
		} else if(row_number == 2){
			spritesheet_y = 196;
			box_width = 122;
		} else if(row_number == 3){
			spritesheet_y = 165;
			box_width = 182;
		} else if(row_number == 4){
			spritesheet_y = 228;
			box_width = 89;
		}
		
		this.getWidth = function(){
			return box_width;
		}
		this.getHeight = function(){
			return box_height;
		}
		this.getRow = function(){
			return row_number;
		}
		
		this.onLoop = function()
		{
			//Check if left or right moving
			//Then 1) Move
			//     2) Check we havent left the screen, if so wrap to the other side
			if(row_number % 2 == 0)
			{
				this.x -= (this.speed / (fps/30)); //normalize to account for fps
				if(this.x < -125){this.x = 400}
			}
			else
			{
				this.x += (this.speed / (fps/30)); 
				if(this.x > 400){this.x = -183}
			}		
		}
		
		this.draw = function(x, y){
			ctx.drawImage(spritesheet, spritesheet_x, spritesheet_y, box_width, box_height,
								 					this.x, this.y, box_width, box_height);
		}
		
		this.reset = function()
		{
			this.x = Defaultx;
			this.y = Defaulty;
		}
	}

//Car class
	function Car(lane, X, Y)
	{
		var Defaultx = X;
		var Defaulty = Y;
		this.x = Defaultx;
		this.y = Defaulty;
		this.type = "Car";
		this.speed = 1;
		
		var lane_number = lane // 0 to 4, 0 being the furthest down
		var spritesheet_x = 12;
		var spritesheet_y = 261;
		var box_width = 22;
		var box_height = 26;
		
		//pick correct sprite for the lane
		if(lane_number == 0){
			spritesheet_x = 76;
			spritesheet_y = 261;
			box_width = 28;
			box_height = 27;
		} else if(lane_number == 1){
			spritesheet_x = 12;
			spritesheet_y = 298;
		} else if(lane_number == 2){
			spritesheet_x = 12;
			spritesheet_y = 261;
		} else if(lane_number == 3){
			spritesheet_x = 46;
			spritesheet_y = 261;
			box_width = 28;
			box_height = 27;
		} else if(lane_number == 4){
			spritesheet_x = 105;
			spritesheet_y = 298;
			box_width = 48;
			box_height = 22;
		}

		this.getWidth = function(){
			return box_width;
		}
		this.getHeight = function(){
			return box_height;
		}
		
		this.onLoop = function()
		{
			//Check if left or right moving
			//Then 1) Move
			//     2) Check we havent left the screen, if so wrap to the other side
			if(lane_number % 2 == 0)
			{
				this.x -= (this.speed / (fps/30)); //normalize to account for fps
				if(this.x < -50){this.x = 399}
			}
			else
			{
				this.x += (this.speed / (fps/30)); 
				if(this.x > 400){this.x = -50}
			}
		}
		
		this.draw = function(x, y){
			ctx.drawImage(spritesheet, spritesheet_x, spritesheet_y, box_width, box_height,
								 					this.x, this.y, box_width, box_height);
		}
		
		this.reset = function()
		{
			this.x = Defaultx;
			this.y = Defaulty;
		}
	}
	
	function Victory_Box(X, Y)
	{
		var Defaultx = X;
		var Defaulty = Y;
		this.x = Defaultx;
		this.y = Defaulty;
		this.type = "Victory_Box";
		this.occupied = false;
		
		var width = 30;
		var height = 30;
		var spritesheet_x = 80;
		var spritesheet_y = 366;
		
		this.getWidth = function(){
			return width;
		}
		this.getHeight = function(){
			return height;
		}
		
		this.onLoop = function(){
		}
		
		this.draw = function(){
			if(this.occupied)
			{
				ctx.drawImage(spritesheet, spritesheet_x, spritesheet_y, width, height,
								 					this.x + 3, this.y + 3, width, height);
			}
		}
		
		this.become_occupied = function()
		{
			this.occupied = true;
			console.log("Yay");
		}
		
		this.reset = function()
		{
			this.x = Defaultx;
			this.y = Defaulty;
			this.occupied = false;
		}
	}
}