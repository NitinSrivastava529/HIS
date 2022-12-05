var total = 0;
var amount = 0;
$(document).ready(function () {
	$('#btnCancel').hide();
	$('select').select2();
	$('#tblPayment tbody').on('change', 'input:checkbox', function () {
		var isCheck = $(this).is(':checked');
		amount = parseFloat($(this).closest('tr').find('td:eq(4)').text());
		if (isCheck) {
			total += amount;
			$('#txtTotal').val(total);
			$(this).closest('tr').addClass('item');
		}
		else {
			total -= amount;
			$('#txtTotal').val(total);
			$(this).closest('tr').removeClass('item');
		}
	});
}); 

function GetServicesRefund() {
	$('#tblDetails tbody').empty();
	$('#tblPayment tbody').empty();
	var url = config.baseUrl + "/api/Service/Opd_ServiceQueries";
	var objBO = {};
	objBO.prm_1 = $('#txtVisitNo').val();
	objBO.Logic = 'GetServicesRefund';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		async: false,
		success: function (data) {			
			if (data.ResultSet.Table.length > 0) {
				$('#txtVisitNo').attr('disabled',true);
				total = 0;
				amount = 0;
				$('#txtTotal').val(0);
				$('#txtVisitNo').val('');
				$('#txtVisitNo,textarea').val('');
				$('#txtVisitNo').val(objBO.prm_1);			
				var tbody = "";				
				$.each(data.ResultSet.Table, function (key, val) {
					if (val.trnStatus == 'Refunded') {
						tbody += "<tr style='background:#ffb8b8'>";
					}
					else {
						tbody += "<tr>";
					}
					tbody += "<td>" + val.UHID + "</td>";
					tbody += "<td>" + val.patient_name + "</td>";
					tbody += "<td>" + val.DoctorName + "</td>";
					tbody += "<td>" + val.gender + "</td>";
					tbody += "<td>" + val.mobile_no + "</td>";
					tbody += "<td>" + val.visitNo + "</td>";
					tbody += "<td>" + val.VisitDate + "</td>";
					tbody += "<td>" + val.PanelName + "</td>";
					tbody += "<td>" + val.GrossAmount + "</td>";
					tbody += "<td>" + val.discount + "</td>";
					tbody += "<td>" + val.NetAmount + "</td>";				
					tbody += "<td>" + val.trnStatus + "</td>";
					tbody += "</tr>";

					if (val.IsCredit == 0) {
						$('#btnCancel').hide('slide', { diretion: 'right' }, 500, function () {
							$('#btnRefund').show('slide', { direction: 'right' }, 500);
						});
						$('span.selection').find('span[aria-labelledby=select2-ddlPayMode-container]').show('slide', { diretion: 'left' }, 500);
					}
					else {
						$('#btnCancel').show('slide', { diretion: 'right' }, 500, function () {
							$('#btnRefund').hide('slide', { direction: 'right' }, 500);
						});
						$('span.selection').find('span[aria-labelledby=select2-ddlPayMode-container]').hide('slide', { diretion: 'left' }, 500);
					}
					//if (val.trnStatus == 'Refunded') {
					//	$('input[type=button]:not(#btnSearch)').prop('disabled', true).css('display', 'block');
					//}
					//else {
					//	$('input[type=button]').prop('disabled', false);
					//}
				});
				$('#tblDetails tbody').append(tbody);

				var html = "";
				$.each(data.ResultSet.Table1, function (key, val) {
					if (val.trnStatus == 'Refunded') {
						html += "<tr style='background:#ffb8b8'>";
					}
					else {
						html += "<tr>";
					}				
					html += "<td style='display:none'>" + val.ItemId + "</td>";
					html += "<td>" + val.ItemName + "</td>";
					html += "<td class='text-right'>" + val.GrossAmount + "</td>";
					html += "<td class='text-right'>" + val.discount + "</td>";
					html += "<td class='text-right'>" + val.NetAmount + "</td>";
					if (val.trnStatus != 'Refunded') {
						html += "<td><input type='checkbox'/></td>";
					}
					else {
						html += "<td>-</td>";
					}					
					html += "</tr>";
				});
				$('#tblPayment tbody').append(html);
			}
			else {
				alert("Data Not Found..");
			};
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function Opd_ServiceRefund() {
	if (Validation()) {
		var url = config.baseUrl + "/api/Service/Opd_ServiceRefund";
		var objBO = {};
		var item = [];
		objBO.hosp_id = Active.unitId;
		objBO.VisitNo = $('#txtVisitNo').val();
		objBO.CancelReason = $('#txtRemark').val();
		$('#tblPayment tbody tr.item').each(function () {
			var itemid = $(this).find('td:eq(0)').text();
			item.push(itemid);
		});
		objBO.ItemIdList = item.join(',');
		objBO.amount = $('#txtTotal').val();
		objBO.PayMode = $('#ddlPayMode option:selected').text();
		objBO.IPAddress = '-';
		objBO.login_id = Active.userId;
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			contentType: "application/json;charset=utf-8",
			dataType: "JSON",
			async: false,
			success: function (data) {
				if (data.includes('Success')) {
					alert(data);
					$('#txtVisitNo,textarea').val('');
					$('#ddlPayMode').prop('selectedIndex', '0').change();
					$('#tblDetails tbody').empty();
					$('#tblPayment tbody').empty();
					$('#txtTotal tbody').val(0);
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
}
function Receipt(tnxid) {
	var url = "../Print/ServiceReceipt?TnxId=" + tnxid;
	window.open(url, '_blank');
}
function Validation() {
	var Total = parseFloat($('#txtTotal').val());
	var Remark = $('#txtRemark').val();
	var PayMode = $('#ddlPayMode option:selected').text();
	var Panel = $('#tblDetails tbody tr').find('td:eq(7)').text();

	if (Panel == 'CASH') {
		if (Total <= 0) {
			alert('Please Choose Refund Amount..');
			return false;
		}
		if (PayMode == 'Pay Mode') {
			$('#ddlPayMode').focus();
			alert('Please Choose Pay Mode..');
			return false;
		}
	}
	else if (Panel != 'CASH') {
		if (Total <= 0) {
			alert('Please Choose Refund Amount..');
			return false;
		}
	}
	if (Remark == '') {
		$('#txtRemark').focus();
		alert('Please Provide Cancellation Remark..');
		return false;
	}
	return true;
}