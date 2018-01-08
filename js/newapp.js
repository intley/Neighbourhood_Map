// Global Map variable
var map;

// Creating a blank array for all markers
var markers = [];

/* ViewModel for the application,
   Binds the model with the view and controls
   the functioning of the application.
*/

var ViewModel = function() {
  var self = this;
  self.searchInput = ko.observable('');
  self.markerlist = ko.observableArray([]);

  markers.forEach(function(location)){
    self.markerlist.push(new Location(location));
  });

  self.filteredLocations = ko.computed(function() {
    var filterText = self.searchInput().toLowerCase();

    return ko.utils.arrayFilter(self.markerlist(), function(location) {
      if (location.title.toLowerCase().indexOf(filterText) != -1) {
        location.marker.setMap(map);
        return true;
      } else {
        location.marker.setMap(null);
        return false;
      }
    });
  });

};

// Applying Bindings to the View
function initApp() {
  ko.applyBindings(new ViewModel());
}


/* Model for the app
   Famous Hotels in my locality
*/

var Location = function(response) {
  this.name = response.name;
  this.location = response.location;
  this.address = response.address;
  this.contact = response.contact;

  this.marker = new google.maps.Marker({
    map: map,
    position: this.location,
    title: this.name,
    animation: google.maps.Animation.DROP
  });

  var self = this;

  // Create an onclick event to open an infowindow at each marker.
  this.marker.addListener('click', function() {
  populateInfoWindow(self);
  });

  // Extend the boundaries of the map for each marker
  bounds.extend(this.position);

}

/* FourSquare API call
   Retrieves data and creates markers to populate map
*/

getLocationData(center, categoryId, radius, limit) {
  var api_call = 'https://api.foursquare.com/v2/venues/search' +
                '?ll=' + center.lat + ',' + center.lng +
                '&categoryId=' + categoryId +
                '&radius=' + radius +
                '&limit=' + limit +
                '&v=20180107&client_id=' +
                'O3A0RUJ0BZSQWVORUVVP12CMMYH2FVIDSUA02BIQMAJFELWO' +
                '&client_secret=' +
                'JBBFQMM0PT3PLANGLPNY5UVDINAL3KIE0E5BEUNEFJFDVFB0';

$.ajax({
  type: 'GET',
  url: api_call,
  dataType: 'json',
  success: function(response) {
    venues = response['response']['venues'];
    venues.forEach(function (venue) {
      var name = venue['name'];
      var location = venue['location'];
      var coord = {
        lat: location.lat,
        lng: location.lng
      };
      var address = location['formattedAddress'];
      var contact = venue['contact'].formattedPhone;

      markers.push({
        name: name,
        location: coord,
        address: address,
        contact: contact,
      });
    });

    // Initialize Knockout bindings
    initApp();

    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
    }
  });
}

// Setting the Google Map with the required settings

function initMap() {

var myLatlng = new google.maps.LatLng(40.7413549, -73.9980244);

var mapOptions = {
  zoom: 13,
  center: myLatlng,
  mapTypeId: 'roadmap'
};

map = new google.maps.Map(document.getElementById('map'), mapOptions);

var infoWindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

getLocationData(center, '4deefb944765f83613cdba6e', 4000, 30);

}

// This function populates the infoWindow when the marker is clicked
function populateInfoWindow(location) {
  var marker = location.marker;
  // Check to make sure the infoWindow is not already opened on this marker
  if (infoWindow.marker != marker) {
    // Start BOUNCE animation
    marker.setAnimation(google.maps.Animation.BOUNCE);

    infoWindow.marker = marker;
    infoWindow.setContent(`
      <div>
        <h4>` + location.title + `</h4>
        ` + (location.contact === undefined ? '' : '<div>' + location.contact + '</div>') + `
        ` + (location.url === undefined ? '' : '<div><a href="' + location.url + '" target="_blank">' + location.url + '</a></div>') + `
        <br>
        <h6>Address</h6>
        <div>` + location.address[0] + `</div>
        <div>` + location.address[1] + `</div>
        <div>` + location.address[2] + `</div>
      </div>
    `);
    infoWindow.open(map, marker);

    // Make sure the marker property is cleared if the infoWindow is closed
    infoWindow.addListener('closeclick', function() {
      infoWindow.marker = null;
    });

    // Set timeout for animation
    setTimeout(function() {
      marker.setAnimation(null);
    }, 700);
  }
}
