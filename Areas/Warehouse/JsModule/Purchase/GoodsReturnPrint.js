$(document).ready(function () {
	GoodsReturnForPrint();
	//f = atob(query()['from']).split('-');
	//from = f[2] + '-' + f[1] + '-' + f[0];

	//t = atob(query()['to']).split('-');
	//to = t[2] + '-' + t[1] + '-' + t[0];
	//$('span[data-from]').text(from);
	//$('span[data-to]').text(to);
});

function GoodsReturnForPrint() {
	var url = config.baseUrl + "/api/Warehouse/wh_GoodsReturnQueries";
	var objBO = {};
	objBO.Prm1 = atob(query()['purchId']);
	objBO.Logic = 'GoodsReturnForPrint';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				
				$('#tblGoodsDetails tbody').empty();
				var tbody = "";
				var total = 0;
				var cgst = 0;
				var sgst = 0;
				var igst = 0;
				var netamount = 0;
				$.each(data.ResultSet.Table1, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.item_name + '  (<i style=font-size:10px;>' + val.mfd_name+'</i>)' + "</td>";								
					tbody += "<td>" + val.batch_no + "</td>";
					tbody += "<td>" + val.exp_date + "</td>";				
					tbody += "<td class='text-right'>" + val.MRP + "</td>";
					tbody += "<td class='text-right'>" + val.trade + "</td>";
					tbody += "<td class='text-right'>" + val.Quantity + "</td>";
					tbody += "<td class='text-right'>" + val.CGST_AMT + "</td>";					
					tbody += "<td class='text-right'>" + val.SGST_AMT + "</td>";					
					tbody += "<td class='text-right'>" + val.IGST_AMT + "</td>";					
					tbody += "<td class='text-right'>" + val.amount + "</td>";				
					tbody += "</tr>";
					total += val.amount;
					netamount += parseFloat(val.CGST_AMT) + parseFloat(val.SGST_AMT) + parseFloat(val.IGST_AMT) + parseFloat(val.amount)
					cgst += parseFloat(val.CGST_AMT);
					sgst += parseFloat(val.SGST_AMT);
					igst += parseFloat(val.IGST_AMT);
				});
				$('span[data-total]').text(total);
				$('span[data-cgst]').text(cgst);
				$('span[data-sgst]').text(sgst);
				$('span[data-igst]').text(igst);
				$('span[data-netamount]').text(netamount.toFixed(2));
				$('#tblGoodsDetails tbody').append(tbody);
				$.each(data.ResultSet.Table, function (key, val) {
					$('span[data-returndate]').text(val.return_date);				
					$('span[data-purchaseid]').text(atob(query()['purchId']));					
					$('span[data-vendorname]').text(val.vendor_name);
					$('span[data-address]').text(val.address1);
					$('span[data-district]').text(val.city + ',' + val.state);
					$('span[data-contactno]').text(val.contact_No);
					$('span[data-gstin]').text(val.gst_no);
				});
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

