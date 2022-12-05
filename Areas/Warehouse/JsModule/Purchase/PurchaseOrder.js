$(document).ready(function () {
	OrderList();
	$('#ddlOrderList').on('change', function () {
		var val = $(this).val();
		if (val != 'New Order') {
			$('#btnCreate').val('View');
			$('#btnClose').show('fade');
		}
		else {
			$('#btnCreate').val('Create');
			$('#btnClose').hide('fade');
		}
	});
	$('#btnCreate').on('click', function () {
		var val = $(this).val();
		if (val == 'Create') {
			NewOrder();
		}
		if (val == 'View') {
			ViewOrder();

		}
	});
	$('#btnClose').on('click', function () {
		CloseOrder();
	});
});

function OrderList() {
	var url = config.baseUrl + "/api/Warehouse/wh_purchaseOrder_Query";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.poNumber = '-';
	objBO.qty = '-';
	objBO.prm_1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'OpenOrdersList';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#ddlOrderList').empty();
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlOrderList').append($('<option></option>').val(val.order_no).html(val.KeyValue)).select2();
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ViewOrder() {
	var url = config.baseUrl + "/api/Warehouse/wh_purchaseOrder_Query";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.poNumber = $('#ddlOrderList option:selected').val();
	objBO.qty = '-';
	objBO.prm_1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'ViewOrder';
	Global_DownloadExcel(url, objBO, 'Purchase-Order.xlsx');
}
function CloseOrder() {
	var url = config.baseUrl + "/api/Warehouse/wh_purchaseOrder_Process";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.poNumber = $('#ddlOrderList option:selected').val();
	objBO.qty = '-';
	objBO.prm_1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'CloseOrder';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert(data);
				OrderList();
				$('#btnCreate').val('Create');
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
function NewOrder() {
	var url = config.baseUrl + "/api/Warehouse/wh_purchaseOrder_Process";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.poNumber = $('#ddlOrderList option:selected').val();
	objBO.qty = '-';
	objBO.prm_1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'NewOrder';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert(data);
				OrderList();
				$('#btnCreate').val('Create');
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