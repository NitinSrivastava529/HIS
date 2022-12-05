$(document).ready(function () {
	searchTable('txtSearchIPDInfo', 'tblAdmittedIPDPatient');
	GetCart();
	$('#tblSetInfo thead').on('change', 'input:checkbox', function () {
		var isCheck = $(this).is(':checked');
		if (isCheck)
			$(this).parents('table').find('tbody').find('input:checkbox').prop('checked', true);
		else
			$(this).parents('table').find('tbody').find('input:checkbox').prop('checked', false);
	});
	$('#btnGetIPD').on('click', function () {
		GetPatientDetails();
		$('#modalPatientInfo').modal('show');
	});
    $('#ddlCartList').on('change', function () {
        $('#tblSetInfo tbody').empty();
    });
	$('#tblAdmittedIPDPatient tbody').on('click', 'button', function () {
		var IPDNo = $(this).closest('tr').find('td:eq(1)').text();
		var PatientId = $(this).closest('tr').find('td:eq(2)').text();
		var PatientName = $(this).closest('tr').find('td:eq(3)').text();
		var Age = $(this).closest('tr').find('td:eq(4)').text();
		var Doctor = $(this).closest('tr').find('td:eq(5)').text();
		$('#txtIPDNo').text(IPDNo);
		$('#txtPatientName').text(PatientName);
		$('#txtAge').text(Age);
		$('#txtDoctorName').text(Doctor);
		$('#tblAdmittedIPDPatient tbody').empty();
		$('#modalPatientInfo').modal('hide');
		GetSetInfoByCart();
	});
});


function GetCart() {
	var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
	var objBO = {};
	objBO.login_id = Active.userId;
	objBO.Logic = 'GetCartByLogin';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$("#ddlCartList").empty().append($('<option></option>').val('0').html('Select'));
					$("#ddlCartList").append($('<option></option>').val('ALL').html('ALL'));
					$.each(data.ResultSet.Table, function (key, val) {
						$("#ddlCartList").append($('<option></option>').val(val.CartId).html(val.CartName)).select2();
					});
				}
				else {
					alert("Data Not Found");
				};
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetPatientDetails() {
	var url = config.baseUrl + "/api/IPDNursing/GetAdmittedIPDPatient";
	$.ajax({
		method: "GET",
		url: url,
		dataType: "json",
        success: function (data) {
            console.log(data)
			$("#tblAdmittedIPDPatient tbody").empty();
			var tbody = '';
			var count = 0;
			$.each(data.ResultSet.Table, function (key, val) {
				count++;
				tbody += "<tr>";
				tbody += "<td>" + count + "</td>";
				tbody += "<td>" + val.IPDNO + "</td>";
				tbody += "<td>" + val.Patient_ID + "</td>";
				tbody += "<td>" + val.PName + "</td>";
				tbody += "<td>" + val.Age + '/' + val.Gender + "</td>";
				tbody += "<td>" + val.DName + "</td>";
				tbody += "<td><button class='btn btn-warning'><i class='fa fa-sign-in'></i></button></td>";
				tbody += "</tr>";
			});
			$("#tblAdmittedIPDPatient tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetSetInfoByCart() {
	$("#tblSetInfo tbody").empty();
	$("#tblAssignedInfo tbody").empty();
	var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
	var objBO = {};
	objBO.Prm_1 = $("#ddlCartList option:selected").val();
	objBO.Logic ='GetSetInfoByCartId';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					var tbody = "";
					var count = 0;
					var tranId = '';
					$.each(data.ResultSet.Table, function (key, val) {
						count++;
						tbody += "<tr>";
						tbody += "<td>" + count + "</td>";
						tbody += "<td style='display:none'>" + val.tran_id + "</td>";
						tbody += "<td>" + val.SetId + "</td>";
						tbody += "<td>" + val.SetName + "</td>";
						tbody += "<td>" + val.batch_no + "</td>";
						tbody += "<td>" + val.exp_date + "</td>";
						tbody += "<td><input type='checkbox'/></td>";
						tbody += "</tr>";
					});
					$("#tblSetInfo tbody").append(tbody);					
				}
				//Assigned List									
				if (Object.keys(data.ResultSet).length > 0) {
					if (Object.keys(data.ResultSet.Table1).length > 0) {
						var html = "";
						var counter = 0;
						$.each(data.ResultSet.Table1, function (key, val) {
							counter++;
							html += "<tr>";
							html += "<td>" + counter + "</td>";
							html += "<td style='display:none'>" + val.tran_id + "</td>";
							html += "<td style='display:none'>" + val.CartId + "</td>";
							html += "<td>" + val.SetId + "</td>";
							html += "<td>" + val.SetName + "</td>";
							html += "<td>" + val.batch_no + "</td>";
							html += "<td>" + val.exp_date + "</td>";
							html += "<td>" + val.IPDNo + "</td>";
							html += "<td>" + val.patient_name + "</td>";
							html += "<td>" + val.DoctorName + "</td>";
							html += "<td>" + val.doc_date + "</td>";
							html += "<td><input type='checkbox'/></td>";
							html += "</tr>";
						});
						$("#tblAssignedInfo tbody").append(html);
					}
				}
			}
		},
		error: function(response) {
			alert('Server Error...!');
		}
	});
}
function Assign() {
	if (confirm('Are you sure to Assign?')) {
		var url = config.baseUrl + "/api/cssd/CSSD_ItemDispatchAndReceive";
		var objBO = [];
		$('#tblSetInfo tbody tr').find('input[type=checkbox]:checked').each(function () {
			objBO.push({
				'TrnNo': $(this).closest('tr').find('td:eq(1)').text(),
				'SetId': $(this).closest('tr').find('td:eq(2)').text(),
				'BatchNo': $(this).closest('tr').find('td:eq(4)').text(),
				'expDate': $(this).closest('tr').find('td:eq(5)').text(),
				'IPDNo': $('#txtIPDNo').text(),
				'Prm_1': $('#txtPatientName').text(),
				'Prm_2': $('#txtDoctorName').text(),
				'hosp_id': Active.unitId,
				'login_id': Active.userId,
				'Logic': "AssignIPD"
			});
		});
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Success')) {
					alert(data);
					GetSetInfoByCart();
				}
				else {
					alert(data);
				};
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
function ReturnToInspection() {
	if (confirm('Are you sure want to Return?')) {
		var url = config.baseUrl + "/api/cssd/CSSD_ItemDispatchAndReceive";
		var objBO = [];
		$('#tblAssignedInfo tbody tr').find('input[type=checkbox]:checked').each(function () {
			objBO.push({
				'TrnNo': $(this).closest('tr').find('td:eq(1)').text(),
				'FromCart': $(this).closest('tr').find('td:eq(2)').text(),
                'ToCart': Active.CSSDInspectionCartId,
				'SetId': $(this).closest('tr').find('td:eq(3)').text(),
				'BatchNo': $(this).closest('tr').find('td:eq(5)').text(),
				'expDate': $(this).closest('tr').find('td:eq(6)').text(),
				'qty': 1,
				'ItemType': 'Set',
				'IPDNo': $('#txtIPDNo').text(),
				'Prm_1': $('#txtPatientName').text(),
				'Prm_2': $('#txtDoctorName').text(),
				'hosp_id': Active.unitId,
				'login_id': Active.userId,
				'Logic': "Dispatch",
			});
		});
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Success')) {
					alert(data);	
					GetSetInfoByCart();
				}
				else {
					alert(data);
				};
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
