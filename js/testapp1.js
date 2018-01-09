// Creating the required global map variables
var map, bounds, infowindow;
var markers = [];

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


// ViewModel for the application
var ViewModel = function() {
  var self = this;

  self.searchInput = ko.observable('');
  self.locationList = ko.observableArray([]);

  self.locationList.push(locations.name)

  /*
  locations.forEach(function(location) {
    self.locationList.push(locations.location);
  });*/

self.filteredLocations = ko.computed(function() {
  var filterText = self.searchInput().toLowerCase();

  return ko.utils.arrayFilter(self.locationList(), function(location) {
    if (locations.title.toLowerCase().indexOf(filterText) != -1) {
      locations.marker.setMap(map);
      return true;
    } else {
      locations.marker.setMap(null);
      return false;
    }
  });
});
}

ko.applyBindings(new ViewModel());




// Setting the Google Map object with the customized settings
function initMap() {
var myLatlng = new google.maps.LatLng(40.7465, -74.1563);
var largeInfowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

var mapOptions = {
  zoom: 14,
  center: myLatlng,
  mapTypeId: 'roadmap',

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
