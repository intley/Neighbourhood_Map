/* Model for the app. Neighbourhood places that I frequent in my locality. */

var locations = [
  {
    "name": 'Popeyes Louisiana Kitchen',
    "location": {lat: 40.745754, lng: -74.163797}
  },
  {
    "name": '5 Grains Rice',
    "location": {lat: 40.746177, lng: -74.158874}
  },
  {
    "name": 'Gina\'s Pizzeria',
    "location": {lat: 40.750263, lng: -74.156915}
  },
  {
    "name": 'Quikchek',
    "location": {lat: 40.743864, lng: -74.155746}
  },
  {
    "name": 'Wendy\'s',
    "location": {lat: 40.743100, lng: -74.155389}
  },
  {
    "name": 'Tops Diner',
    "location": {lat: 40.750716, lng: -74.164004}
  }
]

// Creating the required global map variables
var map;

// ViewModel for the application
var ViewModel = function() {

}

function initApp() {
  ko.applyBindings(new ViewModel());
}


// Setting the Google Map object with the customized settings
function initMap() {
var myLatlng = new google.maps.LatLng(40.7465, -74.1563);
var largeInfowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

var mapOptions = {
  zoom: 14,
  center: myLatlng,
  mapTypeId: 'roadmap',
  styles: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ff2a2b"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#42b050"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#edffbe"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.station.rail",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ab7698"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "color": "#257eb5"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#6ccad3"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "color": "#05d3ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#060706"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#e0f7ff"
      }
    ]
  }
]
};

map = new google.maps.Map(document.getElementById('map'), mapOptions);

// The following group uses the location array to create an array of markers on initialize.
for (var i = 0; i < locations.length; i++) {
// Get the position from the location array.
var position = locations[i].location;
var title = locations[i].name;
// Create a marker per location, and put into markers array.
var marker = new google.maps.Marker({
map: map,
position: position,
title: title,
animation: google.maps.Animation.DROP,
id: i
});
// Push the marker to our array of markers.
markers.push(marker);
// Create an onclick event to open an infowindow at each marker.
marker.addListener('click', function() {
populateInfoWindow(this, largeInfowindow);
});
bounds.extend(markers[i].position);
}
// Extend the boundaries of the map for each marker
map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
// Check to make sure the infowindow is not already opened on this marker.
if (infowindow.marker != marker) {
infowindow.marker = marker;
infowindow.setContent('<div>' + marker.title + '</div>');
infowindow.open(map, marker);
// Make sure the marker property is cleared if the infowindow is closed.
infowindow.addListener('closeclick',function(){
infowindow.setMarker = null;
});
}
}
