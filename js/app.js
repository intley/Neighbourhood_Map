/*jshint sub:true*/

// Global Map variable
var map, bounds, infoWindow;

// Creating a blank array for all markers
var markers = [];
//var image = ""

// Image for the marker

/* Model for the app
   Famous Historical places in my locality
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
  bounds.extend(this.location);

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

  self.clickLocations = ko.observable(false);

  self.showLocations = function() {
    self.clickLocations(true);
  }

  self.hideLocations = function() {
    self.clickLocations(false);
  }

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
      var ll = {
        lat: location.lat,
        lng: location.lng
      };
      var address = location['formattedAddress'];
      var contact = venue['contact'].formattedPhone;

      markers.push({
        name: name,
        location: ll,
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
  }).fail(function() {
    alert('There was an error retrieving data from the Foursquare API. Please try reloading the page.');
  });
}

// Setting the Google Map with the required settings

function initMap() {
var myLatlng = {
  lat: 40.7413549,
  lng: -73.9980244
};
//var myLatlng = new google.maps.LatLng(40.7413549, -73.9980244);

var mapOptions = {
  zoom: 13,
  center: myLatlng,
  mapTypeControl: true,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_LEFT
          },
          zoomControl: true,
          zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP
          },
          streetViewControl: true,
          streetViewControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP
          },
  styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
};

map = new google.maps.Map(document.getElementById('map'), mapOptions);

infoWindow = new google.maps.InfoWindow();
bounds = new google.maps.LatLngBounds();

getLocationData(myLatlng, '4deefb944765f83613cdba6e', 4000, 7);

}

// Map Error on accessing the Google Maps API
function mapError() {
  alert('There was an error accessing the Google Maps API. Please try reloading the page.');
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
    }, 1000);
  }
}
