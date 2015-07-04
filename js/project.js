$(document).ready(function(){
    
    var mapOptions = {
        center: new google.maps.LatLng(13.685449, -89.239938),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	
    getBasePosition();
    
    var my_marker;
    var marker_pool = [];
    var continue_sending = true;
    var watch_id;
    var client_id;
    var lat;
    var lng;
    
    $('#start-btn').click(function(){
        var txt = $('#txt-channel').val();
        
        if (txt.length > 0){
            continue_sending = true;
            startConn();
            trackPosition();
        } else{
            alert('Please type a room where to share your position');
        }
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
                channel: $('#txt-channel').val()
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
        
        my_marker.setPosition(new google.maps.LatLng(lat,lng));
    }
    
    function onPositionError(err){
        console.log("Error on watcher: " + err.message);
    }
    
    function updatePosition(){
        $.ajax({
            method: 'GET',
            url: 'http://trackme.byethost5.com/update_pos.php',
            dataType: 'jsonp',
            data: {
                guid: client_id,
                lat: lat,
                lng: lng
            },
            success: function(data, status){
                // check if more markers are needed
                var n = data.length - marker_pool.length;
                
                if (n>0){
                    addToPool(n);
                }
                
                // Displaying data
                var i;
                for (i=0; i<data.length; i++){
                    marker_pool[i].setPosition(new google.maps.LatLng(data[i].latitudes,data[i].longitudes));
                    marker_pool[i].setMap(map);
                }
                
                // Hide markers that weren't used
                for (i=i; i<marker_pool.length; i++){
                    marker_pool[i].setMap(null);
                }
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
    
    function addToPool(n){
        for (var i=0; i<n; i++){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(13.685449, -89.239938),
                map: map
            });
            
            marker_pool.push(marker);
        }
    }
});
