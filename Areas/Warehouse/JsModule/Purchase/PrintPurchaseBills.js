$(document).ready(function () {
	PurchaseBills();
	f = atob(query()['from']).split('-');
	from = f[2] + '-' + f[1] + '-' + f[0];

	t = atob(query()['to']).split('-');
	to = t[2] + '-' + t[1] + '-' + t[0];
	$('span[data-from]').text(from);
	$('span[data-to]').text(to);
});

function PurchaseBills() {
	var url = config.baseUrl + "/api/warehouse/PurchaseQuery";
	var objBO = {};	
	objBO.prm_1 = atob(query()['prm1']);
	objBO.from = atob(query()['from']);
	objBO.to = atob(query()['to']);
	objBO.Logic = 'PurchaseBills';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				
				$('#tblPurchaseBills tbody').empty();
				var tbody = "";
				var temp = "";
				var tcount = 0;
                inv_total = 0; inv_tax = 0; disc = 0; inv_amt = 0; cgst = 0; sgst = 0; igst = 0; tcsAmount = 0;
                Ginv_total = 0; Ginv_tax = 0; Gdisc = 0; Ginv_amt = 0; Gcgst = 0; Gsgst = 0; Gigst = 0; GtcsAmount = 0;
				$.each(data.ResultSet.Table, function (key, val) {
					if (temp != val.vendor_name) {
						temp = val.vendor_name
						if (tcount > 0) {
							tbody += "<tr>";
							tbody += "<td></td>";
							tbody += "<td></td>";
							tbody += "<td></td>";
							tbody += "<td></td>";
							tbody += "<td><b>Total :</b> </td>";
							tbody += "<td><b>" + inv_total.toFixed(0) + "</b></td>";
							tbody += "<td><b>" + inv_tax.toFixed(0) + "</b></td>";
							tbody += "<td><b>" + disc.toFixed(0) + "</b></td>";
							tbody += "<td><b>" + inv_amt.toFixed(0) + "</b></td>";
							tbody += "<td><b>" + cgst.toFixed(0) + "</b></td>";
							tbody += "<td><b>" + sgst.toFixed(0) + "</b></td>";
                            tbody += "<td><b>" + igst.toFixed(0) + "</b></td>";
                            tbody += "<td><b>" + tcsAmount.toFixed(3) + "</b></td>";
							tbody += "</tr>";
                            inv_total = 0; inv_tax = 0; disc = 0; inv_amt = 0; cgst = 0; sgst = 0; igst = 0; tcsAmount = 0;
						}
						tbody += "<tr>";
						tbody += "<td class='bg' colspan='13'><b>" + val.vendor_name + "</b></td>";
						tbody += "</tr>";
					}
					tbody += "<tr>";
					tbody += "<td>" + val.Purch_id + "</td>";
					tbody += "<td>" + val.Inv_No + "</td>";
					tbody += "<td>" + val.inv_date + "</td>";
					tbody += "<td>" + val.cr_date + "</td>";
					tbody += "<td>" + val.inv_count + "</td>";
					tbody += "<td>" + val.Inv_Total.toFixed(0) + "</td>";
					tbody += "<td>" + val.Inv_Tax.toFixed(0) + "</td>";
					tbody += "<td>" + val.inv_discount.toFixed(0) + "</td>";
					tbody += "<td>" + val.netamount.toFixed(0) + "</td>";
					tbody += "<td>" + val.cgst.toFixed(0) + "</td>";
					tbody += "<td>" + val.sgst.toFixed(0) + "</td>";
                    tbody += "<td>" + val.igst.toFixed(0) + "</td>";
                    tbody += "<td>" + val.tcsAmount.toFixed(3) + "</td>";
					tbody += "</tr>";
					tcount++;
					inv_total += val.Inv_Total;
					inv_tax += val.Inv_Tax;
					disc += val.inv_discount;
					inv_amt += val.netamount;
					cgst += val.cgst;
					sgst += val.sgst;
					igst += val.igst;
                    tcsAmount += val.tcsAmount;

					Ginv_total += val.Inv_Total;
					Ginv_tax += val.Inv_Tax;
					Gdisc += val.inv_discount;
					Ginv_amt += val.netamount;
					Gcgst += val.cgst;
					Gsgst += val.sgst;
                    Gigst += val.igst;
                    GtcsAmount += val.tcsAmount;
				});
				tbody += "<tr>";
				tbody += "<td></td>";
				tbody += "<td></td>";
				tbody += "<td></td>";
				tbody += "<td></td>";
				tbody += "<td><b>Total :</b> </td>";
				tbody += "<td><b>" + inv_total.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + inv_tax.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + disc.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + inv_amt.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + cgst.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + sgst.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + igst.toFixed(0) + "</b></td>";
                tbody += "<td><b>" + tcsAmount.toFixed(3) + "</b></td>";
                tbody += "</tr>";

				tbody += "<tr>";
				tbody += "<td></td>";
				tbody += "</tr>";
				tbody += "<tr>";
				tbody += "<td></td>";
				tbody += "<td></td>";
				tbody += "<td></td>";
				tbody += "<td></td>";
				tbody += "<td><b>Grand Total :</b> </td>";
				tbody += "<td><b>" + Ginv_total.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + Ginv_tax.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + Gdisc.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + Ginv_amt.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + Gcgst.toFixed(0) + "</b></td>";
				tbody += "<td><b>" + Gsgst.toFixed(0) + "</b></td>";
                tbody += "<td><b>" + Gigst.toFixed(0) + "</b></td>";
                tbody += "<td><b>" + GtcsAmount.toFixed(3) + "</b></td>";

				tbody += "</tr>";
				$('#tblPurchaseBills tbody').append(tbody);
			}
			else {
				alert("Error");
			};
		},
		complete: function (response) {
			window.print();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function query() {
	var vars = [], hash;
	var url = window.location.href.replace('#', '');
	var hashes = url.slice(url.indexOf('?') + 1).split('&');
	for (i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[decodeURIComponent(hash[0])] = decodeURIComponent(hash[1]);
	}
	return vars;
}

