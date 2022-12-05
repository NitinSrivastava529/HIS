$(document).ready(function () {
	searchTable('txtSearch', 'tblHoldGoodsReturn');
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	$('#tblGoodsReturnInfo tbody').on('click', '.printInvoice', function () {
		purchId = $(this).closest('tr').find('td:eq(1)').text();
		PrintInvoice(purchId);
	});
});
function CompleteGoodsReturnInfo() {
	var url = config.baseUrl + "/api/Warehouse/wh_GoodsReturnQueries";
	var objBO = {};
	objBO.From = $('#txtFrom').val();
	objBO.To = $('#txtTo').val();
	objBO.Logic = 'CompleteGoodsReturnInfo';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				
				$('#tblGoodsReturnInfo tbody').empty();
				var tbody = "";
				var temp = "";
				$.each(data.ResultSet.Table, function (key, val) {
					if (temp != val.vendor_name) {
						tbody += "<tr class='select-row'>";
						tbody += "<td colspan='6'>" + val.vendor_name + "</td>";
						tbody += "</tr>";
						temp = val.vendor_name
					}
					tbody += "<tr>";
					tbody += "<td><span class='btn btn-success btn-xs printInvoice'><i class='fa fa-print'></i></span></td>";
					tbody += "<td>" + val.PurchReturnId + "</td>";
					tbody += "<td class='text-center'>" + val.return_date + "</td>";
					tbody += "<td class='text-center'>" + val.complete_date + "</td>";
					tbody += "<td>" + val.vendor_name + "</td>";
					tbody += "<td class='text-right'>" + val.amount + "</td>";
					tbody += "</tr>";
				});
				$('#tblGoodsReturnInfo tbody').append(tbody).hide().fadeIn();			
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
function Print() {

	prm1 = $('#ddlVendor option:selected').val();
	from = $('#txtFrom').val();
	to = $('#txtTo').val();
	var url = "PrintPurchaseBills?prm1=" + btoa(prm1) + "&from=" + btoa(from) + "&to=" + btoa(to);
	frame = '<iframe style="width:100%" id="frameInvoice" src=' + url + '>';
	//window.open(url);
	$('body').append(frame);
}
function PrintInvoice(purchId) {
	var url = "GoodsReturnPrint?purchId=" + btoa(purchId);
	window.open(url);
}


