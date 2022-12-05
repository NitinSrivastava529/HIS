
$(document).ready(function () {
	CloseSidebar();
	var url = window.location.href;
	if (url.includes('complcode=')) {
		let complcode = atob(query()['complcode'])
		if (complcode != '') {
			AllComplaintCommunication(complcode);
		}
	}

	$('#btnTrace').on('click', function () {
		let ComplCode = $('#txtComplaintCode').val();
		AllComplaintCommunication(ComplCode);
	});
	searchTable('txtSearchComplaint', 'tblTraceComplaint');
	$('#tblTraceComplaint tbody').on('click', 'td,button', function () {
		selectRow($(this));
		complcode = $(this).closest('tr').find('td:eq(1)').text();
		ComplaintAction(complcode);
	});
});

function AllComplaintCommunication(ComplCode) {
	$("#tblTraceComplaint tbody").empty();
	$("#tblComplaintInfo tbody").empty();
	var url = config.baseUrl + "/api/Asset/HospitalComplaints";
	var objBO = {};
	var from = new Date();
	var to = new Date();
	objBO.ComplCode = '-';
	objBO.prm_1 = ComplCode;
	objBO.from = from;
	objBO.to = to;
	objBO.login_id = Active.userId;
	objBO.Logic = "TraceComplaint";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$("#tblTraceComplaint tbody").empty();
				var tbody = "";
				var temp = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.eq_no + "</td>";
					tbody += "<td>" + val.compl_code + "</td>";
					tbody += "<td>" + val.Complaint + "</td>";
					tbody += "<td>" + val.cr_date + "</td>";
					tbody += "<td>" + val.client_status + "</td>";
					tbody += "<td>" + val.client_close_date + "</td>";
					tbody += "<td>" + val.close_date + "</td>";
					tbody += "<td>" + val.close_by + "</td>";
					tbody += "<td>" + val.amount + "</td>";
					tbody += "<td>" + val.ac_flag + "</td>";
					tbody += "<td>" + val.acFlag_date + "</td>";
					tbody += "<td>" + val.acLoginBy + "</td>";
					tbody += "<td><button class='btnArrow' data-complcode=" + val.compl_code + "><span class='fa fa-arrow-right'></span></button></td>";
					tbody += "</tr>";
				});
				$("#tblTraceComplaint tbody").append(tbody);
				$.each(data.ResultSet.Table1, function (key, val) {
					$('span[data-unit]').text('Unit Name :' + val.unit_name);
				});
			}
			else {
				alert("Data Not Found");
			};
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ComplaintAction(complcode) {
	var url = config.baseUrl + "/api/Asset/HospitalComplaints";
	var objBO = {};
	var from = new Date();
	var to = new Date();
	objBO.ComplCode = '-';
	objBO.prm_1 = complcode;
	objBO.from = from;
	objBO.to = to;
	objBO.login_id = Active.userId;
	objBO.Logic = "Complaint_action";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$("#tblComplaintInfo tbody").empty();
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.cr_date + "</td>";
					tbody += "<td>" + val.remarks + "</td>";
					tbody += "<td>" + val.emp_name + "</td>";
					tbody += "</tr>";
				});
				$("#tblComplaintInfo tbody").append(tbody);
			}
			else {
				alert("Data Not Found");
			};
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

function query() {
	var vars = [], hash;
	var url = window.location.href.replace('#', '');
	var hashes = url.slice(url.indexOf('?') + 1).split('&');
	for (i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[decodeURIComponent(hash[0])] = decodeURIComponent(hash[1]);
	}
	return vars;
}