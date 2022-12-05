$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	$('#tblOPDCall tbody').on('click', 'button', function () {
		var ID = $(this).data('id');
		var logic = $(this).data('logic');
		OPDCancelAndCallDone(ID, logic, $(this));
	});
});
function HIS_OPDCall() {
	$('#tblOPDCall tbody').empty();
	var url = config.baseUrl + "/api/Online/HIS_OPDCall";
	var objBO = {};
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			var tbody = "";
			$.each(data.ResultSet.Table, function (key, val) {
				if (val.CancelDateTime != null)
					tbody += "<tr style='background:#ffc6c6'>";
				else if (val.CallStatus == 'Done')
					tbody += "<tr style='background:#c4f7c4'>";
				else tbody += "<tr>";

				tbody += "<td>" + val.PatientName + "</td>";
				tbody += "<td>" + val.Age + "</td>";
				tbody += "<td>" + val.Mobile + "</td>";
                tbody += "<td>" + val.AppointmentDate + "</td>";
                tbody += "<td>" + val.StartTime + "</td>";
				tbody += "<td>" + val.DoctorName + "</td>";
				tbody += "<td>" + val.CancelDateTime + "</td>";
				tbody += "<td><button class='tbl-btn btn-warning' data-id=" + val.ID + " data-logic='Cancel'>Cancel</button>&nbsp;&nbsp;<button data-id=" + val.ID + " data-logic='CallDone' class='tbl-btn btn-success'>Call Done</button></td>";
				tbody += "</tr>";
			});
			$('#tblOPDCall tbody').append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function OPDCancelAndCallDone(ID, logic, elem) {
	var url = config.baseUrl + "/api/Online/HIS_OPDCancelAndCallDone";
	var objBO = {};
	objBO.ID = ID;
	objBO.login_id = Active.userId;
	objBO.Logic = logic;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {		
			if (data.includes('Success')) {
				$(elem).closest('tr').remove();
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}