var global = {
	ipdno: '',
	RefCode: ''
}
$(document).ready(function () {
	CloseSidebar();
	$('#ddlReferralForCommission').select2();
	$('#btnSetReferral').attr('disabled', true);
	$('#btnSyncProcess').attr('disabled', true);
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	$('#tblPatient tbody').on('click', 'button', function () {
		selectRow($(this));
		var ipdno = $(this).closest('tr').find('td:eq(0)').text();
		CommisionCategoryList(ipdno)
	});
	$('#tblReferral tbody').on('click', 'button', function () {
		var refCode = $(this).closest('tr').find('td:eq(0)').text();
		var refName = $(this).closest('tr').find('td:eq(1)').text();


		$('#ddlReferralForCommission').empty();
		$('#ddlReferralForCommission').append($('<option></option>').val(refCode).html(refName)).change();

		$('#tblReferral tbody').empty();
		$('#ReferralSection').slideToggle();
	});
});
function GetPatientDetailByIPDNo() {
	$("#tblPatient tbody").empty();
	$("#tblCommissionList tbody").empty();
	$('#txtTotalAmount').val("0");
	$('#txtExempted').val("0");
	$('#txtNetAmount').val("0");
	$('#txtComissionAmount').val("0");
	var url = config.baseUrl + "/api/commission/GetPatientDetailByIPDNo";
	var IPDNo = $('#txtIPDNo').val();
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(IPDNo),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#tblPatient tbody').empty();
			if (data.ResultSet == null) {
				$('#btnSetReferral').attr('disabled', true);
				//$('#txtIPDNo').attr('disabled', false);
				alert('No Record Found..!')
				return
			}
			else {
				$('#btnSetReferral').attr('disabled', false);
				//$('#txtIPDNo').attr('disabled', true);
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					global.ipdno = IPDNo;
					tbody += "<tr>";
					tbody += "<td>" + IPDNo + "</td>";
					tbody += "<td>" + val.PNAME + "</td>";
					tbody += "<td>" + val.Gender + "</td>";
					tbody += "<td>" + val.Consultant_Name + "</td>";
					tbody += "<td>" + val.Company_name + "</td>";
					tbody += "<td>" + ddmmyyToyymmdd(val.DateOfAdmit.split('T')[0], '-') + "</td>";
					tbody += "<td>" + ddmmyyToyymmdd(val.DateOfDischarge.split('T')[0], '-') + "</td>";
					tbody += "<td><button class='tbl-btn btn-warning'>>></button></td>";
					tbody += "</tr>";
				});
				$('#tblPatient tbody').append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ReferralSearch() {
	$('#tblReferral tbody').empty();
	var url = config.baseUrl + "/api/commission/HIS_ShareQueries";
	var objBO = {};
	objBO.trn_type = '-';
	objBO.from = '-';
	objBO.to = '-';
	objBO.prm_1 = $('#txtSearchReferral').val();
	objBO.prm_2 = '-';
	objBO.Logic = "ReferralForCommision";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var tbody = '';
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						tbody += "<tr>";
						tbody += "<td style='display:none'>" + val.ref_code + "</td>";
						tbody += "<td>" + val.refName + "</td>";
						tbody += "<td>" + val.mobile_no + "</td>";
						tbody += "<td>" + val.locality + "</td>";
						tbody += "<td>" + val.address + "</td>";
						tbody += "<td><button class='btn-warning'><i class='fa fa-sign-in'></i></button></td>";
						tbody += "</tr>";
					});
					$('#tblReferral tbody').append(tbody);
					$('#ReferralSection').slideToggle();
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function SetReferral() {
	if ($('#ddlReferralForCommission option:selected').text() == 'Select Referral') {
		alert('Please Choose Referral..!');
		return;
	}
	if ($('#txtIPDNo').val() == '') {
		alert('Please Provide IPD No..!');
		return;
	}
	var url = config.baseUrl + "/api/commission/HIS_InsertReferralcommission";
	var objBO = {};
	objBO.IPDNo = $('#txtIPDNo').val();
	objBO.ref_code = $('#ddlReferralForCommission option:selected').val();
	objBO.patient_name = $('#tblPatient tbody').find('tr:eq(0)').find('td:eq(1)').text();
	objBO.gender = $('#tblPatient tbody').find('tr:eq(0)').find('td:eq(2)').text();
	objBO.commission_Perc = '10';
	objBO.commission_amount = '23.00';
	objBO.login_id = Active.userId;
	objBO.Logic = "SetReferral";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				let ref_name = $('#ddlReferralForCommission option:selected').text()
				alert(data);
				global.ipdno = $('#tblPatient tbody').find('tr.select-row').find('td:eq(0)').text();;
				global.RefCode = objBO.ref_code;
				$('#referralSection').show("slide", { direction: "right" }, 500);
				$('#txtAllotedReferral').html(ref_name.concat(' [', objBO.ref_code, ']'));
				$('#btnSyncProcess').attr('disabled', false);
				$('#btnSetReferral').attr('disabled', true);
			}
			else {
				global.ipdno = '';
				global.RefCode = '';
				$('#referralSection').hide("slide", { direction: "right" }, 500);
				$('#txtAllotedReferral').html('');
				$('#btnSetReferral').attr('disabled', true);
				$('#btnSyncProcess').attr('disabled', true);
				alert(data);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function CommisionCategoryList(prm1) {
	var url = config.baseUrl + "/api/commission/HIS_ShareQueries";
	var objBO = {};
	objBO.trn_type = '-';
	objBO.from = '-';
	objBO.to = '-';
	objBO.prm_1 = prm1;
	objBO.prm_2 = '-';
	objBO.Logic = "Commision:CategoryList";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			$('#tblCommissionList tbody').empty();
			var tbody = "";
			var count = 0;
			var Amount = 0;
			var Exclusion = 0;
			var NetAmount = 0;
			var comission = 0;
			$.each(data.ResultSet.Table1, function (key, val) {
				count++;
				Amount += parseFloat(val.Amount);
				Exclusion += parseFloat(val.Exclusion);
				NetAmount += parseFloat(val.NetAmount);
				comission += parseFloat(val.comission);
				tbody += "<tr>";
				tbody += "<td>" + count + "</td>";
				tbody += "<td>" + val.CategoryName + "</td>";
				tbody += "<td>" + val.Amount.toFixed(0) + "</td>";
				tbody += "<td>" + val.Exclusion.toFixed(0) + "</td>";
				tbody += "<td>" + val.NetAmount.toFixed(0) + "</td>";
				tbody += "<td>" + val.comission.toFixed(0) + "</td>";
				tbody += "</tr>";
			});
			$('#txtTotalAmount').val(Amount.toFixed(0));
			$('#txtExempted').val(Exclusion.toFixed(0));
			$('#txtNetAmount').val(NetAmount.toFixed(0));
			$('#txtComissionAmount').val(comission.toFixed(0));
			$('#tblCommissionList tbody').append(tbody);
			$.each(data.ResultSet.Table, function (key, val) {
				if (val.ref_code.length > 1) {
					global.ipdno = val.IPDNo;
					global.RefCode = val.ref_code;
					$('#referralSection').show("slide", { direction: "right" }, 500);
					$('#txtAllotedReferral').html(val.ref_name.concat(' [', val.ref_code, ']'));
					$('#btnSyncProcess').attr('disabled', false);
					return
				}
				else {
					global.ipdno = '';
					global.RefCode = '';
					$('#referralSection').hide("slide", { direction: "right" }, 500);
					$('#txtAllotedReferral').html('');
					$('#btnSetReferral').attr('disabled', true);
					$('#btnSyncProcess').attr('disabled', true);
				}
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function SyncProcess() {
	$('#LineLoader').remove();
	$('#btnSyncProcess').html('Share Processing...<img src="/images/loading.gif" class="img-responsive" style="width:100% !important;height: 4px;"/>');
	if (global.ipdno == '') {
		alert('Please Choose Referral');
		return;
	}
	var url = config.baseUrl + "/api/commission/Sync_IPDDatafromHISToChandan";
	var objBO = {};
	objBO.IPDNo = global.ipdno;
	objBO.RefCode = global.RefCode;
	objBO.login_id = Active.userId;
	objBO.commisionPerc = $('#txtPercComm').val();
	txtPercComm
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert(data);
				CommisionCategoryList(global.ipdno);
			}
			else {
				alert(data);
			}
		},
		complete: function () {
			$('#btnSyncProcess').html('Sync & Process');
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}