$(document).ready(function () {
	LedgerList();
	searchTable('txtSearch', 'tblLedger');
	$('#tblLedger tbody').on('click', 'button', function () {
		ledgerid = $(this).data('ledgerid');
		selectRow($(this));
		LedgerByLedgerId(ledgerid);
	});
});

function LedgerList() {
	var url = config.baseUrl + "/api/Account/AC_AccountMasterQueries";
	var objBO = {};
	objBO.Logic = 'LedgerList';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$('#tblLedger tbody').empty();
				var tbody = "";
				var temp = "";
				$.each(data.ResultSet.Table, function (key, val) {
					if (temp != val.SubGroup) {
						tbody += "<tr style='background:#addbff'>";
						tbody += "<td colspan='4'>" + val.SubGroup + "</td>";
						tbody += "</tr>";
						temp = val.SubGroup;
					}
					tbody += "<tr>";
					tbody += "<td>" +
						'<button type="button" data-ledgerid="' + val.ledgerID + '" class="btn-success" style="border: none;"><i class="fa fa-edit"></i></category>' +
						"</td>";
					tbody += "<td>" + val.ledgerID + "</td>";
					tbody += "<td>" + val.ledgerName + "</td>";
					tbody += "<td>" + val.opening + "</td>";
					tbody += "</tr>";
				});
				$('#tblLedger tbody').append(tbody);
				$('#ddlGroup').empty().append($('<option>Select Group</option>'));
				$.each(data.ResultSet.Table1, function (key, val) {
					$('#ddlGroup').append($('<option></option>').val(val.SubGroupID).html(val.display_name)).select2();
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
function LedgerByLedgerId(ledgerid) {
	var url = config.baseUrl + "/api/Account/AC_AccountMasterQueries";
	var objBO = {};
	objBO.prm_1 = ledgerid;
	objBO.Logic = 'LedgerByLedgerId';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {							
				$.each(data.ResultSet.Table, function (key, val) {
					$('#txtLedgerId').text(val.ledgerID);
					$('#txtLedgerName').val(val.ledgerName);
					$('#txtPanNo').val(val.pan_no);
					$('#txtGSTNo').val(val.gst_no);
					$('#txtContactPerson').val(val.contact_person);
					$('#txtPartyAddress	').val(val.address);
					$('#txtOpeningAmt').val(val.opening);
					$('#txtExternalName').val(val.externalName);
					$('#ddlGroup option').map(function () {
						if ($(this).val() == val.SubGroupID) {
							$('#ddlGroup').prop('selectedIndex', '' + $(this).index() + '').change();
						}
					});
					$('#btnSaveLedger').val('Update').addClass('btn-warning');
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
function CreateLedgers() {
	if (Validation()) {
		var logic;
		if ($('#btnSaveLedger').val() == 'Submit') {
			logic = 'Insert';
		}
		else if ($('#btnSaveLedger').val() == 'Update') {
			logic = 'Update';
		}
		var url = config.baseUrl + "/api/Account/AC_CreateLedgers";
		var objBO = {};
		objBO.ledgerID = $('#txtLedgerId').text();
		objBO.unit_id = Active.unitId;
		objBO.ledger_name = $('#txtLedgerName').val().toUpperCase();
		objBO.subGroupID = $('#ddlGroup option:selected').val();
		objBO.contact_person = $('#txtContactPerson').val().toUpperCase();
		objBO.ExternalName = $('#txtExternalName').val().toUpperCase();
		objBO.party_address = $('#txtPartyAddress').val().toUpperCase();
		objBO.openAmt = $('#txtOpeningAmt').val();
		objBO.panNo = $('#txtPanNo').val().toUpperCase();
		objBO.gst_no = $('#txtGSTNo').val().toUpperCase();
		objBO.Logic = logic;
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Successfully')) {
					alert(data);
					LedgerList();
					Clear();
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
function Validation() {
	var Group = $('#ddlGroup option:selected').text();;
	var LedgerName = $('#txtLedgerName').val();

	if (Group == 'Select Group') {
		$('span.selection').find('span[aria-labelledby=select2-ddlGroup-container]').css('border-color', 'red').focus();
		alert('Please Select Group..');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlGroup-container]').removeAttr('style');
	}
	if (LedgerName == '') {
		$('#txtLedgerName').css('border-color', 'red').focus();
		alert('Please Provide Ledger Name..');
		return false;
	}
	else {
		$('#txtLedgerName').removeAttr('style');
	}
	return true;
}

function Clear() { 
	$('#ddlGroup').prop('selectedIndex', '0').change();
	$('#txtLedgerId').text('');
	$('#txtLedgerName').val('');
	$('#txtPanNo').val('');
	$('#txtGSTNo').val('');
	$('#txtContactPerson').val('');
	$('#txtExternalName').val('');
	$('#txtOpeningAmt').val('');
	$('#txtPartyAddress').val('');
	$('#btnSaveLedger').val('Submit').removeClass('btn-warning');
	$('#btnSaveLedger').val('Submit').addClass('btn-success');
}