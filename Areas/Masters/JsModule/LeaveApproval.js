$(document).ready(function () {
	searchTable('txtSearch','tblDoctorLeave');	
	$('#tblDoctorLeave tbody').on('click', 'button', function () {
		if (confirm('Are you sure?')) {
			var autoId = $(this).closest('tr').find('td:eq(0)').text();
			var doctorId = $(this).closest('tr').find('td:eq(1)').text();
			var logic = $(this).attr('id');
			ApprCancelDoctorLeave(autoId, doctorId, logic)
		}	
	});
});
function GetDoctorLeaveForApproval() {
	$('#tblDoctorLeave tbody').empty();
	var url = config.baseUrl + "/api/master/DoctorMasterQueries";
	var objBO = {};
	objBO.hosp_id = Active.unitId;
	objBO.login_id = Active.userId;
	objBO.prm_1 = $("#ddlApproveType option:selected").val();
	objBO.Logic = "GetDoctorLeaveForApproval";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var htmldata = "";
			var DoctorId = ""
			if (data.ResultSet.Table.length > 0) {

				$.each(data.ResultSet.Table, function (key, val) {
					if (DoctorId != val.DoctorId) {
						htmldata += '<tr>';
						if (val.IsApproved != 'N')
							htmldata += '<td colspan="8" style="font-weight:bold;background-color:#f5ecd8">' + val.DoctorName + '</td>';
						else
							htmldata += '<td colspan="6" style="font-weight:bold;background-color:#f5ecd8">' + val.DoctorName + '</td>';

						htmldata += '</tr>';
						DoctorId = val.DoctorId;
					}
					if (val.IsApproved == 'Y')
						htmldata += '<tr class="bg-success">';
					else if (val.IsApproved == 'X')
						htmldata += '<tr class="bg-danger">';
					else
						htmldata += '<tr>';

					htmldata += '<td style="display:none">' + val.auto_id + '</td>';
					htmldata += '<td style="display:none">' + val.DoctorId + '</td>';
					htmldata += '<td style="display:none">' + val.IsApproved + '</td>';
					htmldata += '<td>' + val.leaveDate + '</td>';
					htmldata += '<td>' + val.start_time + '</td>';
					htmldata += '<td>' + val.end_time + '</td>';
					htmldata += '<td>' + val.Remark + '</td>';
					htmldata += '<td>' + val.cr_date + '</td>';
					if (val.IsApproved != 'N') {
						$('#tblDoctorLeave thead tr th:eq(5)').show();
						$('#tblDoctorLeave thead tr th:eq(6)').show();
						htmldata += '<td>' + val.ApprovedBy + '</td>';
						htmldata += '<td>' + val.ApprovedDate + '</td>';
					}
					else {
						$('#tblDoctorLeave thead tr th:eq(5)').hide();
						$('#tblDoctorLeave thead tr th:eq(6)').hide();
					}
					htmldata += '<td class="flex">';
					if (val.IsApproved == 'N') {
						htmldata += '<button id="ApproveLeave" class="btn btn-tbl btn-success btn-xs">Approve</button>&nbsp;';
						htmldata += '<button id="CancelLeave" class="btn btn-tbl btn-danger btn-xs">Cancel</button>';
					}
					else {
						htmldata += '-';
					}

					htmldata += '</td>';
					htmldata += '</tr>';
				});
				$('#tblDoctorLeave tbody').append(htmldata);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ApprCancelDoctorLeave(autoId, doctorId, logic) {
	var url = config.baseUrl + "/api/master/mCancelDoctorLeave";
	var objBO = {};
	objBO.autoid = autoId;
	objBO.hosp_id = Active.unitId;
	objBO.login_id = Active.userId;
	objBO.doctorId = doctorId;
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