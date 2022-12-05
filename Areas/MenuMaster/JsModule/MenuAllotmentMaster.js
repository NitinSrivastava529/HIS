$(document).ready(function () {
	GetMenuAndEmpGroup();
	$(document).on('change', 'input:checkbox', function () {
		var Ischeck = $(this).is(':checked');
		if (!Ischeck) {
			$(this).parents('ul').prev('label').find('input:checkbox').prop('checked', false);
		}
		else {
			$(this).parents('ul').prev('label').find('input:checkbox').prop('checked', true);
		}
	});
});

function GetMenuAndEmpGroup() {
	var url = config.baseUrl + "/api/Master/MenuMasterQueries";
	var objBO = {};
	objBO.GroupId = '-';
	objBO.GroupName = '-';
	objBO.GroupFor = '-';
	objBO.GroupItemId = '-';
	objBO.IsActive = 1;
	objBO.Logic = 'GetMenuAndEmpGroup';
	$.ajax({
		method: "POST",
		url: url, 
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#ddlMenuGroup').empty().append($('<option></option>').val(00).html('Select Group'));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlMenuGroup').append($('<option></option>').val(val.GroupId).html(val.GroupName)).select2();
			});			
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetAllotedMenuInfo() {
	var url = config.baseUrl + "/api/Master/GetAllotedMenuInfo";
	var objBO = {};
	objBO.GroupId = '-';
	objBO.GroupName = '-';
	objBO.GroupFor = '-';
	objBO.GroupItemId = '-';
	objBO.Prm1 = $('#ddlMenuGroup option:selected').val();
    objBO.Prm2 = '-';
	objBO.IsActive = 1;
	objBO.Logic = 'GetAllotedMenuInfo';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data);
			$('#rolePanel').empty();
			$('#rolePanel').append(data);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

function AllotSubMenuToEmployee() {
	var url = config.baseUrl + "/api/ApplicationResource/AllotSubMenuToEmployee";
	var objBO = [];
	$("#rolePanel ul ul input:checkbox:checked").each(function () {
		objBO.push({
			'EmpCode': $(this).parents('.panel-body').parents('.panel-body').parents('div').attr('id'),
			'SubMenuId': $(this).data('submenuid')
		});  
	});
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: 'application/json;charset=utf-8',
		dataType: "JSON",
		success: function (data) {			
			alert('success')
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}