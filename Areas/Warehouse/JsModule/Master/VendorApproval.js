
$(document).ready(function () {
	searchTable('txtSearch', 'tblVendor');
	$('#tblVendor tbody').on('click', '#approve', function () {
		$(".LedgerInfo").hide();
		var index = $(this).closest('tr').index();
		var vendorId = $(this).closest('tr').find('td:eq(1)').text();
		var vendorName = $(this).closest('tr').find('td:eq(2)').text();
		CreateLedgers(index, vendorId, vendorName);
	});

	$('#tblVendor tbody').on('click', '#view', function () {
		var prm_1 = $(this).data('ledgerid');
		selectRow($(this));
		ViewLedger(prm_1);
	});
	$('#btnLoad').on('click', function () {
		$(".LedgerInfo").hide();
		var prm_1 = $('#ddlFilter option:selected').val();
		VendorForApproval(prm_1);
	});
	//$("#tblVendor tbody").click('#view', function () {
	//	$(".LedgerInfo").hide("slide", { direction: "right" }, 500, function () {
	//		$(".LedgerInfo").show("slide", { direction: "right" }, 500);
	//	});
	//});	
});

function VendorForApproval(prm_1) {
	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objBO = {};
	objBO.prm_1 = prm_1;
	objBO.Logic = 'VendorForApproval';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#tblVendor tbody').empty();
				var tbody = "";
				var temp = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr data-ack=" + val.ack_flag + ">";
					tbody += "<td>" +
						'<button id="approve" type="button" data-vendorid="' + val.vendor_id + '" class="btn-success" style="border: none;">Approve</button>' +
						"</td>";
					tbody += "<td>" + val.vendor_id + "</td>";
					tbody += "<td>" + val.vendor_name + "</td>";
					tbody += "<td>" + val.contact_no + "</td>";
					tbody += "<td>" + val.gst_no + "</td>";
					tbody += "<td style='color:" + val.status_color + "'>" + val.status + "</td>";
					if (val.ack_flag != 'N') {
						$('#tblVendor thead').find('th:eq(6)').show();
						tbody += "<td>" +
							'<button id="view" type="button" data-ledgerid="' + val.ledgerId + '" data-vendorid="' + val.vendor_id + '" class="btn-warning" style="border: none;">View</button>' +
							"</td>";
					}
					else {
						$('#tblVendor thead').find('th:eq(6)').hide();
					}
					tbody += "</tr>";
				});
				$('#tblVendor tbody').append(tbody);


			}
			else {
				alert("Error");
			};
		},
		complete: function (data) {
			$('.ddlCountry').val(14).trigger('change');
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ViewLedger(prm_1) {
	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objBO = {};
	objBO.prm_1 = prm_1;
	objBO.Logic = 'LedgerByVendor';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					$('#tblLedger tbody').find('tr:eq(0)').find('td:eq(2)').text(val.ledgerID);
					$('#tblLedger tbody').find('tr:eq(1)').find('td:eq(2)').text(val.ledgerName);
				});
			}
			else {
				alert("Error");
			};
		},
		complete: function (data) {
			$(".LedgerInfo").hide("fade", { direction: "left" },0, function () {
				$(".LedgerInfo").show("fade", { direction: "left" },0);
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function CreateLedgers(index, vendorId, vendorName) {
	var url = config.baseUrl + "/api/Warehouse/wh_VendorApprove";
	var objBO = {};
	objBO.ledgerID = '-';
	objBO.vendor_id = vendorId;
	objBO.vendor_name = vendorName;
	objBO.login_id = Active.userId;
	objBO.Logic = 'Approve';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Successfully')) {
				alert(data);
				$('#tblVendor tbody tr:eq(' + index + ')').find('td:eq(5)').text('Approved').css('color', 'green');
			}
			else {
				alert(data);
			};
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

