$(document).ready(function () {
	$('#tblViewForReceive tbody').on('click', 'span', function () {
		selectRow($(this));
		var RcvdQty = $(this).closest('tr').find('td:eq(5)').find('input:text').val();
		var poNo = $(this).closest('tr').find('td:eq(0)').text();
		var autoId = $(this).data('autoid');
		var row = $(this);
		ReceivedQty(autoId, poNo, RcvdQty, row);
	});
});

function ViewForReceive() {
	var url = config.baseUrl + "/api/Warehouse/wh_purchaseOrder_Query";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.poNumber = '-';
	objBO.qty = '-';
	objBO.prm_1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'ViewForReceive';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				
				$('#tblViewForReceive tbody').empty();
				var tbody = "";
				var temp = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td class='text-left'>" + val.order_no + "</td>";
					tbody += "<td class='text-left'>" + val.OrdType + "</td>";
					tbody += "<td>" + val['Name of Product'] + "</td>";
					tbody += "<td class='text-right'>" + val.OrderQty + "</td>";
					tbody += "<td class='text-right'>" + val.PrvRecQty + "</td>";
					tbody += "<td><input type='text' style='width:65px;height: 20px;text-align:right' data-int class='form-control' value='" + val.RecQty + "'/></td>";
					tbody += "<td style='width:1%'><span class='btn btn-success btn-xs' style='height: 20px' data-autoid=" + val.auto_id + ">Receive</span></td>";
					tbody += "</tr>";
				});
				$('#tblViewForReceive tbody').append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ReceivedQty(autoId, poNo, RcvdQty, row) {
	var url = config.baseUrl + "/api/Warehouse/wh_purchaseOrder_Process";
	var objBO = {};
	objBO.unit_id = Active.unitId;
	objBO.poNumber = poNo;
	objBO.qty = RcvdQty;
	objBO.prm_1 = autoId;
	objBO.login_id = Active.userId;
	objBO.Logic = 'ReceivedQty';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				var preRcvdQty = $('tr.select-row').find('td:eq(4)').text();
				var total = parseInt(preRcvdQty) + parseInt(RcvdQty);
				$('tr.select-row').find('td:eq(4)').text(total);
				$('tr.select-row').find('td:eq(5)').find('input:text').val(0);
				$('#tblViewForReceive tbody tr').each(function () {
					$(this).removeAttr('style');
					$(this).removeClass('select-row');
				});
				$(row).closest('tr').css({ 'background': '#00a65a', 'color': '#fff' });
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