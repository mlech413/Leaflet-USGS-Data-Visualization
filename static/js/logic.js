// Create a map object
var myMap = L.map("map", {
    center: [37.09, -110],
    zoom: 6
  });

  // Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define colors based on depth
function getDepth(depth) {
    if (depth > 24) {
        return "darkred"
    } else if (depth > 18) {
        return "red"
    } else if (depth > 12) {
        return "orange"
    } else if (depth > 6) {
        return "gold"
    } else {
        return "yellow"
    }
}

// multiple magnitude by 3 to see better on the map
function getMagnitude(mag) {
    return mag * 3
}

// Last 30 days of earthquakes
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url).then(function(response) {
    console.log(response);
    function styleInfo(feature) {
        return {
            fillColor: getDepth(feature.geometry.coordinates[2]),
            radius: getMagnitude(feature.properties.mag),
            opacity: 1,
            fillOpacity: 1,
            color: "black",
            weight: 0.3
        }
    }

    L.geoJson (response, {
        pointToLayer: function(feature, coordinates) {
            return L.circleMarker(coordinates);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`
                Magnitude: ${feature.properties.mag} <br>
                Depth: ${feature.geometry.coordinates[2]} <br>
                Location: ${feature.properties.place}
            `)
        }
    }).addTo(myMap);

});
