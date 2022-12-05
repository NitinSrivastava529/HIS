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
function initialize() {	
	//Initialization of MAP
	var latlng = new google.maps.LatLng(26.873859112049747, 81.02294209515325);
	//var latlng = new google.maps.LatLng(position[0], position[1]);
	map = new google.maps.Map(document.getElementById("map"), {
		center: latlng,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	infoWindow = new google.maps.InfoWindow();

	map.setCenter(latlng);
	///var pos = new google.maps.LatLng(coord.lat(), coord.lng());
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		icon: '/images/patient.png'
	});
	marker = new google.maps.Circle({
		center: latlng,
		map: map,
		strokeColor: 'red',
		strokeWeight: 2,
		strokeOpacity: 0.5,
		fillColor: '#c1683354',
		fillOpacity: 0.5,
		radius: 1 * 100
	});
}
function GetAmbulanceStatus() {
	GetAmbulanceTrackStatus();
	initialize();
	setInterval(function () { 
		GetAmbulanceTrackStatus();
	}, 10000);
}
function DrawRoute(AmbStartLat, AmbStartLong) {
	//Draw Route 
	var directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	var start = new google.maps.LatLng(AmbStartLat, AmbStartLong);
	var end = new google.maps.LatLng(AmbStartLat, AmbStartLong);
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
}
function GetAmbulanceTrackStatus() {		
	$('#tblStatus tbody').empty();
	var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyQueries";
	var objBO = {};
	objBO.RequestId = '-';
	objBO.DriverId = '-';
	objBO.AmbulanceId = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.Logic = "GetAmbulanceStatus";
		$('#tblStatus tbody').empty();
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {				
				if (Object.keys(data.ResultSet).length > 0) {
					if (Object.keys(data.ResultSet.Table).length > 0) {
						var html = "";
						$.each(data.ResultSet.Table, function (key, val) {
							html += "<tr>";
							html += "<td>" + val.AmbulanceId + "</td>";
							html += "<td>" + val.AmbulanceName + "</td>";
							if (val.AmbulanceStatus == 'Running')
								html += "<td><img id='imgRed' src='/images/red.gif' style='width: 20px;' />&nbsp;" + val.AmbulanceStatus + "</td>";
							else if (val.AmbulanceStatus == 'Return')
								html += "<td><img id='imgRed' src='/images/green.gif' style='width: 20px;' />&nbsp;" + val.AmbulanceStatus + "</td>";
							else if (val.AmbulanceStatus == 'In Hospital')
								html += "<td><img id='imgRed' src='/images/yellow.png' style='width: 20px;' />&nbsp;" + val.AmbulanceStatus + "</td>";
							html += "</tr>";
							createMarker(val.CurLat, val.CurLong);
							//Draw Route 
							//var directionsService = new google.maps.DirectionsService();
							//directionsDisplay = new google.maps.DirectionsRenderer();
							//var start = new google.maps.LatLng(26.873859112049747, 81.02294209515325);
							//var end = new google.maps.LatLng(val.PatientGeoLat, val.PatientGeoLong);
							//var request = {								
							//	origin: start,
							//	destination: end,
							//	travelMode: google.maps.TravelMode.DRIVING
							//};

							//directionsService.route(request, function (response, status) {
							//	if (status == google.maps.DirectionsStatus.OK) {
							//		directionsDisplay.setDirections(response);
							//		directionsDisplay.setMap(map);
							//	} else {
							//		//alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
							//	}
							//});
						});
						$('#tblStatus tbody').append(html);
					}
				}
			},
			error: function (response) {
				alert('Server Error...!');
			}		
	})

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
