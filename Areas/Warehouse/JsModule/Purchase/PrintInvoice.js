$(document).ready(function () {
	PurchaseInfo();	
});

//function htmlToPdf() {
//	var doc = new jsPDF();
//	var HTMLElement = $('body').html()
//	doc.fromHTML(HTMLElement, 10, 10, {
//		'width':190
//	})
//	//doc.text("Hello world!", 10, 10);
//	doc.save("Invoice.pdf");
//}

function PurchaseInfo() {
	var url = config.baseUrl + "/api/warehouse/PurchaseQuery";
	var objBO = {};
	objBO.purchId = atob(query()['purchId']);
	objBO.Logic = 'PurchaseInfo';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#tblInvoice tbody').empty();
				var tbody = "";
				var temp = "";
				$.each(data.ResultSet.Table, function (key, val) {
					//if (temp != val.item_Name) {
					//	tbody += "<tr>";
					//	tbody += "<td class='bg' colspan='12'><b>" + val.item_Name + "</b></td>";
					//	tbody += "</tr>";
					//	temp = val.item_Name											
					//}
					tbody += "<tr>";
					tbody += "<td>" + val.item_Name + "</td>";
					tbody += "<td>" + val.HSN + "</td>";
					tbody += "<td>" + val.Batch_No + "</td>";
					tbody += "<td>" + val.pack_type + "</td>";
					tbody += "<td>" + val.pack_qty + "</td>";
					tbody += "<td>" + val.Exp_Date + "</td>";
					tbody += "<td>" + val.trade + "</td>";
					tbody += "<td>" + val.npr + "</td>";
					tbody += "<td>" + val.Quantity + "</td>";
					tbody += "<td>" + val.It_Free + "</td>";
					tbody += "<td>" + val.tax_amount + "</td>";
					tbody += "<td>" + val.DisAmount + "</td>";
					tbody += "<td>" + val.amount + "</td>";
					tbody += "</tr>";
				});
				$('#tblInvoice tbody').append(tbody);
				var body = "";
				$('#tblTotal tbody').empty();
				$.each(data.ResultSet.Table1, function (key, val) {
					body += "<tr>";
					body += "<td>" + val.inv_total + "</td>";
					body += "<td>" + val.inv_discount + "</td>";
					body += "<td>" + val.CGST_AMT + "</td>";
					body += "<td>" + val.SGST_AMT + "</td>";
					body += "<td>" + val.IGST_AMT + "</td>";
					body += "<td>" + val.inv_tax + "</td>";
					body += "<td>" + val.netamount + "</td>";
					body += "<td>" + val.netamount + "</td>";
					body += "</tr>";

					d = val.inv_date.split('-');
					date = d[2].substring(0, 2) + '-' + d[1] + '-' + d[0];
					$('span[data-invdate]').text(date);
					$('span[data-invno]').text(val.inv_no);
					$('span[data-purchaseid]').text(atob(query()['purchId']));
					$('span[data-voucherno]').text(val.voucher_no);
					$('span[data-vendorname]').text(val.vend_name);
					$('span[data-address]').text(val.address);
					$('span[data-district]').text(val.state);
					$('span[data-contactno]').text(val.contact_no);
					$('span[data-gstin]').text(val.gst_no);

					$('span[class=grn]').text(val.pur_type);
				});
				$('#tblTotal tbody').append(body);
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

//function pdf() {
//	var url = config.rootUrl + "/Warehouse/Purchase/PdfSharpConvert";
//	var tag = "<h1>Welcome to Pdf</h1>";		
//	$.ajax({
//		method: "POST",
//		url: url,
//		data: JSON.stringify({ 'html': tag }),
//		dataType: "json",
//		contentType: "application/json;charset=utf-8",
//		complete: function (d) {

//			var sampleArr = base64ToArrayBuffer(d);
//			//saveByteArray("Sample Report", sampleArr);	
//			console.log(sampleArr);
//		}
//	});
//}

//function base64ToArrayBuffer(base64) {
//	var binaryString =atob(base64);
//	var binaryLen = binaryString.length;
//	var bytes = new Uint8Array(binaryLen);
//	for (var i = 0; i < binaryLen; i++) {
//		var ascii = binaryString.charCodeAt(i);
//		bytes[i] = ascii;
//	}
//	return bytes;
//}

//function saveByteArray(reportName, byte) {
//	var blob = new Blob([byte], { type: "application/pdf" });
//	var link = document.createElement('a');
//	link.href = window.URL.createObjectURL(blob);
//	var fileName = reportName;
//	link.download = fileName;
//	link.click();
//};