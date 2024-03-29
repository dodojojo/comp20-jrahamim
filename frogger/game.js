function start_game()
{
	//Initialize global resources, i.e the canvas
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');
	dead_frog_sprite = new Image();
	dead_frog_sprite.src = "assets/dead_frog.png";
	spritesheet = new Image(); //Load the sprite-sheet for use in the js file
	spritesheet.src = "assets/frogger_sprites.png";
	
	if(localStorage["highscore"] == undefined){ //Check if this is the first time
		localStorage["highscore"] = "0";
	}
	
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
	var score = 0;
	var extra_life_tracker = 0;
	var highscore = localStorage["highscore"];
	var min_player_y = 495; //Used for progression scoring
	var mixer = new Mixer();
	var timer = new Timer(100);
	
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
		object_list.push(new Car(0, 35 + (125*i) , 461));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Car(1, 65 + (140*i) , 427));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Car(2, 50 + (133*i) , 393));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Car(3, 70 + (145*i) , 359));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Car(4, 30 + (150*i) , 325));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Log(0, 35 + (133*i) , 257));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Log(1, 60 + (200*i) , 223));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Log(2, 50 + (170*i) , 189));
	}
	for(var i=0; i<2; i++){
		object_list.push(new Log(3, 70 + (266*i) , 153));
	}
	for(var i=0; i<3; i++){
		object_list.push(new Log(4, 60 + (160*i) , 121));
	}
	
	object_list.push(new Fly());
	
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
		onLoop();
		drawScreen();
	}
	
	var calculate_fps = function()
	{
		var thisLoop = new Date;
	    fps = 1000 / (thisLoop - lastLoop);
   		lastLoop = thisLoop;
	}
	
	//Updates objects e.g. change position, react to event etc
	var onLoop = function()
	{
		time = timer.getTime();
		for (i = 0; i < object_list.length; i++)
		{
			object_list[i].onLoop();
		}
		player.onLoop();
		
		if(player.y < min_player_y){
			min_player_y = player.y;
			increase_score(10); 
		}
		
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
		ctx.fillText("Highscore: " + highscore, 100, 560);
		ctx.fillText("Time: " + time, 320, 560);
		ctx.font = "20px Times New Roman";
		ctx.fillText("Level: " + level_number, 320, 542);
		
		//Draw Objects:
		for (i = 0; i < object_list.length; i++)
		{
			object_list[i].draw();
		}
		player.draw();
		
	}
	
	//initializeParameters is the reusable function to reset many game variables to
	//particular values when starting a new game after 5 frogs reach the other side.
	var initialize_new_round = function()
	{
		player.reset();
		for (i = 0; i < object_list.length; i++)
		{
			object_list[i].reset();
		}
		
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
			increase_score(1000);
			level_number++;
			initialize_new_round();
		}
	}
	
	var gameover = function()
	{
		mixer.play("gameover");
		level_number = 1;
		score = 0;
		lives = 5;
		initialize_new_round();
	}
	
	//Deal with score event more easily
	var increase_score = function(addition)
	{
		score += addition;
		extra_life_tracker += addition;
		if(score > highscore)
		{
			highscore = score;
			localStorage["highscore"] = score;
		}
		if(extra_life_tracker > 10000)
		{
			extra_life_tracker = 0;
			if(lives < 5)
			{
				lives++;
			}
		}
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
		var dead = false;
		
		this.onLoop = function(){
			//Move the player
			if(this.move_vert != 0 && !dead)
			{
				if(this.move_vert==1){
					this.y -= step_size;
					facing_direction = 0;
				} else if(this.move_vert== -1){
					this.y += step_size;
					facing_direction = 1;
				}
				mixer.play("jump");
				this.move_vert = 0;
			}
			else if(this.move_horiz != 0 && !dead)
			{
				if(this.move_horiz==1){
					this.x += step_size;
					facing_direction = 3;
				} else if(this.move_horiz== -1){
					this.x -= step_size;
					facing_direction = 2;
				}
				mixer.play("jump");
				this.move_horiz = 0;
			}
			
			//Check for collisions
			onLog = false;
			inWater = false;
			if(!dead)
			{
				check_collisions();
				if(inWater && !onLog){
					die();
				}
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
		
			//The last one is the fly and is a special case because the victory boxes
			//are checked first and will move the player
			var fly = object_list[object_list.length - 1];
 			if(is_colliding(player.x, player.y, width, height,
				   			fly.x, fly.y, fly.getWidth(), fly.getHeight())){
						increase_score(200);
						mixer.play("getitem");
						fly.reset();
			} 		
		
			for (i = 0; i < object_list.length; i++)
			{
				if(is_colliding(player.x, player.y, width, height,
				   object_list[i].x, object_list[i].y, object_list[i].getWidth(), object_list[i].getHeight() ))
				{
					
					if(object_list[i].type == "Car"){
						mixer.play("carhit");
						die();
					} else if(object_list[i].type == "Log"){
						onLog = true;
						player.x += object_list[i].speed*((2*(object_list[i].getRow()%2) - 1) )/ (fps/30);//Move with log
					} else if(object_list[i].type == "Victory_Box"){
						if(object_list[i].occupied){
							die();
						} else if(!(object_list[i].occupied)){
							mixer.play("safe");
							object_list[i].become_occupied();
							onLog = true;
							player.reset();
						}
					}
				}
			}
		}
		
		this.draw = function(x, y){
			if(dead){
				ctx.drawImage(dead_frog_sprite, 0, 0, 30, 30, this.x, this.y, 30, 30);
			} else if(facing_direction == 0){
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
			dead = true;
			mixer.play("death");
			
			var death_timer = setInterval( function(){
				player.reset();
				dead = false;
				lives--;
				if(lives <= 0){
					gameover();
				}
				clearInterval(death_timer);
			}, 1000);
			
		}
		
		this.reset = function()
		{
			this.x = Defaultx;
			this.y = Defaulty;
			min_player_y = 495;
			timer.start_timer();
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
		this.speed = 0.5 + (level_number/2);
		
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
		this.speed = 0.5 + (level_number/2);
		
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
			increase_score(50); //for the victory
			increase_score(10 * timer.getTime()); //for the time remaining
		}
		
		this.reset = function()
		{
			this.x = Defaultx;
			this.y = Defaulty;
			this.occupied = false;
		}
	}
	
	function Fly()
	{

		this.x = 15;
		this.y = 76;
		this.type = "Fly";
		var width = 30;
		var height = 30;
		var spritesheet_x = 134;
		var spritesheet_y = 231;
		var fly_timer = new Timer(10);
		
		this.getWidth = function(){
			return width;
		}
		this.getHeight = function(){
			return height;
		}
		
		this.onLoop = function(){
			if(fly_timer.getTime() == 0)
			{
				this.juggle_position();
			}
		}
		
		this.draw = function(){
			ctx.drawImage(spritesheet, spritesheet_x, spritesheet_y, width, height,
								 					this.x, this.y, width, height);
		}
		
		this.reset = function(){
			this.juggle_position();
			fly_timer.start_timer();
		}
		
		this.juggle_position = function()
		{
			var pos=Math.floor(Math.random()*10)
			if(pos > 5){
				//do nothing, fly wont render this time
			} else{
				if(!object_list[pos].occupied){ //check its free
					this.x = 15 + (pos*85);
				} else {
					//try again
				}
			}
			fly_timer.start_timer();
		}
	}
}

//Used to control audio resources
/*Available Sounds:
	jump
	safe
	getitem
	death
	carhit
	gameover
*/
function Mixer()
{
	this.play = function(sound_type)
	{
		sound = document.getElementById(sound_type);
		sound.play();
	}	
}

//Timer class
function Timer(t)
{
	var start_time = t;
	var timer; //To hold the interval function
	var time = start_time;
	this.start_timer = function()
	{
		clearInterval(timer);
		time = start_time;
		timer = setInterval( function(){
			if(time > 0){time--;}
		}, 1000);
	}
	
	this.getTime = function(){
		return time;
	}
}
