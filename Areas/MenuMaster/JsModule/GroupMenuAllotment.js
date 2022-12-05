$(document).ready(function () {
	GetGroupName();
	$('#btnAllotSubmenuToGroup').on('click', function () {
		var Group = $('#ddlGroupMaster option:selected').text();
		if (Group == 'Select Group') {
			alert('Please Select Group..');
			$('#ddlGroupMaster').css('border-color', 'red');
		}
		else {
			AllotSubMenuToGroup();
		}
	});
});

function GetGroupName() {
	var url = config.baseUrl + "/api/Master/MenuMasterQueries";
	var objBO = {};
	objBO.GroupId = '-';
	objBO.GroupName = '-';
	objBO.GroupFor = '-';
	objBO.GroupItemId = '-';
	objBO.IsActive = 1;
	objBO.Logic = 'GetGroupMasterForMenu';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#ddlGroupMaster').empty().append($('<option></option>').val(00).html('Select Group'));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlGroupMaster').append($('<option></option>').val(val.GroupId).html(val.GroupName)).select2();
			});

		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetAllotedMenu() {
	var url = config.baseUrl + "/api/Master/AllotedMenu";
	var objBO = {};
	objBO.GroupId = $('#ddlGroupMaster option:selected').val();
	objBO.GroupName = '-';
	objBO.GroupFor = '-';
	objBO.GroupItemId = '-';
	objBO.IsActive = 1;
	objBO.Logic = 'GetAllotedMenu';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#roleAllotedPanel').empty();
			$('#roleAllotedPanel').append(data);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function AllotSubMenuToGroup() {
	var url = config.baseUrl + "/api/Master/AllotMenuToGroup";
	var objBO = [];
	$("#rolePanel ul ul input:checkbox:checked").each(function () {
		objBO.push({
			'GroupId': $('#ddlGroupMaster option:selected').val(),
			'GroupItemId': $(this).data('submenuid')
		});
	});
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: 'application/json;charset=utf-8',
		dataType: "JSON",
		success: function (data) {
			$("#rolePanel input:checkbox").prop("checked", false);
			GetAllotedMenu();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DeleteAllotedSubMenuByGroupId() {	
	var url = config.baseUrl + "/api/Master/InsertModifyMenuMaster";
	var objBO = {};
	var submenu = $("#roleAllotedPanel ul li input:checkbox:checked").map(function () {
		return $(this).data('submenuid')
	}).get();
	var SubMenuId = JSON.stringify(submenu);
	//var NewSubId = SubMenuId.substring(SubMenuId.indexOf('"[') + 1, SubMenuId.indexOf(']"'));
	var id = SubMenuId.replace(/"/g, '\'');
	var id1 = id.replace(/[\[\]/]+/g, '');
	var id3 = id1.replace(/'/g, '');
	objBO.GroupItemId = id3,
		objBO.GroupId = $('#ddlGroupMaster option:selected').val(),
		objBO.Logic = 'DeleteAllotedSubMenuByGroupId'
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: 'application/json;charset=utf-8',
		dataType: "JSON",
		success: function (data) {
			if (data != '') {
				$("#AllotedMenuList input:checkbox").prop("checked", false);
				GetAllotedMenu();
			}

		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}