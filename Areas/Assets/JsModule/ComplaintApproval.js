
$(document).ready(function () {
	CloseSidebar();
	AllComplaintCommunication();
    searchTable('txtSearchComplaint', 'tblAssetComplaint'); 

	$('#tblAssetComplaint tbody').on('click', 'button', function () {
		//complcode = $(this).closest('tr').find('button').data('complcode');
		//unit = $(this).closest('tr').find('button').data('unit');
		//$('span[data-unit]').text(unit);
		//$('span[data-complaintcode]').text(complcode);
		//selectRow($(this));
		//ComplaintInfo(complcode);
        $('span[data-dept]').text($(this).data('dept'));
        $('span[data-section]').text($(this).data('section'));
        $('span[data-eqno]').text($(this).data('eqno'));
        $('span[data-eqcategory]').text($(this).data('eqcategory'));
        $('span[data-description]').text($(this).data('description'));
        $('span[data-note]').text($(this).data('note'));
        $('span[data-complcode]').text($(this).data('complcode'));
        GetRemarkByComplCode($(this).data('complcode'));
	});
	$('#btnTrackComplaint').on('click', function () {
		complcode = $('#tblAssetComplaint tbody').find('tr.select-row').find('td:eq(1)').text();
		var url = "ComplaintTracing?complcode=" + btoa(complcode);
		window.open(url);
	});
	$('#btnSearch').on('click', function () {
		let ComplCode = $('#txtEqNo').val();
		ComplaintsByParameter(ComplCode);
	});
});

function AllComplaintCommunication() {
	var url = config.baseUrl + "/api/Asset/HospitalComplaints";
	var objBO = {};
	var from = new Date();
	var to = new Date();
	objBO.eqNo = '-';
	objBO.ComplCode = '-';
	objBO.prm_1 = '-';
	objBO.from = from;
	objBO.to = to;
	objBO.login_id = 'CHCL-00632';
	objBO.Logic = "PendingApproval";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$("#tblAssetComplaint tbody").empty();
				var tbody = "";
				var temp = "";
				$.each(data.ResultSet.Table, function (key, val) {
					if (temp != val.unit_name) {
						tbody += "<tr style='background:#e1ffff'>";
						tbody += "<td colspan='7'>" + val.unit_name + "</td>";
						tbody += "</tr>";
						temp = val.unit_name;
					}
					tbody += "<tr>";
					tbody += "<td>" + val.cr_date + "</td>";
					tbody += "<td>" + val.eq_no + "</td>";
					tbody += "<td>" + val.compl_code + "</td>";
					tbody += "<td>" + val.eq_category + "</td>";
					tbody += "<td>" + val.asset_name + "</td>";
					tbody += "<td>" + val.complaint + "</td>";
					//tbody += "<td><button class='btnArrow' data-complcode=" + val.compl_code + " data-unit='" + val.unit_name + "'><span class='fa fa-arrow-right'></span></button></td>";
                    tbody += "<td><button class='btnArrow' data-note='" + val.note + "' data-dept='" + val.DeptName + "' data-section='" + val.SectionName + "' data-eqno='" + val.eq_no + "' data-eqcategory='" + val.eq_category + "' data-description='" + val.eq_description + "' data-complcode='" + val.compl_code +"'><span class='fa fa-arrow-right'></span></button></td>";
					tbody += "</tr>";
				});
				$("#tblAssetComplaint tbody").append(tbody);
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
function ComplaintsByParameter(ComplCode) {
	var url = config.baseUrl + "/api/Asset/HospitalComplaints";
	var objBO = {};
	var from = new Date();
	var to = new Date();
	objBO.eqNo = '-';
	objBO.ComplCode = '-';
	objBO.prm_1 = ComplCode;
	objBO.from = from;
	objBO.to = to;
	objBO.login_id = 'CHCL-00632';
	objBO.Logic = "ComplaintsByParameter";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$("#tblAssetComplaint tbody").empty();
				var tbody = "";
				var temp = "";
				$.each(data.ResultSet.Table, function (key, val) {
					if (temp != val.unit_name) {
						tbody += "<tr style='background:#e1ffff'>";
						tbody += "<td colspan='7'>" + val.unit_name + "</td>";
						tbody += "</tr>";
						temp = val.unit_name;
					}
					tbody += "<tr>";
					tbody += "<td>" + val.cr_date + "</td>";
					tbody += "<td>" + val.eq_no + "</td>";
					tbody += "<td>" + val.compl_code + "</td>";
					tbody += "<td>" + val.eq_category + "</td>";
					tbody += "<td>" + val.asset_name + "</td>";
					tbody += "<td>" + val.complaint + "</td>";
					tbody += "<td><button class='btnArrow' data-complcode=" + val.compl_code + " data-unit='" + val.unit_name + "'><span class='fa fa-arrow-right'></span></button></td>";
					tbody += "</tr>";
				});
				$("#tblAssetComplaint tbody").append(tbody);
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
function ComplaintInfo(complcode) {
	var url = config.baseUrl + "/api/Asset/HospitalComplaints";
	var objBO = {};
	var from = new Date();
	var to = new Date();
	objBO.eqNo = '-';
	objBO.ComplCode = '-';
	objBO.prm_1 = complcode;
	objBO.from = from;
	objBO.to = to;
	objBO.login_id = Active.userId;
	objBO.Logic = "COMPLAINT_INFO";
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
					tbody += "<td>" + val.Remarks + "</td>";
					tbody += "</tr>";
				});
				$("#tblComplaintInfo tbody").append(tbody);
				$.each(data.ResultSet.Table1, function (key, val) {
					$('span[data-status]').text(val.Client_status);
					$('#btnInsertComplaint').attr('disabled', val.status);
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

function GetRemarkByComplCode(ComplCode) {
    var url = config.baseUrl + "/api/Asset/AssetsQueries";
    var objBO = {};
    objBO.ComplCode = ComplCode;
    objBO.Logic = "GetRemarkByComplCode";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#tblRemark tbody").empty();
            if (data != '') {
                
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.Remark_by + '</td><td>'
                        + val.Remarks + '</td><td>' + val.Cr_date + '</td></tr>').appendTo($("#tblRemark tbody"));
                });
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}