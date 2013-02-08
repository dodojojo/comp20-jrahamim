function start_game()
{
	gameLoop(initializeParameters());
}

//Initializes game parameters
function initializeParameters()
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

//This function handles the game loop
function gameLoop(frogx, frogy, lives, gameover, level_number, time, vehicle_spawn_locations,
					log_spawn_locations, vehicle_speed, log_speed)
{
	console.log(frogx);
	var gameon = true;
	
	while(gameon)
	{
		drawScreen();
		gameon = false //for now
	}
	
}

//In game methods:
function drawScreen()
{
	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');
	
	//Draw water
	ctx.fillStyle = "#191970";
	ctx.fillRect(0, 0, 399, 282);
	
	//Draw road
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 282, 399, 282);
}