
$(document).ready(function () {
	OnLoad();
	$('#ddlCart').empty().append($('<option>Select Cart</option>')).select2();
	$('#txtSearch').on('keyup', function () {
		var val = $(this).val().toLocaleLowerCase();
		$('#tblAuditMaster tbody tr').filter(function () {
			$(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
		});
	});
	$('#ddlDept').on('change', function () {
		DeptId = $(this).find('option:selected').val();
		GetCartByDept(DeptId);
	});
});

function OnLoad() {
    var url = config.baseUrl + "/api/warehouse/wh_AuditQueries";
	var objBO = {};
	objBO.Logic = "OnLoad";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#ddlDept').empty().append($('<option>Select Department</option>'));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlDept').append($('<option></option>').val(val.DeptId).html(val.DeptName)).select2();
			})
			$('#tblAuditMaster tbody').empty();
			var tbody = "";
			$.each(data.ResultSet.Table1, function (key, val) {
				tbody += "<tr>";
				tbody += "<td>" + val.audit_no + "</td>";
				tbody += "<td>" + val.audit_remark + "</td>";
				tbody += "<td>" + val.cr_date + "</td>";
				tbody += "<td><button class='btn-danger btn-xs' onclick=DeleteAuditMaster('" + val.audit_no + "')>Delete</button></td>";
				tbody += "</tr>";
			});
			$('#tblAuditMaster tbody').append(tbody);
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}

function GetCartByDept(DeptId) {
    var url = config.baseUrl + "/api/warehouse/wh_AuditQueries";
	var objBO = {};
	objBO.DeptId = DeptId;
	objBO.Logic = "GetCartByDept";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#ddlCart').empty().append($('<option>Select Cart</option>'));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlCart').append($('<option></option>').val(val.CartId).html(val.CartName)).select2();
			})
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}

function InsertAuditMaster() {
	if (validate()) {
        var url = config.baseUrl + "/api/warehouse/wh_InsertAuditMaster";
		var objBO = {};
		objBO.CartId = $('#ddlCart option:selected').val();
		objBO.audit_no = '';
		objBO.audit_remark = $('#txtRemark').val();
		objBO.login_id = Active.userId;
		objBO.IsOpen = 'OPEN';
		objBO.Logic = "Insert";
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				alert(data);
				OnLoad();
				$('#txtRemark').val('');
			},
			error: function (err) {
				alert(err.responseText);
			}
		});
	}
}

function DeleteAuditMaster(auditno) {
	
    var url = config.baseUrl + "/api/warehouse/wh_InsertAuditMaster";
	var objBO = {};
	objBO.audit_no = auditno;
	objBO.Logic = "Delete";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			OnLoad();
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function validate() {
	Cart = $('#ddlCart option:selected').val();

	if (Cart == 'Select Cart') {
		$('span.selection').find('span[aria-labelledby=select2-ddlCart-container]').css('border-color', 'red').focus();
		alert('Please Select Department And Cart');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlCart-container]').removeAttr('style');
	}
	return true;
}