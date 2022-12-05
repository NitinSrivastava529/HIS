$(document).ready(function () {
	$('#ddlGroupFor').select2();
	GetGroupMaster();
	$('#tblGroupMaster tbody').on('click', '.switch', function () {
		isCheck = $(this).find('input[type=checkbox]').is(':checked');
		var groupid = $(this).find('input[type=checkbox]').data('groupid');
		var val = $(this).find('input[type=checkbox]').data('isactive');
		if (isCheck) {
			if (val == 'checked') {
				UpdateStatus(groupid, 0);
			}
			else {
				UpdateStatus(groupid, 1);
			}
		}
	});
});

function GetGroupMaster() {
	var url = config.baseUrl + "/api/Master/MenuMasterQueries";
	var objBO = {};
	objBO.GroupId = '-';
	objBO.GroupName = '-';
	objBO.GroupFor = '-';
	objBO.GroupItem = '-';
	objBO.IsActive = 1;
	objBO.Logic = 'GetGroupMasterForItem';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#tblGroupMaster tbody').empty();
			var tbody = "";
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.GroupId + "</td>";
                        tbody += "<td>" + val.GroupName + "</td>";
                        tbody += "<td>";
                        tbody += '<label class="switch">' +
                            '<input type="checkbox" data-groupid=' + val.GroupId + ' data-isactive=' + val.IsActive + ' class="IsActive" id="chkActive" ' + val.IsActive + '>' +
                            '<span class="slider round"></span>' +
                            '</label >';
                        tbody += "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblGroupMaster tbody').append(tbody);
                }
            }
			
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertGroupMaster() {
	var url = config.baseUrl + "/api/Master/InsertModifyMenuMaster";
	var objBO = {};
	objBO.GroupId = '-';
	objBO.GroupName = $('#txtGroupName').val();
    objBO.GroupFor = '-';
	objBO.IsActive = 1;
	objBO.Logic = 'InsertGroupMaster';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),	
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('success')) {
				alert(data)
				GetGroupMaster();
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
function UpdateStatus(groupid, IsActive) {
	var url = config.baseUrl + "/api/Master/InsertModifyMenuMaster";
	var objBO = {};
	objBO.GroupId = groupid;
	objBO.IsActive = IsActive;
	objBO.Logic = 'UpdateStatus';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {		
			GetGroupMaster();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}