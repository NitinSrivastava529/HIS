$(document).ready(function () {
	FillCurrentDate('txtFrom')
	FillCurrentDate('txtTo')
	//SaleRegister();
});
function SaleRegister() {
	$('#tblSalesRegister tbody').empty();
	var url = config.PharmacyWebAPI_baseUrl + "/api/sales/saleregister";
	var objBO = {};
	objBO.unit_id = 'MS-H0048';
	objBO.f_date = $('#txtFrom').val();
	objBO.l_date = $('#txtTo').val();
	objBO.login_id = Active.userId;	
	objBO.sType = 'SR:HIS';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			var tbody = "";		
			var temp = "";
			var net = 0;
			var received = 0;
			var balance = 0;
			if (Object.keys(data.result).length > 0) {
				$.each(data.result.Table, function (key, val) {
					net += val.net;
					received += val.received;
					balance += val.balance;
					if (temp != val.comp_by) {
						tbody += "<tr style='background:#ddd'>";
						tbody += "<td colspan='12'>" + val.comp_by + "</td>";
						tbody += "</tr>";
						temp = val.comp_by;
					}
					tbody += "<tr>";
					tbody += "<td>" + val.sale_date + "</td>";
					tbody += "<td>" + val.sale_inv_no + "</td>";
					tbody += "<td>" + val.pt_name + "</td>";
					tbody += "<td>" + val.ref_name + "</td>";
					tbody += "<td class='text-right'>" + val.total + "</td>";
					tbody += "<td class='text-right'>" + val.discount + "</td>";			
					tbody += "<td class='text-right'>" + val.net + "</td>";
					tbody += "<td class='text-right'>" + val.received + "</td>";
					tbody += "<td class='text-right'>" + val.balance + "</td>";
					tbody += "<td class='text-right'>" + val.pay_mode + "</td>";
					tbody += "<td><a href='../Print/SalesBill?InvoiceNo=" + val.sale_inv_no+"' target='_blank' class='btn btn-warning btn-xs' ><i class='fa fa-print'>&nbsp;</i>Print</a></td>";
					tbody += "</tr>";
				});
				tbody += "<tr>";				
				tbody += "<th class='text-center' colspan='6'><b>Total</b></th>";
				tbody += "<th class='text-right'><b>" + net + "</b></th>";
				tbody += "<th class='text-right'><b>" + received + "</b></th>";
				tbody += "<th class='text-right'><b>" + balance + "</b></th>";		
				tbody += "<th class='text-right'>-</th>";		
				tbody += "<th class='text-right'>-</th>";		
				tbody += "</tr>";
				$('#tblSalesRegister tbody').append(tbody);
			}		
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}