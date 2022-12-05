$(document).ready(function () {
	CloseSidebar();
	UnReceivedPurchase();
	$('#txtSearch').on('keyup', function () {
		var val = $(this).val().toLocaleLowerCase();
		$('#tblUnCompPurchase tbody tr').filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
		});
	});
	$('#tblUnReceivedPurchase tbody').on('click', '.getUnCompPurchase', function () {
		var purchaseId = $(this).data('pid');
		$('#tblUnReceivedPurchase tbody tr').removeAttr('style');
		$('#tblUnReceivedPurchase tbody tr').removeAttr('class');
		$(this).closest('tr').addClass('process').css('background', '#0076d0');
		ViewPurchaseInfo(purchaseId);
	});
});

function UnReceivedPurchase() {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.Logic = 'UnReceivedPurchaseInStock';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				var str = "";
				var vendor = "";
				$('#tblUnReceivedPurchase tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {
					if (vendor != val.vendor_name) {
						str += '<tr style="background:#d9eeff">';
						str += '<td colspan="3"> ' + val.vendor_name + '</td>';
						str += '</tr>';
						vendor = val.vendor_name;
					}
					str += '<tr>';
					str += '<td> ' + val.Purch_id + '</td>';
					str += '<td> ' + val.Inv_No + '</td>';
					str += '<td> ' + val.Inv_Date + '</td>';
					str += '<td class="btn btn-success getUnCompPurchase" data-pId=' + val.Purch_id + '><i class="fa fa-check"></i></td>';
					str += '</tr>';
				});
				$('#tblUnReceivedPurchase tbody').append(str);
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
function ViewPurchaseInfo(pId) {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.purchId = pId;
	objBO.Logic = 'PurchaseInfo';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				var str = "";
				$('#tblReceivePurchase tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {
					$('#txtPurchaseId').val(val.Purch_id);
					str += "<tr>";
					str += "<td>" + val.item_Name + "</td>";
					str += "<td>" + val.tax_rate + "</td>";
					str += "<td>" + val.Batch_No + "</td>";
					str += "<td>" + val.Exp_Date + "</td>";
					str += "<td>" + val.MRP + "</td>";
					str += "<td>" + val.trade + "</td>";
					str += "<td>" + val.npr + "</td>";
					str += "<td>" + val.pack_type + "</td>";
					str += "<td>" + val.Quantity + "</td>";
					str += "<td>" + val.It_Free + "</td>";
					str += "<td>" + val.DisPer + "</td>";
					str += "<td>" + val.DisAmount + "</td>";
					str += "<td>" + val.tax_amount + "</td>";
					str += "<td>" + val.amount + "</td>";
					str += "<td>" + val.mfd_name + "</td>";
					str += "<td>" + val.HSN + "</td>";
					str += "</tr>";
				});
				$('#tblReceivePurchase tbody').append(str);
				$.each(data.ResultSet.Table1, function (key, val) {
					$('span[data-purchaseid]').text(pId);
					$('.iname').text(val.pur_type);
					$('span[data-invoice]').text(val.inv_no + '|' + val.inv_date);
					$('span[data-ewaybillno]').text(val.eWayBillNo);
					$('span[data-ewaybilldate]').text(val.eWayBillDate);
					$('span[data-grntype]').text(val.pur_type);
					$('span[data-supplier]').text(val.vendor_id);
					$('span[data-igst]').text(val.IGST_AMT);
					$('span[data-sgst]').text(val.SGST_AMT);
					$('span[data-cgst]').text(val.CGST_AMT);
					$('span[data-roundoff]').text(val.roundoff);
					$('span[data-netamount]').text(val.netamount);
					$('span[data-discount]').text(val.inv_discount);
					$('span[data-tax]').text(val.inv_tax);
					$('span[data-total]').text(val.inv_total);
					var ba = parseFloat(val.inv_total) + parseFloat(val.inv_tax);
					$('span[data-billamount]').text(ba);
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

function ReceivePurchase() {
	pid = $('span[data-purchaseid]').text();
	if (pid != '') {
		if (confirm('Are you sure want to Receive in Stock...')) {
			var url = config.baseUrl + "/api/Warehouse/wh_PurchaseImportStock";
			var objBO = {};
			objBO.Purch_id = $('span[data-purchaseid]').text();
			objBO.login_id = Active.userId;
			objBO.warehouseCartId = Active.warehouseId;
			objBO.Logic = 'Purchase';
			$.ajax({
				method: "POST",
				url: url,
				data: JSON.stringify(objBO),
				dataType: "json",
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					if (data.includes("Success", 0)) {
						alert(data);
						$('#tblReceivePurchase tbody').empty();
						$('#tblPaymentDetails span').text('');
						$('#BasicInfo span').text('');
						$('#tblUnReceivedPurchase tbody').find('tr.process').remove();
						UnReceivedPurchase();
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
	}
	else {
		alert('Please Choose Any Purchase...');
	}

}