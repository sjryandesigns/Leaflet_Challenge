// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create function to determine marker size based on magnitude
function markerSize(magnitude){
    if (magnitude === 0){
        return 1;
    }
    else {
        return magnitude *5;
    }
};

// Function to determine marker color based on depth
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
        return '#99FF00';
    }
    else {
        return '#33FF00';
    }
};


// Function to add marker with style options
function addMarker (feature, location){
    var options = {
        stroke: true,
        weight: .5,
        fillOpacity: 0.8,
        color: "black",
        fillColor: markerColor(feature.geometry.coordinates[2]),
        radius: markerSize(feature.properties.mag)
    }

    return L.circleMarker(location, options);
};

// Function to add popup to marker with info
function addPopup (feature, layer) {
// cut code here 
    return layer.bindPopup("<h3>" + feature.properties.title + "</h3><hr><p>" + new Date(feature.properties.time)+ "</p>");
};


// Function to create map
function createMap(earthquakes) {
    // Add tile layer
    var basemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });
    // Define base map object to hold base layer
    var baseMaps = {
        "Street Map": basemap,
    };
    
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create initial map object
    var myMap = L.map("mapid", {
        center: [
        37.09, -95.71],
        zoom: 5,
        layers: [basemap, earthquakes]
    });

    // Create map lengend and position
    var legend = L.control({position: 'bottomright'});

    // Add legend to map
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend')
        var grades = [-10, 10, 30, 50, 70, 90];

        
        for (var i=0; i < grades.length; i++){
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' : '+');
        }

        return div;

    };

    legend.addTo(myMap);

    // Create layer control and add to map, pass in base and overlay maps
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    
}


d3.json(queryUrl).then(function(data) {
    console.log(data.features);
    var earthquakes = L.geoJSON(data.features,{
        onEachFeature: addPopup,
        pointToLayer: addMarker
    });

    createMap(earthquakes);

});

    














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

// Perform a GET request to the query URL

