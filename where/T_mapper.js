/*Todo:
Make red line trace actual route		DONE
Geolocate, centre on map
Grab station info, place in windows
Grab Carmen & Waldo locations
Show closest distance between you and nearest station
*/
//Makes more sense to add info at creation? Create dom object, give it to content

function run(){
	var myOptions = {
          center: new google.maps.LatLng(44.0603 , -69.3583),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
         };
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	locate_user();

	var request = new XMLHttpRequest();
	request.open('GET', 'http://mbtamap-cedar.herokuapp.com/mapper/redline.json', true);
	request.send(null);	
	request.onreadystatechange = function() {
    	if (request.readyState === 4){
    		current_train_info = JSON.parse(request.responseText);
    		create_stations();
    		draw_trainline();
    		//user_location_and_analysis();
			//Carmen_Waldo_location_analysis();
    	}
	};
}

function locate_user(){
	if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) { 
   		 user_pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, false);
   		 user_marker = new google.maps.Marker({
   		 	position:user_pos,
   		 	map: map,
   		 	title:"User Location",
   		 });
 	    });
  }
  else {
    alert("Geolocation not supported!")
  } 
}

//Station Class
function station(name, north_key, south_key, lat, lon)
{
	this.name = name;
	this.north_key = north_key;
	this.south_key = south_key;
	this.position = new google.maps.LatLng(lat, lon, false);
	
	this.marker =   new google.maps.Marker({
	      position: this.position,
   		  map: map,
   		  title:this.name,
   		   });
   	this.marker.parent = this;
   	
   	this.infowindow = new google.maps.InfoWindow({
 		   	/*content: "<div class='stationName'>" + this.name + "</div>"
 		   	+ "<table id='infoTable'><tr><th>Trip Id</th><th>Direction</th><th>Time Remaining</th></tr> </table>",*/
    		});
    
    this.display_info = function(){
    	this.infowindow.open(map, this.marker);
    }
}

function create_stations()
{
	Alewife = new station("Alewife", "RALEN", "none", 42.395428, -71.142483);
	Davis = new station("Davis", "RDAVN", "RDAVS", 42.39674, -71.121815 );
	Porter = new station("Porter", "RPORN", "RPORS", 42.3884, -71.119149);
	Harvard = new station("Harvard", "RHARN", "RHARS", 42.373362, -71.118956);
	Central = new station("Central", "RCENN", "RCENS", 42.365486, -71.103802);
	Kendall = new station("Kendall", "RKENN", "RKENS", 42.36249079, -71.08617653);
	Charles_MGH = new station("Charles MGH", "RMGHN", "RMGHS", 42.361166, -71.070628);
	Park = new station("Park", "RPRKN", "RPRKS", 42.35639457, -71.0624242);
	Downtown_crossing = new station("Downtown Crossing", "RDTCN", "RDTCS", 42.355518, -71.060225);
	South_station = new station("South Station", "RSOUN", "RSOUN", 42.352271, -71.055242);
	Broadway = new station("Broadway", "RBRON", "RBROS", 42.342622, -71.056967);
	Andrew = new station("Andrew", "RANDN", "RANDS", 42.330154, -71.057655);
	JFK = new station("JFK", "RJFKN", "RJFKS", 42.320685, -71.052391);
	Savin_hill = new station("Savin Hill", "RSAVN", "RSAVS", 42.31129, -71.053331);
	Fields_corner = new station("Fields Corner", "RFIEN", "RFIES", 42.300093, -71.061667);
	Shawmut = new station("Shawmut", "RSHAN", "RSHAS", 42.29312583, -71.06573796);
	Ashmont = new station("Ashmont", "none", "RASHS", 42.284652, -71.064489);
	North_quincy = new station("North Quincy", "RNQUN", "RNQUS", 42.275275, -71.029583);
	Wollaston = new station("Wollaston", "RWOLN", "RWOLS", 42.2665139, -71.0203369);
	Quincy_center = new station("Quincy Center", "RQUCN", "RQUCS", 42.251809, -71.005409);
	Quincy_adams = new station("Quincy Adams", "RQUAN", "RQUAS", 42.233391, -71.007153);
	Braintree = new station("Braintree", "none", "RBRAS", 42.2078543, -71.0011385);
	
	station_list = [Alewife, Davis, Porter, Harvard, Central, Kendall, Charles_MGH, Park,
					 Downtown_crossing, South_station, Broadway, Andrew, JFK, Savin_hill,
					 Fields_corner, Shawmut, Ashmont, North_quincy, Wollaston, 
					 Quincy_center, Quincy_adams, Braintree];
	
	add_data_to_info_windows();
	create_marker_listeners();
}

function add_data_to_info_windows(){
	for(var i=0; i < station_list.length; i++){
	content = "<div class='stationName'>" + station_list[i].name + "</div>" +
	"<table id='infoTable'><tr><th>Trip Id</th><th>Direction</th><th>Time Remaining</th></tr>";
	
		for(var j=0; j < current_train_info.length; j++){
		   if(current_train_info[j].InformationType != "Arrived" ){
    			check_and_update_station_schedule(i, j);
    	    }
		}
	content += "</table>";
	station_list[i].infowindow.setContent(content);
	}
}

function check_and_update_station_schedule(station_pos, info_pos){
    if(station_list[station_pos].north_key == current_train_info[info_pos].PlatformKey ||
    	station_list[station_pos].south_key == current_train_info[info_pos].PlatformKey ){
    	
    	if(station_list[station_pos].north_key == current_train_info[info_pos].PlatformKey){
    		direction = "Northbound";
    		} else{
    		direction = "Southbound";}
    	
   		content += "<tr><td>" + 
   		current_train_info[info_pos].Trip + "</td><td>" +
   		direction + "</td><td>" +
   		current_train_info[info_pos].TimeRemaining + "</td></tr>";
    }
}

function create_marker_listeners()
{
	for(var i = 0; i < station_list.length; i++)
	{
			google.maps.event.addListener(station_list[i].marker, 'click', function(){
   		 	this.parent.display_info();
    		});
	}
	
}


function draw_trainline()
{
	//First line
	station_locations =[];
	for (var i = 0; i < 16; i++)
	{
		station_locations.push(station_list[i].position);
	}
	var trainline = new google.maps.Polyline({
		path: station_locations,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 4
		});
	trainline.setMap(map);
	
	//Branch
	station_locations =[station_list[12].position];//JFK
	for (var i = 17; i < station_list.length; i++)
	{
		station_locations.push(station_list[i].position);
	}
	var trainline = new google.maps.Polyline({
		path: station_locations,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 4
		});
	trainline.setMap(map);
}

//////

function fill_in_train_times(){
	//Set up connection
	var request = new XMLHttpRequest();
	request.open('GET', 'http://mbtamap-cedar.herokuapp.com/mapper/redline.json', true);
	//request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	request.send(null);
	
	request.onreadystatechange = function() {
    	if (request.readyState === 4){
    		current_train_info = JSON.parse(request.responseText);
    		for(var i=0; i < current_train_info.length; i++){
    		//check if already arrived
    		//for each iterate through train list (use while to break for middle or end)
    		//If n or s matches the current id then
    		//add text in order
    		if(current_train_info[i].InformationType != "Arrived" ){
    			check_and_update_station_schedule(i);	
    		  }
    		}
    	}
	};
	
	//analyze and store data
	//write to markers
}


