$(document).ready(function () {
	GetGroups();
	searchTable('txtSearch', 'tblGroup');
	$('#tblGroup tbody').on('click', 'button', function () {
		subgroupid = $(this).data('subgroupid');
		subgroupname = $(this).data('subgroupname');

		$('#ddlMainGroup option').map(function () {
			if ($(this).val() == subgroupid) {
				$('#ddlMainGroup').prop('selectedIndex', '' + $(this).index() + '').change();
			}
		});
		$('#txtSubGroupName').val(subgroupname);
		$('#btnSaveGroup').val('Update').addClass('btn-warning');
	});
});

function GetGroups() {
	var url = config.baseUrl + "/api/Account/AC_AccountMasterQueries";
	var objBO = {};
	objBO.Logic = 'All';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$('#tblGroup tbody').empty();
				var tbody = "";
				var temp = "";
				$.each(data.ResultSet.Table, function (key, val) {
					if (temp != val.group_name) {
						tbody += "<tr style='background:#addbff'>";
						tbody += "<td colspan='2'>" + val.group_name + "</td>";
						tbody += "</tr>";
						temp = val.group_name;
					}
					tbody += "<tr>";
					//tbody += "<td>" +
					//	'<button disabled title="Edit Currently Block." type="button" data-subgroupid=' + val.SubGroupID + ' data-subgroupname="' + val.display_name + '" class="btn-success" style="border: none;"><i class="fa fa-edit"></i></category>' +
					//	"</td>";
					tbody += "<td>" + val.SubGroupID + "</td>";
					tbody += "<td>" + val.display_name + "</td>";
					tbody += "</tr>";					
				});
				$('#tblGroup tbody').append(tbody);
				$('#ddlMainGroup').empty().append($('<option>Select Group</option>'));
				$.each(data.ResultSet.Table1, function (key, val) {
					$('#ddlMainGroup').append($('<option></option>').val(val.SubGroupID).html(val.display_name)).select2();
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
function CreatePrimaryGroups() {
	if (Validation()) {
		var logic;
		if ($('#btnSaveGroup').val() == 'Submit') {
			logic = 'Insert';
		}
		else if ($('#btnSaveGroup').val() == 'Update') {
			logic = 'Update';
		}
		var url = config.baseUrl + "/api/Account/AC_CreatePrimaryGroups";
		var objBO = {};
		objBO.groupID = $('#ddlMainGroup option:selected').val();
		objBO.under_GroupID = $('#ddlMainGroup option:selected').val();
		objBO.display_name = $('#txtSubGroupName').val().toUpperCase();
		objBO.Logic = logic;
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Successfully')) {
					alert(data);
					GetGroups();
					Clear();
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
function Validation() {
	var mainGroup = $('#ddlMainGroup option:selected').text();;
	var subGroup = $('#txtSubGroupName').val();
	if (mainGroup == 'Select Group') {
		$('span.selection').find('span[aria-labelledby=select2-ddlMainGroup-container]').css('border-color', 'red').focus();
		alert('Please Select Main Group..');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlMainGroup-container]').removeAttr('style');
	}
	if (subGroup == '') {
		$('#txtSubGroupName').css('border-color', 'red').focus();
		alert('Please Provide Sub Group Name..');
		return false;
	}
	else {
		$('#txtSubGroupName').removeAttr('style');
	}
	return true;
}

function Clear() {
	$('#ddlMainGroup').prop('selectedIndex', '0').change();
	$('#txtSubGroupName').val('');
	$('#btnSaveGroup').val('Submit').removeClass('btn-warning');
	$('#btnSaveGroup').val('Submit').addClass('btn-success');
}