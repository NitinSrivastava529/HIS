var logic = ''
var cityname = ''

$(document).ready(function () {
	GetVendorMasterList();
	$('#txtSearch').on('keyup', function () {
		var val = $(this).val().toLocaleLowerCase();
		$('#tblVendor tbody tr').filter(function () {
			$(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
		});
	});
	$('#btnSaveVendor').on('click', function () {
		var val = $(this).val();
		if (val == 'Submit') {
			InsertVendorMaster();
		}
		else if (val == 'Update') {
			UpdateVendorMaster();
		}
	});
	$('#tblVendor tbody').on('click', '.switch', function () {
		isCheck = $(this).find('input[type=checkbox]').is(':checked');
		var vendorid = $(this).find('input[type=checkbox]').data('vendorid');
		var statusflag = $(this).find('input[type=checkbox]').data('isactive');
		if (isCheck) {
			if (statusflag == 'Active') {
				UpdateStatus(vendorid, 'N');
			}
			else {
				UpdateStatus(vendorid, 'Y');
			}
		}
	});
	$('#tblVendor tbody').on('click', '.getVendor', function () {
		vendorid = $(this).data('vendorid')
		$(this).closest('tr').parents('table').find('tr td').removeAttr('style');
		$(this).closest('tr').find('td:eq(1),td:eq(2)').css({ 'background':'#0076d0','color':'#fff'})
		GetVendorByVendorId(vendorid);
	});

	$('.ddlCountry').on('change', function () {
		var countryid = $(this).find('option:selected').val();
		GetStateByCountry(countryid);
	});
	$('.ddlState').on('change', function () {
		var stateid = $(this).find('option:selected').val();
		GetCityByState(stateid);
	});
});

function GetVendorMasterList() {
	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objBO = {};
	objBO.Logic = 'All';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#tblVendor tbody').empty();
				$.each(data.ResultSet.Table3, function (key, val) {
					$('<tr><td>' +
						'<category data-vendorid="' + val.vendor_id + '" class="btn btn-warning btn-xs getVendor"><i class="fa fa-edit"></i></category></td>' +
						'<td>' + val.vendor_id + '</td><td>' + val.vendor_name + '</td>' +
						'<td style="display:none;color:' + val.IsActive_color + '">' + val.IsActive + '</td>' +
						'<td>' +
						'<label class="switch">' +
						'<input type="checkbox" data-vendorid=' + val.vendor_id + ' data-isactive=' + val.IsActive + ' class="IsActive" id="chkActive" ' + val.checked + '>' +
						'<span class="slider round"></span>' +
						'</label >' +
						'</div></td></tr>').appendTo($('#tblVendor tbody'));
				});
				$('#ddlCountry').empty().append($('<option>Select Country</option>')).change();
				$.each(data.ResultSet.Table4, function (key, val) {
					$('#ddlCountry').append($('<option data-text="' + val.country + '"></option>').val(val.CountryID).html(val.country)).select2();
				});
				$('#ddlState').empty().append($('<option value="prompt">Select State</option>')).change();
				$('#ddlCity').empty().append($('<option>Select City</option>')).change();
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
function GetVendorByVendorId(vendorid) {
	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objBO = {};
	objBO.vendor_id = vendorid;
	objBO.Logic = 'GetVendorByVendorId';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$.each(data.ResultSet.Table, function (key, val) {
					$('#txtVendorName').val(val.vendor_name);
					$('#txtContactPerson').val(val.contact_person);
					$('#txtAddress1').val(val.address1);
					$('#txtAddress2').val(val.address2);
					$('#txtAddress3').val(val.address3);
					$('#txtAccountCode').val(val.ledgerId);
					$('#txtPin').val(val.pin);
					$('#txtContactNo').val(val.contact_no);
					$('#txtEmail').val(val.email);
					$('#txtPaymentDays').val(val.payment_days);
					$('#txtGstNo').val(val.gst_no);
					$('#ddlPaymentMode').val(val.payment_mode);
					$('#txtDrugLicenseNo').val(val.drug_lic_no);
					$('#txtNotes').val(val.notes);
					$('span[data-vendorid]').text(val.vendor_id);
					$('#btnSaveVendor').val('Update').addClass('btn-warning');
					var country = val.country;
					var state = val.state;
					var city = val.city;
					cityname = city;
					$('#ddlState option').map(function () {
						if ($(this).data('text') == state) {
							$('.ddlState').val($(this).val()).change()
							logic = "Update";
						}
					});
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
function GetStateByCountry(cId) {
	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objBO = {};
	objBO.country_id = cId;
	objBO.Logic = 'GetStateByCountry';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#ddlState').empty().append($('<option value="prompt">Select State</option>')).change();
				$.each(data.ResultSet.Table, function (key, val) {
					$('#ddlState').append($('<option data-text="' + val.state_name + '" data-countryid=' + val.country_id + '></option>').val(val.state_code).html(val.state_name)).select2();
				});
			}
			else {
				alert("Error");
			};
		},
		complete: function (data) {
			$('.ddlState').val(32).change();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetCityByState(sId) {

	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objBO = {};
	objBO.state_id = sId;
	objBO.Logic = 'GetCityByState';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#ddlCity').empty().append($('<option>Select City</option>')).change();
				$.each(data.ResultSet.Table, function (key, val) {
					$('#ddlCity').append($('<option data-text="' + val.distt_name + '" data-stateid=' + val.state_code + '></option>').val(val.dist_code).html(val.distt_name)).select2();
				});
			}
			else {
				alert("Error");
			};
		},
		complete: function (response) {

			if (logic == 'Update') {
				$('.ddlCity option').map(function () {
					if ($(this).data('text') == cityname) {
						$('.ddlCity').val($(this).val()).change()
					}
				});
			}

		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertVendorMaster() {
	if (Validate()) {
		var url = config.baseUrl + "/api/Warehouse/InsertUpdateVendorMaster";
		var objBO = {};
		objBO.hosp_id = Active.unitId;
		objBO.vendor_name = $('#txtVendorName').val().toUpperCase();
		objBO.contact_person = $('#txtContactPerson').val();
		objBO.address1 = $('#txtAddress1').val();
		objBO.address2 = $('#txtAddress2').val();
		objBO.address3 = $('#txtAddress3').val();
		objBO.city = $('#ddlCity option:selected').text();
		objBO.state = $('#ddlState option:selected').text();
		objBO.country = $('#ddlCountry option:selected').text();
		objBO.pin = $('#txtPin').val();
		objBO.ledgerid = $('#txtAccountCode').val();
		objBO.contact_no = $('#txtContactNo').val();
		objBO.email = $('#txtEmail').val();
		objBO.payment_mode = $('#ddlPaymentMode option:selected').text();
		objBO.payment_days = $('#txtPaymentDays').val();
		objBO.gst_no = $('#txtGstNo').val();
		objBO.drug_lic_no = $('#txtDrugLicenseNo').val();
		objBO.notes = $('#txtNotes').val();
		objBO.login_id = Active.userId;
		objBO.Logic = 'Insert';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data == 'Successfully Saved') {
					Clear();
					GetVendorMasterList();
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
function UpdateVendorMaster() {
	if (Validate()) {
		var url = config.baseUrl + "/api/Warehouse/InsertUpdateVendorMaster";
		var objBO = {};
		objBO.vendor_id = $('span[data-vendorid]').text();
		objBO.vendor_name = $('#txtVendorName').val().toUpperCase();
		objBO.contact_person = $('#txtContactPerson').val();
		objBO.address1 = $('#txtAddress1').val();
		objBO.address2 = $('#txtAddress2').val();
		objBO.address3 = $('#txtAddress3').val();
		objBO.city = $('#ddlCity option:selected').text();
		objBO.state = $('#ddlState option:selected').text();
		objBO.country = $('#ddlCountry option:selected').text();
		objBO.pin = $('#txtPin').val();
		objBO.ledgerid = $('#txtAccountCode').val();
		objBO.contact_no = $('#txtContactNo').val();
		objBO.email = $('#txtEmail').val();
		objBO.payment_mode = $('#ddlPaymentMode option:selected').text();
		objBO.payment_days = $('#txtPaymentDays').val();
		objBO.gst_no = $('#txtGstNo').val();
		objBO.drug_lic_no = $('#txtDrugLicenseNo').val();
		objBO.notes = $('#txtNotes').val();
		objBO.login_id = Active.userId;
		objBO.Logic = 'Update';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				alert(data);
				Clear();
				GetVendorMasterList();
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
function UpdateStatus(vendorid, statusflag) {
	var url = config.baseUrl + "/api/Warehouse/InsertUpdateVendorMaster";
	var objBO = {};
	objBO.vendor_id = vendorid;
	objBO.active_flag = statusflag;
	objBO.Logic = 'UpdateStatus';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			GetVendorMasterList();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

//Validation
function Validate() {
	var VendorName = $('#txtVendorName').val();
	var ContactPerson = $('#txtContactPerson').val();
	var Address1 = $('#txtAddress1').val();
	var Address2 = $('#txtAddress2').val();
	var Address3 = $('#txtAddress3').val();
	var Country = $('#ddlCountry option:selected').text();
	var State = $('#ddlState option:selected').text();
	var City = $('#ddlCity option:selected').text();
	var Pin = $('#txtPin').val();
	var ContactNo = $('#txtContactNo').val();
	var PaymentMode = $('#ddlPaymentMode option:selected').text();
	var PaymentDays = $('#txtPaymentDays').val();
	var GstNo = $('#txtGstNo').val();
	var DrugLicenseNo = $('#txtDrugLicenseNo').val();
	var Notes = $('#txtNotes').val();
	var AccountCode = $('#txtAccountCode').val();

	if (VendorName == '') {
		$('#txtVendorName').css({ 'border-color': 'red' }).focus();
		alert('Please Provide Vendor Name..');
		return false;
	}
	else {
		$('#txtVendorName').removeAttr('style').focus();
	}
	if (ContactPerson == '') {
		$('#txtContactPerson').css({ 'border-color': 'red' }).focus();
		alert('Please Provide Contact Person..');
		return false;
	}
	else {
		$('#txtContactPerson').removeAttr('style').focus();
	}
	if (Address1 == '') {
		$('#txtAddress1').css({ 'border-color': 'red' }).focus();
		alert('Please Provide Address 1..');
		return false;
	}
	else {
		$('#txtAddress1').removeAttr('style').focus();
	}
	//if (Address2 == '') {
	//    $('#txtAddress2').css({ 'border-color': 'red' }).focus();
	//    alert('Please Provide Address 2..');
	//    return false;
	//}
	//else {
	//    $('#txtAddress2').removeAttr('style').focus();
	//}
	//if (Address3 == '') {
	//    $('#txtAddress3').css({ 'border-color': 'red' }).focus();
	//    alert('Please Provide Address 3..');
	//    return false;
	//}
	//else {
	//    $('#txtAddress3').removeAttr('style').focus();
	//}
	if (Country == 'Select Country') {
		$('span.selection').find('span[aria-labelledby=select2-ddlCountry-container]').css('border-color', 'red').focus();
		alert('Please Select Country..');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlCountry-container]').css('border-color', 'red').removeAttr('style');
	}
	if (State == 'Select State') {
		$('span.selection').find('span[aria-labelledby=select2-ddlState-container]').css('border-color', 'red').focus();
		alert('Please Select State..');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlState-container]').removeAttr('style');
	}
	if (City == 'Select City') {
		$('span.selection').find('span[aria-labelledby=select2-ddlCity-container]').css({ 'border-color': 'red' }).focus();
		alert('Please Select City..');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlCity-container]').removeAttr('style').focus();
	}
	//if (AccountCode == '') {
	//	$('#txtAccountCode').css({ 'border-color': 'red' }).focus();
	//	alert('Please Provide Account Code..');
	//	return false;
	//}
	//else {
	//	$('#txtAccountCode').removeAttr('style');
	//}
	//if (Pin == '') {
	//    $('#txtPin').css({ 'border-color': 'red' }).focus();
	//    alert('Please Provide Pin..');
	//    return false;
	//}
	//else {
	//    $('#txtPin').removeAttr('style').focus();
	//}
	if (ContactNo == '') {
		$('#txtContactNo').css({ 'border-color': 'red' }).focus();
		alert('Please Provide Contact No..');
		return false;
	}
	else {
		$('#txtContactNo').removeAttr('style').focus();
	}
	if (PaymentMode == 'Select Payment Mode') {
		$('#ddlPaymentMode').css({ 'border-color': 'red' }).focus();
		alert('Please Select Payment Mode..');
		return false;
	}
	else {
		$('#ddlPaymentMode').removeAttr('style').focus();
	}
	//if (PaymentDays == '') {
	//    $('#txtPaymentDays').css({ 'border-color': 'red' }).focus();
	//    alert('Please Select Payment Days..');
	//    return false;
	//}
	//else {
	//    $('#txtPaymentDays').removeAttr('style').focus();
	//}
	if (GstNo == '') {
		$('#txtGstNo').css({ 'border-color': 'red' }).focus();
		alert('Please Provide GST No..');
		return false;
	}
	else {
		$('#txtGstNo').removeAttr('style').focus();
	}
	//if (DrugLicenseNo == '') {
	//    $('#txtDrugLicenseNo').css({ 'border-color': 'red' }).focus();
	//    alert('Please Provide Drug License No..');
	//    return false;
	//}
	//else {
	//    $('#txtDrugLicenseNo').removeAttr('style').focus();
	//}
	//if (Notes == '') {
	//    $('#txtNotes').css({ 'border-color': 'red' }).focus();
	//    alert('Please Provide Notes..');
	//    return false;
	//}
	//else {
	//    $('#txtNotes').removeAttr('style').focus();
	//}

	return true;
}
function Clear() {
	$('input[type=text],textarea').val('');
	$('select').prop('selectedIndex', '0');
	$('#btnSaveVendor').val('Submit').removeClass('btn-warning').addClass('btn-success');
}