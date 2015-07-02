$(document).ready(function(){
    
    var mapOptions = {
        center: new google.maps.LatLng(13.685449, -89.239938),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	
    getBasePosition();
    
    var my_marker;
    var continue_sending = true;
    var watch_id;
    var client_id;
    var lat;
    var lng;
    
    $('#start-btn').click(function(){
        continue_sending = true;
        startConn();
        trackPosition();
    });
    
    $('#stop-btn').click(function(){
        continue_sending = false;
    });
    
    
    function startConn(){
        $.ajax({
            method: 'GET',
            dataType: 'jsonp',
            url: 'http://trackme.byethost5.com/start_conn.php',
            data: {
                lat: lat,
                lng: lng,
                channel: $('#start-btn').val()
            },
            success: function(data, status){
                if (data.guid.length > 0 && data.connection_status == '1'){
                    client_id = data.guid;
                    setTimeout(updatePosition, 5000);
                } else{
                    alert('Something unexpected happened while connecting to the server, try again later');
                }
            }
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
        $.ajax({
            method: 'POST',
            url: 'update_pos.php',
            dataType: 'jsonp',
            data: {
                phone_id: client_id,
                latitude: lat,
                longitude: lng
            },
            success: function(data, status){
                // Here as an answer of the PHP script, I expect:
                // 1. A formatted output of all the lat/lng coordinates
                // of everyone on the same channel like me.
            }
        });
        
        if(continue_sending){
            setTimeout(updatePosition, 5000);
        }
    }
    
    function getBasePosition(){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    
    function showPosition(pos){
        var coords = pos.coords;
        lat = coords.latitude;
        lng = coords.longitude;
        
        map.setCenter(new google.maps.LatLng(lat,lng));
        
        my_marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            map: map
        });
    }
});
