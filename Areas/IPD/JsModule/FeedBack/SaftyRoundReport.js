var _inv_no ='P048/2122/238490';
$(document).ready(function() {
	Onload();
	$('select').select2();
});
function OpenReport() {
	var date = $('#txtDate').val();
	var FloorName = $('#ddlFloor option:selected').val();
	var link = "../Print/ClinicalSafetyRoundReports?date=" + date + "&FloorName=" + FloorName
	window.open(link, '_blank');
}
function PatientAllotmentReport() {
    var date = $('#txtDate').val();
    var FloorName = $('#ddlFloor option:selected').val();
    var link = "../Print/PatientAllotmentReport?date=" + date + "&FloorName=" + FloorName
    window.open(link, '_blank');
}
function Onload() {
	var url = config.baseUrl + "/api/IPDNursing/IPD_ClinicalSafetyRoundQuesries";
	var objBO = {};
	objBO.Logic = "FloorList";
	$.ajax({
		method:"POST",
		url:url,
		data:JSON.stringify(objBO),
		dataType:"json",
		contentType:"application/json;charset=utf-8",
		success: function (data) {			
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {				
					$.each(data.ResultSet.Table, function (key, value) {
						$("#ddlFloor").append($("<option></option>").html(value.FloorName));
					});
				}
			}
			else {
				MsgBox('No Data Found')
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

