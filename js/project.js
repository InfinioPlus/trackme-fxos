$(document).ready(function(){
    
	var mapOptions = {
		center: new google.maps.LatLng(13.685449, -89.239938),
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
    
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	
	
    
    var continue_sending = true;
    var first_response = true;
    var watch_id;
    var lat;
    var lng;
    
    $('#start-btn').click(function(){
        startConn();
        trackPosition();
    });
    
    $('#stop-btn').click(function(){
    });
    
    
    function startConn(){
        $.get("start_conn.php", function(data, status){
            // as output data I need:
            // 1. a GUID sent by the server
            // 2. as output by the PHP script,  
        });
    }
    
    function trackPosition(){
        var options = {
            timeout: 60000
        };
        
        watch_id = navigator.geolocation.watchPosition(onPositionChange, onPositionError, options);
    }
    
    function onPositionChange(pos){
        var coords = pos.coords;
        lat = coords.latitude;
        lng = coords.longitude;
    }
    
    function onPositionError(err){
        console.log("Error on watcher: " + err.message);
    }
});
