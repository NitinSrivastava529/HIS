$(document).ready(function () {
    FloorAndLinenCartList();
    FillProductList();
	$('#tblRequestMaster tbody').on('click', '.switch', function () {
		isCheck = $(this).find('input[type=checkbox]').is(':checked');
		var autoid = $(this).find('input[type=checkbox]').data('autoid');
		var statusflag = $(this).find('input[type=checkbox]').data('isactive');
		if (isCheck) {
			if (statusflag == '1') {
				UpdateStatus(autoid, 0);
			}  
			else {
				UpdateStatus(autoid, 1);
			}
		} 
	}); 
});

function GetReqMaster() {
	var url = config.baseUrl + '/api/LinenLaundry/LL_MasterQueries'
	var objBO = {};
	objBO.NSID = $('#ddlNursing').val();
    objBO.Logic = 'GetReqMaster';    
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#tblRequestMaster tbody').empty();
			var tbody = "";
            var count = 0;
            var temp = "";
			$.each(data.ResultSet.Table, function (key, val) {
                count++;
                if (temp != val.roomFullName) {
                    tbody += "<tr>";
                    tbody += "<td colspan='10' style='background-color:lightgray'>" + val.roomFullName+"</td>";
                    tbody += "</tr>";
                    temp= val.roomFullName
                }
				tbody += "<tr>";
				tbody += "<td style='width:7%'>";
				tbody += '<label class="switch">' +
					'<input type="checkbox" data-autoid=' + val.auto_id + ' data-isactive=' + val.IsActive + ' ' + val.checked + '>' +
					'<span class="slider round"></span>' +
					'</label>' +
					'</div>';
                tbody += "</td>";
              	tbody += "<td class='text-left' style='width:7%'>" + val.item_id + "</td>";
                tbody += "<td class='text-left' style='width:27%'>" + val.itemName + "</td>";
				tbody += "<td style='width:5%'><input type='text' onkeyup=total(this) class='form-control text-right' value='" + val.TotalBeds + "'/></td>";
				tbody += "<td style='width:6%'><input type='text' class='form-control text-right' readonly='' value='" + val.ItemStock + "'/></td>";
				tbody += "<td style='width:6%'><input type='text' onkeyup=total(this) class='form-control text-right' value='" + val.InUse + "'/></td>";
				tbody += "<td style='width:6%'><input type='text' onkeyup=total(this) class='form-control text-right' value='" + val.ReadyToUse + "'/></td>";
                tbody += "<td style='width:6%'><input type='text' onkeyup=total(this) class='form-control text-right' value='" + val.InTransit + "'/></td>";
                tbody += "<td style='width:6%'><input type='text' class='form-control text-right' style='background-color:#d8f1f5' value='" + val.TotalReq + "'/></td>";
				tbody += "<td style='width:6%'><button class='btn-warning bn' onclick=UpdateStock(this,'" + val.auto_id + "')>Update</button></td>";
				tbody += "</tr>";
            });
            
        	$('#tblRequestMaster tbody').append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function FloorAndLinenCartList() {
	var url = config.baseUrl + '/api/LinenLaundry/LL_MasterQueries'
	var objBO = {};
    objBO.Logic = 'FloorAndLinenCartList';
	$.ajax({
		method: 'POST',
		url: url,
		data: JSON.stringify(objBO),
		contentType: 'application/json;charset=utf-8',
		dataType: 'json',
        success: function (data) {
            
			$('#ddlFloor').empty().append($('<option></option>').val(00).html('Select')).select2();
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlFloor').append($('<option></option>').val(val.FloorID).html(val.FloorName));
			});
			$('#ddlNursing').empty().append($('<option></option>').val(00).html('Select')).select2();
			$.each(data.ResultSet.Table1, function (key, val) {
                $('#ddlNursing').append($('<option></option>').val(val.CartId).html(val.CartName));
			});
		
		},
		error: function (res) {
			alert('server error');
		}
	});
}
function RoomListOfFloor() {
    var url = config.baseUrl + '/api/LinenLaundry/LL_MasterQueries'
    var objBO = {};
    objBO.FloorName = $('#ddlFloor').val();
    objBO.Logic = 'RoomListOfFloor';
    $.ajax({
        method: 'POST',
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        success: function (data) {
            $('#ddlRoomList').empty().append($('<option></option>').val(00).html('Select')).select2();
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlRoomList').append($('<option></option>').val(val.RoomId).html(val.RoomName));
            });
        },
        error: function (res) {
            alert('server error');
        }
    });
}
function FillProductList() {
    $("#ddlItem").empty();
    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = "LL_ItemList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#ddlItem').append($('<option selected="selected"></option>').val("Select").html("Select")).select2();
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlItem').append($('<option></option>').val(val.item_id).html(val.item_name))
            })
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}
function SaveRequest() {
	if (Validation()) {
		var url = config.baseUrl + '/api/LinenLaundry/LL_InsertUpdateMaster'
		var objBO = {};
		objBO.AutoId = '-';
		objBO.hosp_id = Active.unitId;
		objBO.NursingId = $('#ddlNursing option:selected').val();
        objBO.RoomId = $('#ddlRoomList option:selected').val();
        objBO.ItemId = $('#ddlItem option:selected').val();
		objBO.TotalBeds = $('#txtTotalBeds').val();
		objBO.ItemStock = 0;
		objBO.InUse = 0;
		objBO.ReadyToUse = 0;
		objBO.InTransit = 0;
		objBO.login_id = Active.userId;
		objBO.Logic = 'InsertRequestMaster';
		$.ajax({
			method: 'POST',
			url: url,
			data: JSON.stringify(objBO),
			contentType: 'application/json;charset=utf-8',
			dataType: 'json',
			success: function (data) {
				if (data.includes('Success')) {
			    	GetReqMaster();
		        }
				else {
					alert(data);
				}
			},
			error: function (res) {
				alert('server error');
			}
		});
	}
}
function UpdateStock(elem, autoid) {
	var url = config.baseUrl + '/api/LinenLaundry/LL_InsertUpdateMaster'
	var objBO = {};
	objBO.AutoId = autoid;
	objBO.ItemStock = $(elem).closest('tr').find('td:eq(4)').find('input:text').val();
	objBO.InUse = $(elem).closest('tr').find('td:eq(5)').find('input:text').val();
	objBO.ReadyToUse = $(elem).closest('tr').find('td:eq(6)').find('input:text').val();
    objBO.InTransit = $(elem).closest('tr').find('td:eq(7)').find('input:text').val();
    objBO.TotalReq = $(elem).closest('tr').find('td:eq(8)').find('input:text').val();
	objBO.login_id = Active.userId;
	objBO.Logic = 'UpdateRequestStock';
	$.ajax({
		method: 'POST',
		url: url,
		data: JSON.stringify(objBO),
		contentType: 'application/json;charset=utf-8',
		dataType: 'json',
		success: function (data) {
			if (data.includes('Success')) {
				alert('Successfully Updated..');
				GetReqMaster();
			}
			else {
				alert(data);
			}
		},
		error: function (res) {
			alert('server error');
		}
	});
}
function UpdateStatus(autoid, IsActive) {
	var url = config.baseUrl + '/api/LinenLaundry/LL_InsertUpdateMaster'
	var objBO = {};
	objBO.AutoId = autoid;
	objBO.IsActive = IsActive;
	objBO.Logic = 'DeleteReqMaster';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			GetReqMaster();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function Validation() {
	var floor = $('#ddlFloor option:selected').text();
	var nursing = $('#ddlNursing option:selected').text();
	var ward = $('#ddlWard option:selected').text();
	var totalRooms = $('#txtTotalRooms').val();
	var totalBeds = $('#txtTotalBeds').val();
	var Item = $('#ddlItem option:selected').text();

	if (floor == 'Select Floor') {
		alert('Please Select Floor');
		return false;
	}
	if (nursing == 'Select Nursing') {
		alert('Please Select Nursing');
		return false;
	}
	if (ward == 'Select Ward') {
		alert('Please Select Ward');
		return false;
	}
	if (totalRooms == '') {
		alert('Please Provide Total Rooms');
		return false;
	}
	if (totalBeds == '') {
		alert('Please Provide Total Beds');
		return false;
	}
	if (Item == 'Select Item') {
		alert('Please Select Item');
		return false;
	}
	return true;
}
function total(elm) {
    var NoBeds = $(elm).closest('tr').find('td:eq(3)').find('input:text').val();
	var InUse = $(elm).closest('tr').find('td:eq(5)').find('input:text').val();
	var ReadyToUse = $(elm).closest('tr').find('td:eq(6)').find('input:text').val();
	var InTransit = $(elm).closest('tr').find('td:eq(7)').find('input:text').val();
    let total = parseInt(InUse) + parseInt(ReadyToUse) + parseInt(InTransit);
    let TotReq = parseInt(total) * parseInt(NoBeds);
    $(elm).closest('tr').find('td:eq(4)').find('input:text').val(total);
    $(elm).closest('tr').find('td:eq(8)').find('input:text').val(TotReq);
}