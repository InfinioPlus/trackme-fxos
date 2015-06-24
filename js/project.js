$(document).ready(function(){
    var map = null;
    
    var mapOptions = {
        center: new google.maps.LatLng(13.685449, -89.239938),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
});