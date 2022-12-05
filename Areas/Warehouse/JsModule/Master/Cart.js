
$(document).ready(function () {	
	//$('#tblwhDeptList').hide();
	GetWhaereHouseDepartmentList();
	GetWhaereHouseCartList();
});

function ValidateWHDept() {
	
	var deptname = $("#txtDeptName").val();
	if (deptname == "") {
		alert('Please enter department name');
		return false;
	}
	return true;
}
function ValidateWHCart() {
	
	var deptId = $("#ddlDept option:selected").val();
	var carttype = $("#ddlCartType option:selected").val();
	var cartname = $("#txtCartName").val();
	if (deptId == "" || deptId == "0") {
		alert('Please select deparment');
		return false;
	}
	if (carttype == "") {
		alert('Please select cart type');
		return false;
	}
	if (cartname == "") {
		alert('Please enter cart name');
		return false;
	}
	return true;
}

function AddWhDepartment() {
	
	var flag = ValidateWHDept();
	if (flag) {
		
		var autoId = $("#hideditauto").val();
		var url = config.baseUrl + "/api/Warehouse/InsertUpdateWHDepartment";
		var objDeptBO = {};
		objDeptBO.DeptName = $("#txtDeptName").val().toUpperCase();
		objDeptBO.login_id = Active.userId;
		objDeptBO.hosp_id = Active.unitId;
		if (autoId != "" && typeof autoId != 'undefined' && autoId > 0) {
			objDeptBO.Logic = "Update";
			objDeptBO.autoId = autoId;
		}
		else {
			objDeptBO.Logic = "Insert";
		}
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objDeptBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data == 'Insert') {
					alert('Wharehouse department added successfully');
					ClearDepartment();
					GetWhaereHouseDepartmentList();
				}
				else if (data == 'Update') {
					alert('Wharehouse department updated successfully');
					ClearDepartment();
					GetWhaereHouseDepartmentList();
					$("#hideditauto").val("0");
				}
				else {
					alert(data);
				}
			},
			complete: function () {
				$('#btnSaveUpdateDept').val('Save').attr('class', 'btn-primary');
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}

function GetWhaereHouseDepartmentList() {
	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objDeptBO = {};
	objDeptBO.Logic = "GetWHDepartment";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objDeptBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			var htmldata = "";
			if (data.ResultSet.Table.length > 0) {
				$('#tblwhDeptList').show();
				$('#tblwhDeptList tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {
					htmldata += '<tr>';
					htmldata += '<td>' + val.DeptId + '</td>';
					htmldata += '<td>' + val.DeptName + '</td>';
					htmldata += '<td>' + val.Createdon + '</td>';
					htmldata += '<td class="input-group-btn">' +
						'<a class="btn btn-primary btn-xs" href="javascript:void(0)" onclick = "EditWhDepartment(' + "'" + val.auto_id + "'" + ',' + "'" + val.DeptName + "'" + ')" > <i class="fa fa-edit fa-lg"></i></a >' +
						'&nbsp;&nbsp;<a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="DeleteWhDepartment(' + "'" + val.auto_id + "'" + ')"><i class="fa fa-remove fa-lg"></i></a></td>';
					htmldata += '</tr>'
				});
				$('#tblwhDeptList tbody').append(htmldata);
				/* Bind Department Dropdown */
				$("#ddlDept option").remove();
				var items = "";
				items += "<option value='0'>Select Department</option>";
				$.each(data.ResultSet.Table, function (key, val) {
					items += "<option value='" + val.DeptId + "'>" + val.DeptName + "</option>";
				});
				$("#ddlDept").append(items);
			}			
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function EditWhDepartment(id, deptname) {
	if (id > 0) {
		$("#txtDeptName").val(deptname);
		$("#hideditauto").val(id);
		$('#btnSaveUpdateDept').val('Update').attr('class', 'btn-warning');
	}
}
function DeleteWhDepartment(id) {
	
	var url = config.baseUrl + "/api/Warehouse/DeleteWharehouseDepartment";
	var objDeptBO = {};
	objDeptBO.autoId = id;
	objDeptBO.login_id = Active.userId;
	objDeptBO.hosp_id = Active.unitId;
	objDeptBO.Logic = "Delete";
	if (confirm("Are you sure want to delete?")) {
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objDeptBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data == 'Delete') {
					alert('Wharehouse department deleted successfully');
					GetWhaereHouseDepartmentList();
					ClearDepartment();
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
function ClearDepartment() {
	$("#txtDeptName").val('');
}

function SearchDepartment(element) {
	var searchText = $(element).val().toLowerCase();
	$.each($("#tblwhDeptList tbody tr"), function () {
		if ($(this).text().toLowerCase().indexOf(searchText) === -1)
			$(this).hide();
		else
			$(this).show();
	});
}

function AddWhCart() {
	var flag = ValidateWHCart();
	if (flag) {
		var autoId = $("#hidcartautoId").val();
		var url = config.baseUrl + "/api/Warehouse/InsertUpdateWHCart";
		var objCartBO = {};
		objCartBO.DeptId = $("#ddlDept option:selected").val();
		objCartBO.CartType = $("#ddlCartType option:selected").val();
		objCartBO.CartName = $("#txtCartName").val().toUpperCase();
		objCartBO.login_id = Active.userId;
		objCartBO.hosp_id = Active.unitId;
		if (autoId != "" && typeof autoId != 'undefined' && autoId > 0) {
			objCartBO.Logic = "Update";
			objCartBO.autoId = autoId;
		}
		else {
			objCartBO.Logic = "Insert";
		}
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objCartBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data == 'Insert') {
					alert('Wharehouse Cart added successfully');
					ClearCart();
					GetWhaereHouseCartList();
				}
				else if (data == 'Update') {
					alert('Wharehouse Cart updated successfully');
					ClearCart();
					$("#hidcartautoId").val("0");
					GetWhaereHouseCartList();
				}
				else {
					alert(data);
				};
			},
			complete: function () {
				$('#btnSaveSection').val('Save').attr('class', 'btn-primary');
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}

function GetWhaereHouseCartList() {
	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objCartBO = {};
	objCartBO.Logic = "GetWharehouseCart";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objCartBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			var htmldata = "";
			var temp = "";
			if (data.ResultSet.Table.length > 0) {
				$('#tblwhCartList').show();
				$('#tblwhCartList tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {

					if (temp != val.DeptName) {
						htmldata += '<tr style="background:#dbefff">';
						htmldata += '<td colspan="5">' + val.DeptName + '</td>';
						htmldata += '</tr>';
						temp = val.DeptName;
					}
					htmldata += '<tr>';
					htmldata += '<td>' + val.CartId + '</td>';
					htmldata += '<td>' + val.CartType + '</td>';
					htmldata += '<td>' + val.CartName + '</td>';
					htmldata += '<td>' + val.Createdon + '</td>';
					htmldata += '<td class="input-group-btn">' +
						'<a class="btn btn-primary btn-xs" href="javascript:void(0)" onclick = "EditWhCart(' + "'" + val.auto_id + "'" + ',' + "'" + val.DeptId + "'" + ',' + "'" + val.CartType + "'" + ',' + "'" + val.CartName + "'" + ')" > <i class="fa fa-edit fa-lg"></i></a >' +
						'&nbsp;&nbsp;<a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="DeleteWhCart(' + "'" + val.auto_id + "'" + ')"><i class="fa fa-remove fa-lg"></i></a></td>';
					htmldata += '</tr>'
				});
				$('#tblwhCartList tbody').append(htmldata);
			}			
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

function EditWhCart(autoid, DeptId, CartType, CartName) {
	if (autoid > 0) {
		$("#ddlDept").val(DeptId);
		$("#ddlCartType").val(CartType);
		$("#txtCartName").val(CartName);
		$("#hidcartautoId").val(autoid);
		$('#btnSaveSection').val('Update').attr('class', 'btn-warning');
	}
}
function DeleteWhCart(id) {
	
	var url = config.baseUrl + "/api/Warehouse/DeleteWharehouseCart";
	var objDeptBO = {};
	objDeptBO.autoId = id;
	objDeptBO.login_id = Active.userId;
	objDeptBO.hosp_id = Active.unitId;
	objDeptBO.Logic = "Delete";
	if (confirm("Are you sure want to delete?")) {
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objDeptBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data == 'Delete') {
					alert('Cart deleted successfully');
					GetWhaereHouseCartList();
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
function ClearCart() {
	$("#ddlDept").val("0");
	$("#ddlCartType").prop('selectedIndex','0');
	$("#txtCartName").val('');
}

function SearchCart(element) {
	var searchText = $(element).val().toLowerCase();
	$.each($("#tblwhCartList tbody tr"), function () {
		if ($(this).text().toLowerCase().indexOf(searchText) === -1)
			$(this).hide();
		else
			$(this).show();
	});
}


