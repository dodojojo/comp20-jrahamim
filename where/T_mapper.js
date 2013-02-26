function run(){
	var myOptions = {
          center: new google.maps.LatLng(44.0603 , -69.3583),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
         };
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	create_stations();
	create_marker_listeners();
	draw_trainline();
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
 		   	content: this.name,
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
	station_locations =[];
	for (var i = 0; i < station_list.length; i++)
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

////////////////////////////////////
function create_markers()
{
	marker_list = [];
	for(var i =0;i < 3; i++)
	{
		var marker = new google.maps.Marker({
	      position: station_list[i].position,
   		  map: map,
   		  title:station_list[i].name,
   		   });
    
   		 var infowindow = new google.maps.InfoWindow({
 		   	content: station_list[i].name,
    		});
    
  		 google.maps.event.addListener(marker, 'click', function(){
   		 	infowindow.open(map, marker);
   		 	console.log(marker.title);
    		});
    		
    	 marker_list.push(marker);
    }
}

