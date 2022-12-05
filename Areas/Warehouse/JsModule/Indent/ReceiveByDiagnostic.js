$(document).ready(function () {
	TransferIds();
	searchTable('txtSearch','tblStockIds');
	$('#tblStockIds tbody').on('click', 'button', function () {
		selectRow($(this));
    });
    CloseSidebar();
});

function TransferIds() {
    var url = config.baseUrl + "/api/warehouse/Unit_TransferQueries";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.TransferId = '';
	objBO.item_id = '';
	objBO.prm_1 = '';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "PendingForReceiving";
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
					tbody += '<td style="width:20%">' + val.Trf_id + '</td>';
					tbody += '<td style="width:20%">' + val.trf_date + '</td>';
					tbody += '<td style="width:1%"><button onclick=TransferDetail("' + val.Trf_id + '") class="btn-success btn-flat">>></button></td>';
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
function TransferDetail(TransferId) {
    var url = config.baseUrl + "/api/warehouse/Unit_TransferQueries";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.TransferId = TransferId;
	objBO.item_id = '';
	objBO.prm_1 = '';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "SaleItemDetail";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (data.ResultSet.Table.length > 0) {
				$('#tblTransferDetail tbody').empty();
				$('#txtTransId').val(TransferId);
                var tbody = "";
                var t_Tax = 0;
                var t_Amount = 0;

				$.each(data.ResultSet.Table, function (key, val) {
					tbody += '<tr>';
					tbody += '<td>' + val.master_key_id + '</td>';
					tbody += '<td>' + val.item_Name + '</td>';
					tbody += '<td>' + val.batch_no + '</td>';
					tbody += '<td>' + val.exp_date + '</td>';
					tbody += '<td>' + val.pack_type + '</td>';
					tbody += '<td>' + val.pack_qty + '</td>';
                    tbody += '<td>' + val.mrp + '</td>';
                    tbody += '<td>' + val.PurRate + '</td>';
                    tbody += '<td>' + val.qty + '</td>';
                    tbody += '<td>' + val.taxValue + '</td>';
                    tbody += '<td>' + val.Amount + '</td>';
                    tbody += '</tr>';
                    t_Tax = t_Tax + val.taxValue;
                    t_Amount = t_Amount + val.Amount;

                });
                tbody += '<tr>';
                tbody += '<td colspan="9" style="font-weight:bold;text-align:right">Total </td>';
                tbody += '<td style="font-weight:bold">' + t_Tax.toFixed(2)  + '</td>';
                tbody += '<td style="font-weight:bold">' + t_Amount.toFixed(2) + '</td>';
                tbody += '</tr>';
				$('#tblTransferDetail tbody').append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ReceiveStock() {
	if (confirm('Are you sure want to receive?')) {
		var transId = $("#txtTransId").val();
		if (transId != "") {
			var url = config.baseUrl + "/api/warehouse/wh_ImportFromDiagnosticWarehouse";
			var objBO = {};
			objBO.unit_id = Active.unitId;
			objBO.TransferId = transId;		
			objBO.login_id = Active.userId;		
			$.ajax({
				method: "POST",
				url: url,
				data: JSON.stringify(objBO),
				dataType: "json",
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					
					if (data.includes('suc')) {
						alert(data);
						$('#txtTransId').val('');
						$('#tblTransferDetail tbody').empty();
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




