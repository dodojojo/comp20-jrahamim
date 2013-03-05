function run(){
	//Load Map
	var myOptions = {
          center: new google.maps.LatLng(42.330497742 , -71.095794678),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
         };
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	//Load stations
	var request = new XMLHttpRequest();
	request.open('GET', 'http://mbtamap-cedar.herokuapp.com/mapper/redline.json', true);
	request.send(null);	
	request.onreadystatechange = function() {
    	if (request.readyState === 4){
    		current_train_info = JSON.parse(request.responseText);
    		create_stations();
    		draw_trainline();
    	}
	};
	
	//Load Carmen Waldo locations
	var CWrequest = new XMLHttpRequest();
	CWrequest.open('GET', 'http://messagehub.herokuapp.com/a3.json', true);
	CWrequest.send(null);	
	CWrequest.onreadystatechange = function() {
    	if (CWrequest.readyState === 4){
    		CW_locations = JSON.parse(CWrequest.responseText);
    		if(CW_locations.length > 0){
    			Carmen_Waldo_location_analysis();
    		}
    	}
	};
	
	//Geolocation
	locate_user();
}

function Carmen_Waldo_location_analysis(){
	CW_marker_list = [];
	for(var i=0; i < CW_locations.length; i++)
	{
	 Pos = new google.maps.LatLng(CW_locations[i].loc.latitude, CW_locations[i].loc.longitude);
	 var marker = new google.maps.Marker({
   		 	position:Pos,
   		 	map: map,
   		 	title: CW_locations[i].name,
   		 });
   	  marker.infowindow = new google.maps.InfoWindow({
   	  	content:"<div class='stationName'>" + CW_locations[i].name + "</div>",
   	  });
   	  if(CW_locations[i].name == "Waldo"){
   	  		marker.setIcon("assets/waldo.png");
   	  } else if(CW_locations[i].name == "Carmen Sandiego"){
   	  		marker.setIcon("assets/carmen.png");
   	  }
   	  
   	  CW_marker_list.push(marker);
	}
	for(var j=0; j < CW_marker_list.length; j++)
	{
	google.maps.event.addListener(CW_marker_list[j], 'click', function(){
   		 	this.infowindow.open(map, this);
    		}); 
	}
}

function locate_user(){
	if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) { 
   		 user_pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, false);
   		 map.panTo(user_pos);
   		 
   		 user_marker = new google.maps.Marker({
   		 	position:user_pos,
   		 	map: map,
   		 	title:"User Location",
   		 });
   		 user_marker.infowindow = new google.maps.InfoWindow({
   		 	content: "<div class='stationName'> User Location</div>"
   		 			+ "<div> Latitude: " + position.coords.latitude + " </div>"
   		 			+ "<div> Longitude: " + position.coords.longitude + " </div>",
   		 });
   		 user_marker.infowindow.open(map, user_marker);
   		 google.maps.event.addListener(user_marker, 'click', function(){
   		 	user_marker.infowindow.open(map, user_marker);
    		}); 
    	find_closest_station();
    	if(CW_locations.length > 0){get_carmen_waldo_distance();}
 	    });  
  }
  else {
    alert("Geolocation not supported!")
  } 
}

function find_closest_station(){
		 closest_station = station_list[0];
 	     closest_distance = get_haversine_distance(user_pos.lat(), user_pos.lng(),
 	    			station_list[0].position.lat(), station_list[0].position.lng()); 
 	     for(var i=1; i < station_list.length; i++)
 	     {
 	     	d = get_haversine_distance(user_pos.lat(),user_pos.lng(), 
 	    		station_list[i].position.lat(),station_list[i].position.lng());
 	    	if(d < closest_distance){
 	    		closest_distance = d;
 	    		closest_station = station_list[i];
 	    	}
 	     }
 	     
 	     closest_station.closest_infowindow = new google.maps.InfoWindow({
 		   	content: "<div > Your closest station is: " + closest_station.name + "</div>"
 		   	+ "<div> Distance: " + closest_distance + " miles</div>",
    		});
    	closest_station.closest_infowindow .open(map, closest_station.marker);
}

function get_carmen_waldo_distance(){
	for(var i=0; i < CW_marker_list.length; i++)
	{
	 distance = get_haversine_distance(user_pos.lat(),user_pos.lng(),
	 				CW_marker_list[i].position.lat(), CW_marker_list[i].position.lng());
	 CW_marker_list[i].infowindow.content += "<div> Distance: " + distance + " miles</div>";
	}
}

function toRadians(deg){
	return ((deg/360)*2*Math.PI);
}

function get_haversine_distance(lat1, lon1, lat2, lon2){
	var R = 3959; // miles
	var dLat = toRadians((lat2-lat1));
	var dLon = toRadians((lon2-lon1));

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    		Math.sin(dLon/2) * Math.sin(dLon/2)
    		 * Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)); 
	var c =  Math.asin(Math.sqrt(a)); 
	return 2 * R * c;
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
   		  icon:"assets/station_icon.png",
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


