$(document).ready(function () {
	CloseSidebar();
	GetCartListByLoginId();
	searchTable('txtSearch','tblStockIds');
	$('#tblStockIds tbody').on('click', 'button', function () {
		selectRow($(this));
	});
});

function HospCartindentToPharmacy() {
	var url = config.baseUrl + "/api/warehouse/Hospital_GeneralStoreQueries";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.TransferId = '';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.prm_1 = $('#ddlCartList option:selected').val();
	objBO.Logic = "HospCartindentToPharmacy";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$('#tblStockIds tbody').empty();
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += '<tr>';
					tbody += '<td style="width:20%">' + val.ipop_no + '</td>';
					tbody += '<td style="width:20%">' + val.UHID + '</td>';
					tbody += '<td style="width:20%">' + val.pt_name + '</td>';
					tbody += '<td style="width:20%">' + val.indent_no + '</td>';
					tbody += '<td style="width:20%">' + val.indent_datetime + '</td>';
					if (val.sale_inv_no == null) {
						tbody += '<td style="width:20%">Pending</td>';
						tbody += '<td style="width:1%"><button onclick=IndentSaleDetail("' + val.sale_inv_no + '") class="btn-success btn-flat disabled">>></button></td>';
					}
					else {
						tbody += '<td style="width:20%">' + val.sale_inv_no + '</td>';
						tbody += '<td style="width:1%"><button onclick=IndentSaleDetail("' + val.sale_inv_no + '") class="btn-success btn-flat">>></button></td>';
					}
					tbody += '</tr>';
				});
				$('#tblStockIds tbody').append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function IndentSaleDetail(sale_inv_no) {
	var url = config.baseUrl + "/api/warehouse/Hospital_GeneralStoreQueries";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.TransferId = sale_inv_no;
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "IndentSaleDetail";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (data.ResultSet.Table.length > 0) {
				$('#tblIndentSaleDetail tbody').empty();
				$('#txtSaleInvNo').val(sale_inv_no);
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += '<tr>';
					tbody += '<td>' + val.master_key_id + '</td>';
					tbody += '<td>' + val.Item_name + '</td>';
					tbody += '<td>' + val.batch_no + '</td>';
					tbody += '<td>' + val.expiry + '</td>';
					tbody += '<td>' + val.pack_type + '</td>';
					tbody += '<td>' + val.pack_qty + '</td>';
					tbody += '<td>' + val.qty + '</td>';
					//tbody += '<td style="width:1%"><button class="btn-success btn-flat">>></button></td>';
					tbody += '</tr>';
				});
				$('#tblIndentSaleDetail tbody').append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});

}
function MarkReceived(TransferId) {
	var url = config.baseUrl + "/api/warehouse/Hospital_GeneralStoreQueries";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.TransferId = TransferId;
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "MarkReceived";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {

		},
		error: function (response) {
			alert('Server Error...!');
		}
	});

}
function ReceiveStock() {
	if (confirm('Are you sure want to receive?')) {
		var transId = $("#txtSaleInvNo").val();
		if (transId != "") {
			var url = config.baseUrl + "/api/warehouse/wh_ImportFromPharmacy";
			var objBO = {};
			objBO.unit_id = Active.unitId;
			objBO.TransferId = transId;
			objBO.from = '1900/01/01';
			objBO.to = '1900/01/01';
			objBO.login_id = Active.userId;
			objBO.Logic = "IndentSaleDetail";
			objBO.WHLogic = "ReceiveFromPatient";
			$.ajax({
				method: "POST",
				url: url,
				data: JSON.stringify(objBO),
				dataType: "json",
				contentType: "application/json;charset=utf-8",
				success: function (data) {			
					if (data.includes('suc')) {
						MarkReceived(transId);
						alert(data);
						$('#txtSaleInvNo').val('');
						$('#tblIndentSaleDetail tbody').empty();
						$('#tblStockIds tbody').find('tr.select-row').remove();
					}
				},
				error: function (response) {
					alert('Server Error...!');
				}
			});
		}
	}
}
function GetCartListByLoginId() {
	var url = config.baseUrl + "/api/warehouse/wh_IndentQueries";
	var objIdentBO = {};
	objIdentBO.login_id = Active.userId;
	objIdentBO.Logic = "GetCartListByLogin";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objIdentBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$("ddlCartList").empty();
				$("#ddlCartList").append($("<option></option>").val("0").html("ALL"));
				$.each(data.ResultSet.Table, function (key, value) {
					$("#ddlCartList").append($("<option></option>").val(value.CartId).html(value.CartName)).select2();
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}




