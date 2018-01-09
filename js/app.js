// Global Map variable
var map, bounds, infoWindow;

// Creating a blank array for all markers
var markers = [];

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

};


/* ViewModel for the application,
   Binds the model with the view and controls
   the functioning of the application.
*/

var ViewModel = function() {
  var self = this;
  self.markerList = ko.observableArray([]);

  //console.log(markerList);

  markers.forEach(function(location) {
    self.markerList.push(new Location(location));
  });

  self.searchInput = ko.observable('');

  self.filteredLocations = ko.computed(function() {
    var searchInput = self.searchInput().toLowerCase();

    return ko.utils.arrayFilter(self.markerList(), function(location) {
      if (location.name.toLowerCase().indexOf(searchInput) != -1) {
        location.marker.setMap(map);
        return true;
      } else {
        location.marker.setMap(null);
        return false;
      }
    });
  });

  self.openInfoWindow = function(response) {
    populateInfoWindow(response);
  };

};

// Applying Bindings to the View
function initApp() {
  ko.applyBindings(new ViewModel());
}


/* FourSquare API call
   Retrieves data and creates markers to populate map
*/

function getLocationData(center, categoryId, radius, limit) {
  var api_call ='https://api.foursquare.com/v2/venues/search' +
                '?ll=' + center.lat + ',' + center.lng +
                '&categoryId=' + categoryId +
                '&radius=' + radius +
                '&limit=' + limit +
                '&v=20180107&client_id=' +
                'O3A0RUJ0BZSQWVORUVVP12CMMYH2FVIDSUA02BIQMAJFELWO' +
                '&client_secret=' +
                'JBBFQMM0PT3PLANGLPNY5UVDINAL3KIE0E5BEUNEFJFDVFB0';
//console.log(api_call)

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

    //console.log(markers);

    // Initialize Knockout bindings
    initApp();

    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
    }
  });
}

// Setting the Google Map with the required settings

function initMap() {
var myLatlng = {
  lat: 40.7413549,
  lng: -73.9980244
}
//var myLatlng = new google.maps.LatLng(40.7413549, -73.9980244);

var mapOptions = {
  zoom: 13,
  center: myLatlng
//  mapTypeId: 'roadmap'
};

map = new google.maps.Map(document.getElementById('map'), mapOptions);

infoWindow = new google.maps.InfoWindow();
bounds = new google.maps.LatLngBounds();

getLocationData(myLatlng, '4deefb944765f83613cdba6e', 4000, 30);

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
        <h4>` + location.name + `</h4>
        ` + (location.contact === undefined ? '' : '<div>' + location.contact + '</div>') + `
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
