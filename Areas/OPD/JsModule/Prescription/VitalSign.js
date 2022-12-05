
$(document).ready(function () {
	GetVitalSign();
	$('#btnSaveVital').on('click', function () {
		var logic = ($(this).text() == 'Save') ? 'Insert' : 'Update';
		InsertVitalSign(logic);
	});
	$('#tblVitalSign tbody').on('click', 'button', function () {
		$('#btnSaveVital').text('Update');
	});
});
function GetVitalSign() {
	var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
	var objBO = {};
	objBO.AppointmentId = Active.AppId;
	objBO.Logic = 'PatientForAdvice';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				$('#tblVitalSign tbody').empty();
				var tbody = "";
				var count = 0;
				$.each(data.ResultSet.Table3, function (key, val) {
					count++;
					tbody += "<tr>"
					tbody += "<td>" + count + "</td>";
					tbody += "<td>" + val.BP_Sys + '/' + val.BP_Dys + "</td>";
					tbody += "<td>" + val.Pulse + "</td>";
					tbody += "<td>" + val.Resp + "</td>";
					tbody += "<td>" + val.Temprarture + "</td>";
					tbody += "<td>" + val.HT + "</td>";
					tbody += "<td>" + val.WT + "</td>";
					tbody += "<td>-</td>";
					tbody += "<td>" + val.ArmSpan + "</td>";
					tbody += "<td>" + val.SittingHeight + "</td>";
					tbody += "<td>" + val.IBW + "</td>";
					tbody += "<td>" + val.SPO2 + "</td>";
					tbody += "<td>" + val.login_id + "</td>";
					tbody += "<td>" + val.read_date + "</td>";
					tbody += "<td><button onclick=VitalSignForUpdate() class='btn-flat btn-success'>Edit</button></td>";
					tbody += "</tr>"
				});
				$('#tblVitalSign tbody').append(tbody);
			}
			else {
				alert('No Record Found..');
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function VitalSignForUpdate() {
	var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
	var objBO = {};
	objBO.AppointmentId = Active.AppId;
	objBO.Logic = 'PatientForAdvice';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				$.each(data.ResultSet.Table3, function (key, val) {
					$('#txtBpSys').val(val.BP_Sys);
					$('#txtBpDys').val(val.BP_Dys);
					$('#txtPulse').val(val.Pulse);
					$('#txtResp').val(val.Resp);
					$('#txtHT').val(val.HT);
					$('#txtWT').val(val.WT);
					$('#txtArmSpan').val(val.ArmSpan);
					$('#txtTemprarture').val(val.Temprarture);
					$('#txtIBW').val(val.IBW);
					$('#txtSPO2').val(val.SPO2);
					$('#txtSittingHeight').val(val.SittingHeight);
				});				
			}
			else {
				alert('No Record Found..');
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertVitalSign(logic) {
	var url = config.baseUrl + "/api/Prescription/CPOE_InsertVitalSign";
	var objBO = {};
	objBO.RefNo = $('#tblAdviceHeader tbody').find('tr:eq(0)').find('td:eq(9)').text();;
	objBO.UHID = $('#tblAdviceHeader tbody').find('tr:eq(1)').find('td:eq(5)').text();
	objBO.DoctorId = 'doctorId-Test';
	objBO.EntrySource = 'OPD';
	objBO.BP_Sys = $('#txtBpSys').val();
	objBO.BP_Dys = $('#txtBpDys').val();
	objBO.Pulse = $('#txtPulse').val();
	objBO.Resp = $('#txtResp').val();
	objBO.Temprarture = $('#txtTemprarture').val();
	objBO.HT = $('#txtHT').val();
	objBO.WT = $('#txtWT').val();
	objBO.ArmSpan = $('#txtArmSpan').val();
	objBO.SittingHeight = $('#txtSittingHeight').val();
	objBO.IBW = $('#txtIBW').val();
	objBO.SPO2 = $('#txtSPO2').val();
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
				alert(data);
				GetVitalSign();
				Clear();
				$('#btnSaveVital').text('Save');
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

function Clear() {
	$('input:text').val('');
}