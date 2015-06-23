$(document).ready(function(){

    var openStreetMap = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    var map = new ol.Map({
        layers: [
            openStreetMap
        ],
        target: 'map_canvas',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: new ol.View({
            maxZoom: 18,
            center: [-244780.24508882355, 5986452.183179816],
            zoom: 15
        })
    });
});