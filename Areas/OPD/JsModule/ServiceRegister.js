$(document).ready(function () {
	CloseSidebar();
	$('select').select2();
	FillCurrentDate("txtSearchFrom");
	FillCurrentDate("txtSearchTo");
	$('#btnSearchByOption').click(function () {
		SearchByKey();
	});
	$('#btnSearchByDate').click(function () {
		SearchByDate();
	}); 
});
function SearchByKey() {
	$('#tblServiceRegister tbody').empty();
	var url = config.baseUrl + "/api/Service/Opd_ServiceQueries";
	var objBO = {};
	objBO.SearcKey = '';
	objBO.SearchValue = $('#txtSearchValue').val();
	objBO.from = $('#txtSearchFrom').val();
	objBO.to = $('#txtSearchTo').val();
	objBO.prm_1 = '-';
	objBO.Logic = 'SearchByKey';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		async: false,
		success: function (data) {
			
			if (data.ResultSet.Table.length > 0) {			
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.UHID + "</td>";
					tbody += "<td>" + val.patient_name + "</td>";
					tbody += "<td>" + val.DoctorName + "</td>";
					tbody += "<td>" + val.Age + "</td>";
					tbody += "<td>" + val.mobile_no + "</td>";	
					tbody += "<td>" + val.visitNo + "</td>";							
					tbody += "<td>" + val.VisitDate + "</td>";
					tbody += "<td class='text-right'>" + val.GrossAmount + "</td>";		
					tbody += "<td class='text-right'>" + val.discount + "</td>";		
					tbody += "<td class='text-right'>" + val.NetAmount + "</td>";		
					tbody += "<td class='text-right'>" + val.Received + "</td>";		
					tbody += "<td>" + val.TnxId + "</td>";
					tbody += "<td>" + val.trnStatus + "</td>";
					tbody += "<td class='flex'>";			
					tbody += "<button class='btn-info btn-flat' onclick=Receipt('" + val.TnxId + "')>Print</button>";
					tbody += "</td>";
					tbody += "</tr>";
				});
				$('#tblServiceRegister tbody').append(tbody);
			}
			else {
				$('#tblServiceRegister tbody').empty();
				alert("Data Not Found..");
			};
		},
		//complete: function (data) {
		//	$.each(data.responseText.ResultSet.Table, function (key, val) {
		//		alert(val.IsTnxId)
		//	});
		//},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function SearchByDate() {
	$('#tblServiceRegister tbody').empty();
	var url = config.baseUrl + "/api/Service/Opd_ServiceQueries";
	var objBO = {};
	objBO.SearcKey = '';
	objBO.DoctorId = Active.doctorId;
	objBO.SearchValue = '-';
	objBO.from = $('#txtSearchFrom').val();
	objBO.to = $('#txtSearchTo').val();
	objBO.prm_1 ='-';
	objBO.Logic = 'SearchByDate';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		async: false,
		success: function (data) {
			
			if (data.ResultSet.Table.length > 0) {			
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.UHID + "</td>";
					tbody += "<td>" + val.patient_name + "</td>";
					tbody += "<td>" + val.DoctorName + "</td>";
					tbody += "<td>" + val.Age + "</td>";
					tbody += "<td>" + val.mobile_no + "</td>";
					tbody += "<td>" + val.visitNo + "</td>";
					tbody += "<td>" + val.VisitDate + "</td>";
					tbody += "<td class='text-right'>" + val.GrossAmount + "</td>";
					tbody += "<td class='text-right'>" + val.discount + "</td>";
					tbody += "<td class='text-right'>" + val.NetAmount + "</td>";
					tbody += "<td class='text-right'>" + val.Received + "</td>";
					tbody += "<td>" + val.TnxId + "</td>";
					tbody += "<td>" + val.trnStatus + "</td>";
					tbody += "<td class='flex'>";
					tbody += "<button class='btn-info btn-flat' onclick=Receipt('" + val.TnxId + "')>Print</button>";
					tbody += "</td>";
					tbody += "</tr>";
				});
				$('#tblServiceRegister tbody').append(tbody);
			}
			else {
				$('#tblOPDRegister tbody').empty();
				alert("Data Not Found..");
			};
		},
		complete: function (data) {
			$.each(data.responseJSON.ResultSet.Table, function (key, val) {
				if (val.IsReschedule == '1')
					$('#tblServiceRegister tbody').find('tr:eq(' + key + ')').find('td:eq(0),td:eq(1),td:eq(2),td:eq(3),td:eq(4),td:eq(5),td:eq(6),td:eq(7),td:eq(8),td:eq(9),td:eq(10),td:eq(11)').addClass('row-green');
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function Receipt(tnxid) {
	var url = "../Print/ServiceReceipt?visitNo=" + tnxid;
	window.open(url, '_blank');
}
