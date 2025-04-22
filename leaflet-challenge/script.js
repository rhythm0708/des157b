(function(){
    'use strict';

    // add your script here

    // Set location of map.
    var map = L.map('map').setView([22.292615, 114.197802], 15);
    
    // Tile layer.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Shapes.
    var marker = L.marker([22.291483, 114.194567]).addTo(map);
    var circle = L.circle([22.288228, 114.192408], {
        color: 'blue',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100
    }).addTo(map);
    var polygon = L.polygon([
        [22.291173, 114.201985], 
        [22.293023, 114.201137], 
        [22.292559, 114.207109],  
        [22.291504, 114.203824]  
    ]).addTo(map);

    // Working with popups.
    marker.bindPopup("I used to pass by <b>this school</b> on my way to the bus.").openPopup();
    circle.bindPopup("There's a pretty competetive Pokémon Go gym here.");
    polygon.bindPopup("I remember this area quite fondly");

    var popup = L.popup()
    .setLatLng([22.290398, 114.200761])
    .setContent("Welcome to North Point!")
    .openOn(map);

    // Event handling.
    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("The coordinates of the map here are " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);
}());