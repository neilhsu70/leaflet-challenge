//Import data from USGS website - All Eathquakes for past 30 Days
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 

d3.json(url, function(data) {
    createFeatures(data.features);
});

function createFeatures(data) {
    var mapboxAccessToken = 'pk.eyJ1IjoibmVpbGhzdSIsImEiOiJja2FoZXhhbzkwMDR3MnBvMTlqcmswOGJjIn0.JYl5QzolPekMgYDBB9JFfg';
    var plotMap = L.map("map").setView([39.0902405, -98.7128906],4);
    
    //Add a tile layer
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagnitudeery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-streets-v11',
        tileSize: 512,
        zoomOffset: -1,
    }).addTo(plotMap);
    
    //Add magnitude markers
    data.forEach(feature=> {
        var magnitude = feature.properties.mag;
        var lat = feature.geometry.coordinates[1];
        var lng = feature.geometry.coordinates[0];
        var info = feature.properties.title;

        //Assign marker color based on magnitude value (red to green)
        function getColor(mag) {
            return mag > 5 ? "#ff4a4a" :
                mag > 4 ? "#ff864a" :
                mag > 3 ? "#ffb74a" :
                mag > 2 ? "#ffed4a" :
                mag > 1 ? "#c6ff4a" :
                mag > 0 ? "#7aff4a" :
                "black";
        }

        //Create popups that provide additional information about the earthquake when a marker is clicked
        L.circle([lat, lng], {
                    color: getColor(magnitude),
                    fillColor: getColor(magnitude),
                    fillOpacity: 0.50,
                    radius: magnitude*10000     
                 }).bindPopup(info).addTo(plotMap);
        });
   
    //Create legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background-color:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    Legend.addTo(plotMap);

};