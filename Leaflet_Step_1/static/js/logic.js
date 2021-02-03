// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function markerSize(magnitude){
    if (magnitude === 0){
        return 1;
    }
    else {
        return magnitude *5;
    }
};

function markerColor(depth){
    if (depth > 90) {
        return '#FF0000';
    }
    else if (depth >= 70) {
        return '#FF6600';
    }
    else if (depth >= 50) {
        return '#FFCC00';
    }
    else if (depth >= 30) {
        return '#CCFF00';
    }
    else if (depth >= 10) {
        return '#66FF00';
    }
    else {
        return '#00FF00';
    }
};

function addMarker (feature, location){
    var options = {
        stroke: false,
        fillOpacity: 0.8,
        color: markerColor(feature.geometry.coordinates[2]),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        radius: markerSize(feature.properties.mag)
    }

    return L.circleMarker(location, options);
};


//         // Add tile layer    
//     var basemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         tileSize: 512,
//         maxZoom: 18,
//         zoomOffset: -1,
//         id: "mapbox/streets-v11",
//         accessToken: API_KEY
//     });

//     var baseMaps = {
//         "Street Map": basemap,
//         };
    
//         // Create overlay object to hold our overlay layer
//     var overlayMaps = {
//         "Earthquakes": earthquakes
//     };
    
//     // Create initial map object
//     var myMap = L.map("mapid", {
//         center: [
//         37.09, -95.71],
//         zoom: 5,
//         layers: [basemap, earthquakes]
//     });

//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: false
//       }).addTo(myMap);
    
//     });











//     var earthquakes = L.geoJSON(data.features);

//     var earthquake_markers = []



//     earthquakes.forEach(function(earthquake){
//         earthquake_markers.push(
//             L.circle(earthquake.coordinates, {
//                 stroke: false,
//                 fillOpacity: 0.75,
//                 color: getColor(earthquake.coordinates[2]),
//                 fillColor: getColor(earthquake.coordinates[2]),
//                 radius:markerSize(earthquake.properties.mag) 
//             }) 
//         )
//     }).bindPopup("<h1>" + earthquake.properties.place + "</h1> <hr> <h3>" + new Date(earthquake.properties.time) + "<h3> <hr> <h3>" + earthquake.properties.mag + "</h3>").addTo(myMap);
    


//     var earthquakes_l = L.layerGroup(earthquake_markers);


//     // Create our map, giving it the streetmap and earthquakes layers to display on load
//      var myMap = L.map("mapid", {
//         center: [37.09, -95.71],
//         zoom: 5,
//         layers: [streetmap, earthquakes_l]
//     });

//   // Create a layer control
//   // Pass in our baseMaps and overlayMaps
//   // Add the layer control to the map
//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: false
//     }).addTo(myMap);


//     // Set up the legend
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = geojson.options.limits;
//     var colors = geojson.options.colors;
//     var labels = [];

//     // Add min & max
//     var legendInfo = "<h1>Earthquake Magnitude</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding legend to the map
//   legend.addTo(myMap);

// });

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

    var earthquakes = L.geoJSON(data.features,{
        onEachFeature: addPopup,
        pointToLayer: addMarker
    });

    createMap(earthquakes);

});
