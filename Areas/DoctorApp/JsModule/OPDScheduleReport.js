$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	GetDoctorList();
});

function GetDoctorList() {
	var url = config.baseUrl + "/api/DoctorApp/Doctor_AppQuerries";
	var objBO = {};
	objBO.emp_code = "-";
	objBO.Password = "-";
	objBO.DoctorId = "-";
	objBO.from = $("#txtFrom").val();
	objBO.to = $("#txtTo").val();
	objBO.Prm1 = "-";
	objBO.Prm2 = "-";
	objBO.Logic = "GetDoctorList";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$("#ddlDoctor").append($("<option></option>").val("ALL").html("ALL")).select2();
					$.each(data.ResultSet.Table, function (key, value) {
						$("#ddlDoctor").append($("<option></option>").val(value.DoctorId).html(value.DoctorName));
					});
				}
			}			
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DownloadXL() {
	var url = config.baseUrl + "/api/DoctorApp/Doctor_AppQuerries";
	var objBO = {};
	objBO.emp_code = "-";
	objBO.Password = "-";
	objBO.DoctorId = $("#ddlDoctor option:selected").val();
	objBO.from = $("#txtFrom").val();
	objBO.to = $("#txtTo").val();
	objBO.ReportType = "Excel";
	objBO.Prm1 = "-";
	objBO.Prm2 = "-";
	objBO.Logic = "OPDScheduleReport";	
	Global_DownloadExcel(url, objBO, "OPDScheduleReport.xlsx");
}