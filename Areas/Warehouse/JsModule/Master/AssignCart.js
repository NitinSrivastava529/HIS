$(document).ready(function () {
    CloseSidebar();
	GetWhaereHouseCartList();
	GetCartAfterLinkToEmployee();
	$('#tblwhCartListCopy').hide();
	$('#txtSearchCart1').on('keyup', function () {
		
		var val = $(this).val().toLowerCase();
		$('#tblwhCartList  tbody tr').filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
		});
	});

});

function SearchEmployee() {
	var empname = $("#txtEmpName").val();
	if (empname != "" && typeof empname != 'undefined' && empname != null) {
		GetEmpDetails(empname);
	}
	else {
		alert('Please enter employee Name');
		return false;
	}
}
function GetEmpDetails(empName) {
	var url = config.baseUrl + "/api/ApplicationResource/MenuQueries";
	var objBO = {};
	objBO.Prm1 = empName,
		objBO.Logic = 'GetEmployee';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: 'application/json;charset=utf-8',
		dataType: "JSON",
		success: function (data) {
			
			if (data != '') {
				$('#ddlEmp').empty().append($('<option>Select Employee</option>'));
				$.each(data.ResultSet.Table, function (key, val) {
					$('#txtEmpName').val('');
					$('#ddlEmp').append($('<option></option>').val(val.emp_code).html(val.emp_name));
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

function EmpAsgnToCart() {
	var ddlempval = $("#ddlEmp option:selected").val();
	if (ddlempval == "") {
		alert('Please select employee');
		return false;
	}

	if ($('.cartlist:checkbox:checked').length == 0) {
		alert('Please select at least one checkbox on left side');
		return false;
	}
	$('#tblwhCartListCopy').show();
	$('#tblwhCartListCopy tbody').empty();
	var grid = document.getElementById("tblwhCartList");
	var checkBoxes = grid.getElementsByTagName("INPUT");
	var cartids = "";
	for (var i = 0; i < checkBoxes.length; i++) {
		if (checkBoxes[i].checked) {
			var row = checkBoxes[i].parentNode.parentNode;
			cartids += row.cells[1].innerHTML + ",";
		}
	}
	cartids = cartids.replace(/,\s*$/, "");
	//alert(cardids);
	var objEmpCartLinkBO = {};
	objEmpCartLinkBO.login_id = Active.userId;
	objEmpCartLinkBO.hosp_id = Active.unitId;
	objEmpCartLinkBO.EmpCode = ddlempval;
	objEmpCartLinkBO.CartIds = cartids;
	objEmpCartLinkBO.Logic = "Insert";

	var url = config.baseUrl + "/api/Warehouse/InsertUpdateEmployeeCartLink";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objEmpCartLinkBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data == 'Insert') {
				alert('Employee link to cart successfully');
				GetCartAfterLinkToEmployee();
			}
			else {
				//alert(data);
				GetCartAfterLinkToEmployee();
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
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
			if (data.ResultSet.Table.length > 0) {
				$('#tblwhCartList').show();
				$('#tblwhCartList tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {
					htmldata += '<tr>';
					htmldata += '<td><input type="checkbox" class="checkbox cartlist"/> </td>';
					htmldata += '<td>' + val.CartId + '</td>';
					htmldata += '<td>' + val.CartType + '</td>';
					htmldata += '<td>' + val.CartName + '</td>';
					htmldata += '<td>' + val.Createdon + '</td>';
					htmldata += '<td style="display:none">' + val.auto_id + '</td>';
					htmldata += '</tr>';
				});
				$('#tblwhCartList tbody').append(htmldata);
			}
			else {
				$('#tblwhCartList').show();
				$('#tblwhCartList tbody').empty();
				htmldata += '<tr>';
				htmldata += '<td colspan="6" style="color:red">' + "No record found" + '</td>';
				htmldata += '</tr>';
				$('#tblwhCartList tbody').append(htmldata);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

function GetCartAfterLinkToEmployee() {

	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objLinkCartBO = {};
	objLinkCartBO.Logic = "GetWhEmployeeLinkToCart";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objLinkCartBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var htmldata = "";
			if (data.ResultSet.Table.length > 0) {
				$('#tblwhCartListCopy').show();
				$('#tblwhCartListCopy tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {
					htmldata += '<tr>';
					htmldata += '<td><input type="checkbox" class="checkbox cartdata"/> </td>';
					htmldata += '<td>' + val.emp_code + '</td>';
					htmldata += '<td>' + val.emp_name + '</td>';
					htmldata += '<td>' + val.CartId + '</td>';
					htmldata += '<td>' + val.CartType + '</td>';
					htmldata += '<td>' + val.CartName + '</td>';
					htmldata += '<td>' + val.Createdon + '</td>';
					htmldata += '<td style="display:none">' + val.auto_id + '</td>';
					htmldata += '</tr>';
				});
				$('#tblwhCartListCopy tbody').append(htmldata);
			}
			else {
				$('#tblwhCartListCopy').show();
				$('#tblwhCartListCopy tbody').empty();
				htmldata += '<tr>';
				htmldata += '<td colspan="7" style="color:red">' + "No record found" + '</td>';
				htmldata += '</tr>';
				$('#tblwhCartListCopy tbody').append(htmldata);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});

}

function EmployeeDeattachToCart() {
	var ddlempval = $("#ddlEmp option:selected").val();

	if ($('.cartdata:checkbox:checked').length == 0) {
		alert('Please select at least one checkbox on right side');
		return false;
	}

	var grid = document.getElementById("tblwhCartListCopy");
	var checkBoxes = grid.getElementsByTagName("INPUT");
	var cartids = "";
	for (var i = 0; i < checkBoxes.length; i++) {
		if (checkBoxes[i].checked) {
			var row = checkBoxes[i].parentNode.parentNode;
			cartids += row.cells[3].innerHTML + ",";
		}
	}
	cartids = cartids.replace(/,\s*$/, "");
	//alert(xmldata);
	var objEmpCartLinkdel = {};
	objEmpCartLinkdel.login_id = Active.userId;
	objEmpCartLinkdel.hosp_id = Active.unitId;
	objEmpCartLinkdel.EmpCode = ddlempval;
	objEmpCartLinkdel.CartIds = cartids;
	objEmpCartLinkdel.Logic = "Delete";

	var url = config.baseUrl + "/api/Warehouse/InsertUpdateEmployeeCartLink";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objEmpCartLinkdel),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			alert(data);
			GetCartAfterLinkToEmployee();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});

}









