function run(){
	var myOptions = {
          center: new google.maps.LatLng(44.0603 , -69.3583),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
         };
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	load_hard_data();
	//create_markers();
	for(var i = 0; i < station_list.length; i++)
	{
			google.maps.event.addListener(station_list[i].marker, 'click', function(){
   		 	this.parent.display_info();
    		});
	}
	
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

function load_hard_data()
{
	Alewife = new station("Alewife", "RALEN", "none", 42.395428, -71.142483);
	Davis = new station("Davis", "RDAVN", "RDAVS", 42.39674, -71.121815 );
	Porter = new station("Porter", "RPORN", "RPORS", 42.3884, -71.119149);
	Harvard = new station("Harvard", "RHARN", "RHARS", 42.373362, -71.118956);
	Central = new station();
	Kendall = new station();
	Charles_MGH = new station();
	Park = new station();
	Downtown_crossing = new station();
	South_station = new station();
	Broadway = new station();
	Andrew = new station();
	JFK = new station();
	Savin_hill = new station();
	Fields_corner = new station();
	Shawmut = new station();
	Ashmont = new station();
	North_quincy = new station();
	Wollaston = new station();
	Quincy_center = new station();
	Quincy_adams = new station();
	Braintree = new station();
	
	station_list = [Alewife, Davis, Porter, Harvard, Central, Kendall, Charles_MGH, Park,
					 Downtown_crossing, South_station, Broadway, Andrew, JFK, Savin_hill,
					 Fields_corner, Shawmut, Ashmont, North_quincy, Wollaston, 
					 Quincy_center, Quincy_adams, Braintree];
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

