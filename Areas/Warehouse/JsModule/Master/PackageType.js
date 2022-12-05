
$(document).ready(function () {
	GetPackTypeList();
	$('#txtSearch').on('keyup', function () {
		var val = $(this).val().toLocaleLowerCase();
		$('#tblPackType tbody tr').filter(function () {
			$(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
		});
	});
	$('#tblPackType tbody').on('click', '.getPackType', function () {
		$('#txtPackType').val($(this).data('pack_type'));
		$('#txtPackQty').val($(this).data('pack_quantity'));
		$('span[data-packid]').text($(this).data('autoid'));
		$('#btnSavePackType').val('Update').addClass('btn-warning');
	});	
	$('#tblPackType tbody').on('click', '.switch', function () {
		isCheck = $(this).find('input[type=checkbox]').is(':checked');
		var autoid = $(this).find('input[type=checkbox]').data('autoid');
		var val = $(this).find('input[type=checkbox]').data('isactive');
		if (isCheck) {
			if (val == 'Active') {
				UpdateStatus(autoid, 0);
			}
			else {
				UpdateStatus(autoid, 1);
			}
		}
	});
	$('#ddlNOS').on('change', function () {
		var nos = $(this).val();
		var qty = $('#txtPackQty').val();
		var packType = '1X' + qty + ' ' + nos;
		if (qty != '') {
			$('#txtPackType').val(packType);
			$('select').prop('selectedIndex', 0);
		}	
		else {
			$('#txtPackQty').css({ 'border-color': 'red' });
			alert('Please Provide Pack Qty..');
		}
	});
	$('#btnSavePackType').on('click', function () {
		var val = $(this).val();
		if (val == 'Submit') {
			InsertPackType();
		}
		else if (val == 'Update') {
			UpdatePackType();
		}
	});
});

function GetPackTypeList() {
	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objBO = {};
	objBO.Logic = 'GetPackTypeList';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#tblPackType tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {
					$('<tr><td>' + val.pack_type + '</td><td class="text-center">' + val.pack_qty + '</td>' +
						'<td>' +
						'<label class="switch">' +
						'<input type="checkbox" data-autoid=' + val.autoid + ' data-isactive=' + val.IsActive + ' class="IsActive" id="chkActive" ' + val.checked + '>' +
						'<span class="slider round"></span>' +
						'</label >' +
						'</div></td></tr>').appendTo($('#tblPackType tbody'));
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
function InsertPackType() {
	if (Validate()) {
		var url = config.baseUrl + "/api/Warehouse/InsertUpdatePackType";
		var objBO = {};
		objBO.hosp_id = Active.unitId;
		objBO.pack_type = $('#txtPackType').val();
		objBO.pack_qty = $('#txtPQty').val();
		objBO.login_id = Active.userId;
		objBO.Logic = 'Insert';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data == 'Successfully Saved') {
					Clear();
					alert(data);
					GetPackTypeList();
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
function UpdateStatus(autoid, IsActive) {
	var url = config.baseUrl + "/api/Warehouse/InsertUpdatePackType";
	var objBO = {};
	objBO.autoid = autoid;
	objBO.IsActive = IsActive;
	objBO.Logic = 'UpdateStatus';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			GetPackTypeList();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

//Validation
function Validate() {
	var packType = $('#txtPackType').val();
	var packQty = $('#txtPackQty').val();
	var pQty = $('#txtPQty').val();

	//if (packQty == '') {
	//    $('#txtPackQty').css({ 'border-color': 'red' });
	//    alert('Please Provide Pack Qty..');
	//    return false;
	//}
	//else {
	//    $('#txtPackQty').removeAttr('style').focus();
	//}
	if (packType == '') {
		$('#txtPackType').css({ 'border-color': 'red' });
		alert('Please Provide Pack Type..');
		return false;
	}
	else {
		$('#txtPackType').removeAttr('style').focus();
	}
	if (pQty == '') {
		$('#txtPQty').css({ 'border-color': 'red' });
		alert('Please Provide Pack Qty..');
		return false;
	}
	else {
		$('#txtPQty').removeAttr('style').focus();
	}
	return true;
}
function Clear() {
	$('input[type=text]').val('');
	$('select').prop('selectedIndex', 0);
	$('#btnSavePackType').val('Submit').removeClass('btn-warning').addClass('btn-success');
}
