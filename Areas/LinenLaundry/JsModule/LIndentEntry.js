$(document).ready(function () {
	GetCart();
	LL_ItemList();
	$("#ddlItemList").on('change', function () {
		var type = $(this).find('option:selected').data('type');
		if (type == 'SET')
			$('#txtQty').val(1).prop('disabled', true);
		else
			$('#txtQty').val('').prop('disabled', false);
	});
});

function GetCart() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.login_id = Active.userId;
	objBO.Logic = 'LL_StoreListByLogin';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#ddlCart").append($("<option></option>").val('0').html('Select'));
			$.each(data.ResultSet.Table, function (key, val) {
				$("#ddlCart").append($("<option></option>").val(val.CartId).html(val.CartName)).select2();
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function LL_ItemList() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};	
	objBO.Logic = 'LL_ItemList';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#ddlItemList").append($("<option></option>").val('0').html('Select')).select2();
			$.each(data.ResultSet.Table, function (key, val) {
				$("#ddlItemList").append($("<option></option>").val(val.item_id).html(val.item_name));
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetStocks() {
	$('#txtInStock').text("0");
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objConsumpBO = {};
	objConsumpBO.hosp_id = Active.unitId;
	objConsumpBO.CartId = $('#ddlCart option:selected').val();
	objConsumpBO.ItemId = $('#ddlItemList option:selected').val();
	objConsumpBO.Logic = "LL_CartStocks";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objConsumpBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			
			$.each(data.ResultSet.Table, function (key, val) {
				$('#txtInStock').val(val.stocks);
				$('#txtQty').focus();
			})
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetIndentInfo() {
	$("#tblIndentInfo tbody").empty();
	$('#txtIndentNo').val('New');
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.Prm1 = $('#txtIndentNo').val();
	objBO.Prm2 = $('#ddlCart option:selected').val();
	objBO.Logic = 'GetIndentInfoByIndentNo';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					var tbody = "";
					var count = 0;
					$.each(data.ResultSet.Table, function (key, val) {
						count++;
						tbody += "<tr>";
						tbody += "<td>" + count + "</td>";
						tbody += "<td>" + val.item_id + "</td>";
						tbody += "<td>" + val.item_name + "</td>";
						tbody += "<td style='padding-right:10px' class='text-right'>" + val.qty + "</td>";
						tbody += "<td><button class=' btn-danger' onclick=DeleteIndent('" + val.AutoId + "')><i class='fa fa-trash'></i></button></td>";
						tbody += "</tr>";
						$('#txtIndentNo').val(val.IndentNo);
					});
					$("#tblIndentInfo tbody").append(tbody);
					$("#ddlCart").prop('disabled', true);
				}
				else {
					//alert("Data Not Found");
				};
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertIndent() {
	if (Validation()) {
		var url = config.baseUrl + "/api/LinenLaundry/LL_IndentInsert";
		var objBO = {};
		objBO.CartId = $('#ddlCart option:selected').val();
		objBO.IndentNo = $('#txtIndentNo').val();
		objBO.ItemId = $('#ddlItemList option:selected').val();
		objBO.qty = $('#txtQty').val();
		objBO.login_id = Active.userId;
		objBO.ExpDate = "1900/01/01";
		objBO.Logic = "IndentRequest";		
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Success')) {
					var indentNo = data.split('|')[1];
					$('#txtIndentNo').val(indentNo);
					GetIndentInfo();
					$('#txtQty').val('');
					$('#txtQty').css('width','40%');
					$('#ddlItemList').prop('selectedIndex', '0').change();
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
function CompleteIndent() {
	if ($('#txtIndentNo').val() == 'New') {
		alert('Indent Request Not Available..');
		return
	}
	if (confirm('Are you sure to Complete Indent?')) {
		var url = config.baseUrl + "/api/LinenLaundry/LL_IndentInsert";
		var objBO = {};
		objBO.IndentNo = $('#txtIndentNo').val();
		objBO.login_id = Active.userId;
		objBO.Logic = "CompleteIndent";
		objBO.ExpDate = "1900/01/01";
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Success')) {
					alert('Indent Completed..');
					$('#txtIndentNo').val('New');
					$('#tblIndentInfo tbody').empty();
					$('#txtQty').val('');
					$('#ddlSetList').prop('selectedIndex', '0').change();
					$('#ddlCart').prop('selectedIndex', '0').change();
					$("#ddlCart").prop('disabled', false);
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
function DeleteIndent(AutoId) {
	if (confirm('Are you sure to delete This?')) {
		var url = config.baseUrl + "/api/LinenLaundry/LL_IndentInsert";
		var objBO = {};
		objBO.AutoId = AutoId;
		objBO.ExpDate = "1900/01/01";
		objBO.Logic = "DeleteIndent";
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				GetIndentInfo();
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
function Clear() {
	$('#txtIndentNo').val('New');
	$('#tblIndentInfo tbody').empty();
	$('#txtQty').val('');
	$('#ddlItemtList').prop('selectedIndex', '0').change();
	$('#ddlCart').prop('selectedIndex', '0').change();
	$("#ddlCart").prop('disabled', false);
}
function Validation() {
	var Cart = $('#ddlCart option:selected').val();
	var IndentNo = $('#txtIndentNo').val();
	var Item = $('#ddlItemtList option:selected').val();
	var qty = $('#txtQty').val();

    if (Cart == 'Select') {
		alert('Please Select Cart');
		$('#ddlCart').focus();
		return false;
	}
	if (IndentNo == '') {
		alert('Please Provide Indent No');
		$('#txtIndentNo').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtIndentNo').removeAttr('style')
	}
	if (Item == 'Select') {
		alert('Please Select Item Name');
		$('#ddlItemtList').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#ddlItemtList').removeAttr('style')
	}
	if (qty == '') {
		alert('Please Provide Qty');
		$('#txtQty').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtQty').removeAttr('style')
	}
	return true;
}