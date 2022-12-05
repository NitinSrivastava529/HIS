let map;
let infoWindow;
var centerpoint;
var markers = [];           // array to hold markers
var kmRadius = 0.2;          // draw 20 km radius
var directionsDisplay;
var myInterval;
var _startlat = 0;
var _startLong = 0;
var ct = 0;
var positions = [];
var directionsService = new google.maps.DirectionsService();
var _Index;
$(document).ready(function () {
	//myInterval = setInterval(function () { drawRoute(); }, 3000);
	//initialize(); not required because already use in Link as Callback
});
function initialize() {
	_Index = 0;
	//Initialization of MAP
	var latlng = new google.maps.LatLng(26.910282518535272, 80.9573723717934);
	//var latlng = new google.maps.LatLng(position[0], position[1]);
	map = new google.maps.Map(document.getElementById("map"), {
		center: latlng,
		zoom:18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	infoWindow = new google.maps.InfoWindow();

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
				position = pos;
				map.setCenter(pos);
				_currentLat = pos.lat;
				_currentLong = pos.lng;
				console.log(_currentLat)
    			if (_currentLat != null) {
					$('#imgRed').hide();
					$('#imgGreen').show();
					$('#btnSubmitLocation').prop('disabled', false);					
				}
				else {
					$('#imgRed').show();
					$('#imgGreen').hide();
					$('#btnSubmitLocation').prop('disabled', true);
				}
				///var pos = new google.maps.LatLng(coord.lat(), coord.lng());
				var marker = new google.maps.Marker({
					position: pos,
					map: map,
					icon: '/images/patient.png'
				});
				markers.push(marker);
				marker = new google.maps.Circle({
					center: pos,
					map: map,
					strokeColor: 'red',
					strokeWeight: 2,
					strokeOpacity: 0.5,
					fillColor: '#c1683354',
					fillOpacity: 0.5,
					radius: 1 * 50
				});
				markers.push(marker);
			},
			() => {
				handleLocationError(true, infoWindow, map.getCenter());
			}
		);
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
	// add listener
	google.maps.event.addDomListener(map, 'click', function (event) { alert(event.latLng); });
}
function calcRoute() {
	var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyQueries";
	var objBO = {};
	objBO.RequestId = query()['ReqId'];
	objBO.DriverId = '-';
	objBO.AmbulanceId = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.Logic = "GetTrackingInfoByReqId";	
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {						
                        //Draw Route 
						var directionsService = new google.maps.DirectionsService();
						directionsDisplay = new google.maps.DirectionsRenderer();
						var start = new google.maps.LatLng(val.AmbulanceStartLat, val.AmbulanceStartLong);
						var end = new google.maps.LatLng(val.PatientGeoLat, val.PatientGeoLong);
						var request = {
							origin: start,
							destination: end,
							travelMode: google.maps.TravelMode.DRIVING
						};

						directionsService.route(request, function (response, status) {
							if (status == google.maps.DirectionsStatus.OK) {
								directionsDisplay.setDirections(response);
								directionsDisplay.setMap(map);
							} else {
								alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
							}
						});
						//Start getting Last location after 10 Second
						StartLocating();
					});
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function StartLocating() {
	interval=setInterval(function () {
		GetTrackingPath();
	}, 5000);
}
function createMarker(lat, long) {	
	var pos = new google.maps.LatLng(lat, long);
	var marker = new google.maps.Marker({
		position: pos,
		map: map,		
		icon: '/images/amb.gif'
	});
	markers.push(marker);	
}
function GetTrackingPath() {	
	var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyQueries";
	var objBO = {};
	objBO.RequestId = query()['ReqId'];
	objBO.DriverId = '-';
	objBO.AmbulanceId = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.Logic = "LastMoveOfAmbulance";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {					
					$.each(data.ResultSet.Table, function (key, val) {
						clearOverlays();
						createMarker(val.AmbLastLat, val.AmbLastLong);						
					});	
     			}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function clearOverlays() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers.length = 0;
}