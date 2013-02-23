function run(){
	var myOptions = {
          center: new google.maps.LatLng(44.0603 , -69.3583),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
         };
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	load_hard_data();
	
	var marker = new google.maps.Marker({
      position: station_list[0].position,
      map: map,
      title:station_list[0].name,
    });
}

//Station Class
function station(name, id, lat, lon)
{
	this.name = name;
	this.id = id;
	this.position = new google.maps.LatLng(lat, lon, false);
}

function load_hard_data()
{
	Alewife = new station("Alewife", "place-alfcl", 42.395428, -71.142483);
	station_list = [Alewife];
}