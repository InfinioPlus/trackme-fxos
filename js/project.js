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
    var client_id;
    var lat;
    var lng;
    
    $('#start-btn').click(function(){
        continue_sending = true;
        startConn();
        trackPosition();
        setTimeout(updatePosition, 5000);
    });
    
    $('#stop-btn').click(function(){
        continue_sending = false;
    });
    
    
    function startConn(){
        $.get("start_conn.php", function(data, status){
            //as output data I need:
            //1. a GUID sent by the server
            //2. as output by the PHP script, maybe a successful message code if
            //the connection to that channel was successfull
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
    
    function updatePosition(){
        $.post('update_pos.php',
            {
                phone_id: client_id,
                latitude: lat,
                longitude: lng
            },
            function(data, status){
                // Here as an answer of the PHP script, I expect:
                // 1. A formatted output of all the lat/lng coordinates
                // of everyone on the same channel like me.
            }
        );
        
        if(continue_sending){
            setTimeout(updatePosition, 5000);
        }
    }
});
