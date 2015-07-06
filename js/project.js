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
    var window_pool = [];
    var continue_sending = true;
    var start_mode = true;
    var watch_id;
    var client_id;
    var lat;
    var lng;
    
    $('#start-btn').click(function(){
        if (start_mode){
            var txt = $('#txt-channel').val();
            var usr = $('#txt-username').val();
            
            if (txt.length > 0 && usr.length > 0){
                continue_sending = true;
                startConn();
                trackPosition();
                $('#start-btn').removeClass('btn-success').addClass('btn-danger');
                $('#actual-glyph').removeClass('glyphicon-ok').addClass('glyphicon-remove');
                $('#start-btn-label').html('Stop');
                start_mode = false;
            } else{
                alert('Please type a room where to share your position and a user name');
            }
        } else{
            continue_sending = false;
            $('#start-btn').removeClass('btn-danger').addClass('btn-success');
            $('#actual-glyph').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            $('#start-btn-label').html('Start');
            start_mode = true;
        }
    });
    
    
    function startConn(){
        $.ajax({
            method: 'GET',
            dataType: 'jsonp',
            url: 'http://trackme.byethost5.com/start_conn.php',
            data: {
                lat: lat,
                lng: lng,
                user: $('#txt-username').val(),
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
                    
                    
                    window_pool[i].setContent('' + data[i].username);
                    
                    // Set info window position (in case is already opened)
                    window_pool[i].setPosition(new google.maps.LatLng(data[i].latitudes,data[i].longitudes));
                    
                    // removing click listeners
                    google.maps.event.clearListeners(marker_pool[i], 'click');
                    
                    // setting info window to marker (using closures)
                    (
                        function(){
                            var marker = marker_pool[i];
                            var info_window = window_pool[i];
                        
                            google.maps.event.addListener(marker, 'click', function(){
                                info_window.open(map,marker);
                            });
                        }
                    )();
                }
                
                // Hide markers / info windows that weren't used
                for (i=i; i<marker_pool.length; i++){
                    marker_pool[i].setMap(null);
                    window_pool[i].setMap(null);
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
            
            var info_window = new google.maps.InfoWindow({
                content: ''
            });
            
            marker_pool.push(marker);
            window_pool.push(info_window);
        }
    }
});
