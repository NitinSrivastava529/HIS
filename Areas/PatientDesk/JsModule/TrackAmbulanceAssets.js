var _RequestId;
var _AmbulanceId;
var _currentLat=0;
var _currentLong=0;
var _patientLat=0;
$(document).ready(function () {
	var RequestId = query()['ReqId'];
	_RequestId = query()['ReqId'];
	GetTrackingInfoByReqId();
	//GetLatLong()
	//GetStartLat();	
	setInterval(function () {
		GetLatLong();
	}, 2000)	
});
function GetLatLong() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
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
			}
		);
	}
}
//function createMarker(lat, long) {
//	var pos = new google.maps.LatLng(lat, long);
//	var marker = new google.maps.Marker({
//		position: pos,
//		map: map,
//		icon: '/images/ambulance.png'
//	});
//	markers.push(marker);
	
//}


function GetTrackingInfoByReqId() {
	var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyQueries";
	var objBO = {};
	objBO.RequestId = _RequestId;
	objBO.DriverId = '-';
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
						if (val.TripStatus == 'Finished') {
							$('body').css({
								'pointer-events': 'none',
								'opacity': '0.5'
							});
							alert('Request Id : ' + objBO.RequestId + '\nStatus : ' + val.TripStatus)
							return
						}
						$('#txtRequestId').text(val.RequestId);
						$('#txtName').text(val.PatientName);
						if (val.DriverName!='-') {
							$('#DriverName').show();
							$('#txtDriverName').text(val.DriverName);
						}
						else {							
							$('#DriverName').hide();
							$('#txtDriverName').text(val.DriverName);
						}
						if (val.DriverMobileNo != '-') {
							$('#DriverMobile').show();
							$('#txtDriverMobile').html('<a href=tel:' + val.DriverMobileNo + '>' + val.DriverMobileNo + '&nbsp;<i class="fa fa-phone"></i></a>');
						}
						else {
							$('#DriverMobile').hide();													
						}
					
						$('#txtAddress').text(val.PatientAddress);
						if (val.moveStatus == 'On the Way') {
							var trackBtn = '<button id="btnTrack" class="btn btn-warning btn-xs btnTrack" onclick="calcRoute()">Start Tracking</button>';
							$('#btnSubmitLocation').prop('disabled', false);
						}
						else {
							$('#btnSubmitLocation').prop('disabled', true);
							var trackBtn = '<button id="btnTrack" disabled class="btn btn-warning btn-xs btnTrack" onclick="calcRoute()">Start Tracking</button>';
						}

						$('#txtStatus').html(val.moveStatus + trackBtn);
						_AmbulanceId = val.AmbulanceId
						if (eval(val.PatientGeoLat).length < 2) {
							$('#btnSubmitLocation').prop('disabled', false);
						}
					});
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function UpdateLatLaong() {
	var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyRequest";
	var objBO = {};
	objBO.RequestId = _RequestId;
	objBO.EntryDate = '1900/01/01';
	objBO.PatientGeoLat = _currentLat;
	objBO.PatientGeoLong = _currentLong;
	objBO.PickupDate = '1900/01/01';
	objBO.PickupTime = '00:00';
	objBO.login_id = Active.userId;
	objBO.Logic = "UpdatePatientLatLaong";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert(data);
			}
			else {
				alert(data);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}