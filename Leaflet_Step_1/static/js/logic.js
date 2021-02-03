

// Create initial map object
var myMap = L.map("mapid", {
    center: [
      37.09, -95.71],
    zoom: 5,
    });

// Add tile layer    
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function markerSize(magnitude){
    return magnitude * 5;
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
    else if (depth >= 50) {
        return '#CCFF00';
    }
    else if (depth >= 50) {
        return '#66FF00';
    }
    else {
        return '#00FF00';
    }
};

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // The data.features object is in the GeoJSON standard
    console.log(data.features);

    var earthquakes = L.geoJSON(data.features);

    var earthquake_markers = []



    earthquakes.forEach(function(earthquake){
        earthquake_markers.push(
            L.circle(earthquake.coordinates, {
                stroke: false,
                fillOpacity: 0.75,
                color: getColor(earthquake.coordinates[2]),
                fillColor: getColor(earthquake.coordinates[2]),
                radius:markerSize(earthquake.properties.mag) 
            }) 
        )
    }).bindPopup("<h1>" + earthquake.properties.place + "</h1> <hr> <h3>" + new Date(earthquake.properties.time) + "<h3> <hr> <h3>" + earthquake.properties.mag + "</h3>").addTo(myMap);
    


    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

    var earthquakes_l = L.layerGroup(earthquake_markers);

    var baseMaps = {
    "Street Map": streetmap,
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
     var myMap = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes_l]
    });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


    // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});


