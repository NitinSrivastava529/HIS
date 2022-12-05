$(document).ready(function () {
	$('select').select2();
	GetAmbulanceMaster();
	GetDriverMaster();
	$('#tblAmbulanceMaster tbody tr.document').on('click', 'button', function () {
		//alert($(this).data('id'))
		alert(1)
	});
	$('#tblAmbulanceMaster tbody').on('click', '.btnDoc', function () {
		$(this).parents('table').find('tr.document').remove();
		var AmbulanceId = $(this).closest('tr').find('td:eq(1)').text();

		var html = "";
		html += "<tr class='document'>";
		html += "<td colspan='5' style='background: #f1efde;'>";
		html += "<div class='row' style='padding: 6px 3px 0'>";
		html += "<div class='col-md-5'>";
		html += "<select class='form-control'>";
		html += "<option>Select Document</option>";
		html += "<option>Fitness</option>";
		html += "<option>Pollution</option>";
		html += "<option>Registration</option>";
		html += "<option>Insurance</option>";
		html += "</select>";
		html += "</div>";
		html += "<div class='col-md-5'>";
		html += "<input type='file' class='form-control' id='FileUpload'>";
		html += "</div>";
		html += "<div class='col-md-2'>";
		html += "<button class='btn btn-warning' onclick=InsertAmbulanceDoc(this) data-id='" + AmbulanceId + "'><i class='fa fa-upload'></i></button>";
		html += "</div>";
		html += "</div>";
		html += "<table class='table table-bordered' style='margin: 7px 0;'>";
		html += "<thead>";
		html += "<tr>";
		html += "<th>SR. No.</th>";
		html += "<th>Document Type</th>";
		html += "<th>File</th>";	
		html += "</tr>";
		html += "</thead>";
		html += "<tbody></tbody>";			
		html += "</tr>";
		html += "</table></td></tr>";
		$(this).closest('tr').after(html);
		GetAmbulanceDocument(AmbulanceId);
	});
});
function GetAmbulanceMaster() {
	$('#tblAmbulanceMaster tbody').empty();
	var url = config.baseUrl + "/api/master/Ambulance_MasterQueries";
	var objBO = {};
	objBO.DriverId = '-';
	objBO.AmbulanceId = '-';
	objBO.Prm1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetAmbulanceMaster";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var tbody = "";
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						tbody += '<tr>';
						tbody += '<td><button class="btn btn-warning btn-xs btnDoc"><b>+</b></button></td>';
						tbody += '<td>' + val.AmbulanceId + '</td>';
						tbody += '<td>' + val.AmbulanceName + '</td>';
						tbody += '<td>' + val.AmbulanceNumber + '</td>';
						tbody += "<td>";
						tbody += "<label class='switch'>";
						tbody += "<input type='checkbox' data-id=" + val.AmbulanceId + " data-logic='ActiveAmbulanceStatus' onchange=ActiveStatus(this) class='IsActive' id='chkActive' " + val.checked + ">";
						tbody += "<span class='slider round'></span>";
						tbody += "</label>";
						tbody += "</td>";
						tbody += '</tr>';
					});
					$('#tblAmbulanceMaster tbody').append(tbody);
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetAmbulanceDocument(AmbulanceId) {
	$('#tblAmbulanceMaster tbody tr.document').find('table tbody').empty();
	var url = config.baseUrl + "/api/master/Ambulance_MasterQueries";
	var objBO = {};
	objBO.DriverId = '-';
	objBO.AmbulanceId = AmbulanceId;
	objBO.Prm1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetAmbulanceDocument";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var tbody = "";
			var count = 0;
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						count++;
						tbody += '<tr>';
						tbody += '<td>' + count+'</td>';
						tbody += '<td>' + val.DocType+'</td>';					
						tbody += '<td><a href="' + val.FilePath + '" target="_blank" class="btn btn-primary btn-xs">View</a></td>';
						tbody += '</tr>';
					});
					$('#tblAmbulanceMaster tbody tr.document').find('table tbody').append(tbody);
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetDriverMaster() {
	$('#tblDriverMaster tbody').empty();
	var url = config.baseUrl + "/api/master/Ambulance_MasterQueries";
	var objBO = {};
	objBO.DriverId = '-';
	objBO.AmbulanceId = '-';
	objBO.Prm1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetDriverMaster";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var tbody = "";
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						tbody += '<tr>';
						tbody += '<td>' + val.DriverId + '</td>';
						tbody += '<td>' + val.DriverName + '</td>';
						tbody += '<td>' + val.DriverMobileNo + '</td>';
						tbody += "<td>";
						tbody += "<label class='switch'>";
						tbody += "<input type='checkbox' data-id=" + val.DriverId + " data-logic='ActiveDriverStatus' onchange=ActiveStatus(this) class='IsActive' id='chkActive' " + val.checked + ">";
						tbody += "<span class='slider round'></span>";
						tbody += "</label>";
						tbody += "</td>";
						tbody += '</tr>';
					});
					$('#tblDriverMaster tbody').append(tbody);
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertAmbulance() {
	var url = config.baseUrl + "/api/master/Ambulance_InsertUpdateMaster";
	var objBO = {};
	objBO.DriverId = '-';
	objBO.DriverName = '-';
	objBO.DriverMobileNo = '-';
	objBO.AmbulanceId = '-';
	objBO.AmbulanceName = $('#txtAmbulanceName').val();
	objBO.AmbulanceNumber = $('#txtAmbulanceNo').val();
	objBO.Prm1 = '-';
	objBO.IsActive = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "InsertAmbulance";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert(data);
				GetAmbulanceMaster();
				$('#txtAmbulanceName').val('');
				$('#txtAmbulanceNo').val('');
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
function InsertDriver() {
	var url = config.baseUrl + "/api/master/Ambulance_InsertUpdateMaster";
	var objBO = {};
	objBO.DriverId = $('#txtEmployeeCode').val();
	objBO.DriverName = $('#txtDriverName').val();
	objBO.DriverMobileNo = $('#txtMobileNo').val();
	objBO.AmbulanceId = '-';
	objBO.AmbulanceName = '-';
	objBO.AmbulanceNumber = '-';
	objBO.Prm1 = '-';
	objBO.IsActive = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "InsertDriver";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert(data);
				GetDriverMaster();
				$('#txtEmployeeCode').val('');
				$('#txtDriverName').val('');
				$('#txtMobileNo').val('');
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
function ActiveStatus(elem) {
	var url = config.baseUrl + "/api/master/Ambulance_InsertUpdateMaster";
	var objBO = {};
	objBO.DriverId = '-';
	objBO.DriverName = '-';
	objBO.DriverMobileNo = '-';
	objBO.AmbulanceId = '-';
	objBO.AmbulanceName = '-';
	objBO.AmbulanceNumber = '-';
	objBO.Prm1 = $(elem).data('id');
	objBO.IsActive = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = $(elem).data('logic');
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (data.includes('Success')) {
				if (objBO.Logic == 'ActiveAmbulanceStatus')
					GetAmbulanceMaster();
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
function GetChandanEmpInfo() {
	if ($('#txtEmployeeCode').val() == '') {
		alert('Please Provide Employee Code');
		return;
	}
	$('#txtDriverName').val('');
	$('#txtMobileNo').val('');
	var url = config.baseUrl + "/api/master/Ambulance_MasterQueries";
	var objBO = {};
	objBO.DriverId = '-';
	objBO.AmbulanceId = '-';
	objBO.Prm1 = $('#txtEmployeeCode').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "GetChandanEmpInfo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var tbody = '';
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						$('#txtDriverName').val(val.emp_name);
						$('#txtMobileNo').val(val.mobile_no);
					});
				}
				else {
					alert('Record Not Found.');
				}
			}

		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertAmbulanceDoc(elem) {
	var url = config.baseUrl + "/api/master/InsertAmbulanceDoc";
	var objBO = {};
	objBO.AmbulanceId = $(elem).data('id');
	objBO.DocType = $(elem).closest('tr').find('select option:selected').text();

	var UploadDocumentInfo = new XMLHttpRequest();
	var data = new FormData();
	data.append('obj', JSON.stringify(objBO));
	data.append('ImageByte', $(elem).closest('tr').find('input[id="FileUpload"]')[0].files[0]);
	UploadDocumentInfo.onreadystatechange = function () {
		if (UploadDocumentInfo.status) {
			if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
				var json = JSON.parse(UploadDocumentInfo.responseText);
				console.log(json.Message)
				if (json.Message.includes('Success')) {
					alert(json.Message);
					GetAmbulanceDocument(objBO.AmbulanceId);
				}
				else {
				}
			}
		}
	}
	UploadDocumentInfo.open('POST', url, true);
	UploadDocumentInfo.send(data);
}
