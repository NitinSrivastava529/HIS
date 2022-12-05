var availableTags = [];
$(document).ready(function () {
	GetGroupName();
	//$("#txtGroupFor").autocomplete({
	//	source: availableTags.join()
	//});
	GetGroupItems();	
	$('#txtGroupFor').on('keyup', function () {
		var empName = $(this).val();
		if (empName.length>2)
		GetEmpDetails(empName);
	});
});

function GetEmpDetails(empName) {	
	var url = config.baseUrl + "/api/ApplicationResource/MenuQueries";
	var objBO = {};
	objBO.Prm1 = empName,
	objBO.Logic = 'GetEmployee'
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: 'application/json;charset=utf-8',
		dataType: "JSON",
		success: function (data) {
			$('#ddlEmp').empty().append($('<option>Select Employee</option>'));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlEmp').val('');
				$('#ddlEmp').append($('<option></option>').val(val.emp_code).html(val.emp_name)).select2();
			});
		},		
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetGroupName() {
	var url = config.baseUrl + "/api/Master/MenuMasterQueries";
	var objBO = {};
	objBO.GroupId = '-';
	objBO.GroupName = '-';
	objBO.GroupFor = '-';
	objBO.GroupItemId = '-';
	objBO.IsActive = 1;
	objBO.Logic = 'GetGroupMasterForItem';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#ddlGroup').empty().append($('<option></option>').val(00).html('Select Group Name'));			
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlGroup').append($('<option></option>').val(val.GroupId).html(val.GroupName)).select2();
			});
			
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetGroupItems() {
	var url = config.baseUrl + "/api/Master/MenuMasterQueries";
	var objBO = {};
	objBO.GroupId = '-';
	objBO.GroupName = '-';
	objBO.GroupFor = '-';
	objBO.GroupItem = '-';
	objBO.IsActive = 1;
	objBO.Logic = 'GetGroupItems';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#tblGroupItem tbody').empty();
			var tbody = "";
			var count = 0;
			$.each(data.ResultSet.Table, function (key, val) {
				count++;
				tbody += "<tr>";
				tbody += "<td>" + count + "</td>";				
				tbody += "<td>" + val.GroupName + "</td>";
				tbody += "<td>" + val.Employee + "</td>";
				tbody += "<td><button onclick=DeleteItems(" + val.auto_id+") class='btn btn-danger btn-xs'><i class='fa fa-trash'></i></button></td>";
				tbody += "</tr>";
			});
			$('#tblGroupItem tbody').append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertGroupItems() {
	if (validation()) {
		var url = config.baseUrl + "/api/Master/InsertModifyMenuMaster";
		var objBO = {};
		objBO.GroupId = $('#ddlGroup option:selected').val();
		objBO.GroupName = '-';
		objBO.GroupFor = 'Employee';
		objBO.GroupItemId = $('#ddlEmp option:selected').val();
		objBO.IsActive = 1;
		objBO.Logic = 'InsertGroupItems';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('success')) {					
					GetGroupItems();
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
}
function DeleteItems(AutoId) {
	if (confirm('Are you sure to delete This Item..')) {
		var url = config.baseUrl + "/api/Master/InsertModifyMenuMaster";
		var objBO = {};
		objBO.AutoId = AutoId;
		objBO.Logic = 'DeleteGroupItems';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('success')) {
					GetGroupItems();
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
}

function validation() {
	var group = $('#ddlGroup option:selected').text();
	var item = $('#ddlEmp option:selected').text();
	if (group == 'Select Group Name') {
		alert('Please Choose Group Name');
		return false;
	}	
	if (item == 'Select Employee') {
		alert('Please Choose Employee');
		return false;
	}
	return true;
}