
$(window).on('load', function () {
	GetState();
	GetCity();
});
$(document).ready(function () {


	//<<<-------------Employee Events------------->>>
	//GetEmployee();
	$('#btnSaveEmployee').on('click', function () {
		InsertEmployee();
	});
	$('#txtEmployeeCode').on('keyup', function () {
		var EmpCode = $(this).val();
		GetByEmpCode(EmpCode);
	});

	

});
function GetEmployee() {

	var url = config.baseUrl + "/api/ApplicationResource/MasterQueries";
	var objBO = {};
	objBO.Logic = "GetEmployee";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#tblSubMenu tbody").empty();

			if (data.ResultSet != null) {
				$.each(data.ResultSet.Table, function (key, val) {
					//var flag = $('span[class=flag]').text();
					//
					//if (flag == 'Enabled') {
					//    $(this).find($('span[class=flag]').text() == 'Enabled').css('color', 'red');
					//}
					//else {
					//    $(this).find($('span[class=flag]').text() == 'Enabled').css('color', 'red');
					//}
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetByEmpCode(EmpCode) {
	var url = config.baseUrl + "/api/ApplicationResource/MasterQueries";
	var objBO = {};
	objBO.EmployeeCode = EmpCode;
	objBO.Logic = "GetByEmpCode";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {

			if (data != '') {
				$.each(data.ResultSet.Table, function (key, val) {
					$("#txtEmployeeName").val(val.emp_name);
					$("#ddlGender").val(val.gender).change();
					$("#ddlMaritalStatus").val(val.marital_status);
					$("#txtDOB").val(val.d_o_b);
					$("#txtMobileNo").val(val.mobile_no);
					$('#txtHusbandWife').val(val.husband_name);
					$('#txtFatherName').val(val.emp_father_name);
					$('#txtMotherName').val(val.emp_mother_name);
					$('#txtLocalAddress').val(val.loc_address);
					$('#txtLocLocality').val(val.loc_locality);
					$('#ddlLocState option').map(function () {
						if ($(this).text() == val.loc_state) return this;
					}).attr('Selected', 'Selected');
					$('#ddlLocCity option').text(val.loc_city);
					$('#txtPerAddress').val(val.perm_address);
					$('#txtPerLocality').val(val.perm_locality);
					$('#ddlPerState option').map(function () {
						if ($(this).text() == val.perm_state) return this;
					}).attr('Selected', 'Selected');
					$('#ddlPerCity option').text(val.perm_city);
					$('#txtQualification').val(val.qualification);
					$('#txtExperience').val(val.experience);
					$('#ddlDesignation option').map(function () {
						if ($(this).text() == val.designation) return this;
					}).attr('Selected', 'Selected');
					$('#ddlBloodGroup').val(val.blood_group);
					$('#txtAadharNo').val(val.aadhar_no);
					$('#ddlUserType').val(val.user_type);
					$('#txtPassword').val(val.netpassword);
					$('#txtConfirmPassword').val(val.netpassword);
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertEmployee() {
	if (ValidationEmployee()) {

		var url = config.baseUrl + "/api/ApplicationResource/InsertModifyMasterDetails";
		var objBO = {};
		objBO.EmployeeName = $('#txtEmployeeName').val();
		objBO.Gender = $('#ddlGender option:selected').text();
		objBO.MaritalStatus = $('#ddlMaritalStatus option:selected').text();
		objBO.DOB = $('#txtDOB').val();
		objBO.MobileNo = $('#txtMobileNo').val();
		objBO.HusbandWife = $('#txtHusbandWife').val();
		objBO.FatherName = $('#txtFatherName').val();
		objBO.MotherName = $('#txtMotherName').val();
		objBO.LocAddress = $('#txtLocalAddress').val();
		objBO.LocLocality = $('#txtLocLocality').val();
		objBO.LocState = $('#ddlLocState option:selected').text();
		objBO.LocCity = $('#ddlLocCity option:selected').text();
		objBO.PerAddress = $('#txtPerAddress').val();
		objBO.PerLocality = $('#txtPerLocality').val();
		objBO.PerState = $('#ddlPerState option:selected').text();
		objBO.PerCity = $('#ddlPerCity option:selected').text();
		objBO.Qualification = $('#txtQualification').val();
		objBO.Experience = $('#txtExperience').val();
		objBO.Designation = $('#ddlDesignation option:selected').text();
		objBO.BloodGroup = $('#ddlBloodGroup option:selected').text();
		objBO.AadharNo = $('#txtAadharNo').val();
		objBO.UserType = $('#ddlUserType option:selected').text();
		objBO.Password = $('#txtPassword').val();
		objBO.ConfirmPassword = $('#txtConfirmPassword').val();
		objBO.Logic = "InsertEmployee";
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data != '') {
					alert('Employee Record Saved Succesfully..!');
				}
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}

//<<<-------------State Master Section------------->>>
function GetState() {

	var url = config.baseUrl + "/api/ApplicationResource/MasterQueries";
	var objBO = {};
	objBO.Logic = "GetState";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#tblState tbody").empty();
			$("#ddlState").empty().append($('<option>Select State</option>'));
			$("#ddlLocState").empty().append($('<option>Select State</option>'));
			$("#ddlPerState").empty().append($('<option>Select State</option>'));
			$("#ddlLocCity").empty().append($('<option>Select City</option>'));
			$("#ddlPerCity").empty().append($('<option>Select City</option>'));
			if (data != '') {
				if (data.ResultSet != null) {
					$.each(data.ResultSet.Table, function (key, val) {
						$("<tr><td>" + val.state_code + "</td><td>" + val.state_name + "</td><td>" + val.flag + "</td> <td>" + val.CreatedOn + "</td> <td>" +
							" <div class='input-group-btn'>" +
							"<span class='btn btn-danger disable' data-statecode=" + val.state_code + "  data-flag=" + val.flag + "><i class='fa fa-check'></i></span>" +
							"<span class='btn btn-primary edit' data-statecode=" + val.state_code + "><i class='fa fa-edit'></i></span>" +
							"</div></td></tr>").appendTo($("#tblState tbody"));
						$("#ddlState").append($("<option></option>").val(val.state_code).html(val.state_name));
						$("#ddlLocState").append($("<option></option>").val(val.state_code).html(val.state_name));
						$("#ddlPerState").append($("<option></option>").val(val.state_code).html(val.state_name));
					});
				}

			}
			else {
				alert("Error");
			};
		},
		complete: function (re) {

		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetByStateCode(StateCode) {

	var url = config.baseUrl + "/api/ApplicationResource/MasterQueries";
	var objBO = {};
	objBO.Logic = "GetStateByStateCode";
	objBO.StateCode = StateCode;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#txtStateName").val('');
			if (data != '') {
				$.each(data.ResultSet.Table, function (key, val) {
					$("#btnSaveState").hide();
					$("#btnUpdateState").show();
					$("#btnUpdateState").data('statecode', val.state_code);
					$("#txtStateName").val(val.state_name);
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

//<<<-------------Validation Section------------->>>

function ValidationEmployee() {
	var EmpName = $('#txtEmployeeName').val();
	var Gender = $('#ddlGender option:selected').text();
	var MaritalStatus = $('#ddlMaritalStatus option:selected').text();
	var DOB = $('#txtDOB').val();
	var MobileNo = $('#txtMobileNo').val();
	var HusbandWife = $('#txtHusbandWife').val();
	var FatherName = $('#txtFatherName').val();
	var MotherName = $('#txtMotherName').val();
	var LocAddress = $('#txtLocalAddress').val();
	var LocLocality = $('#txtLocLocality').val();
	var LocState = $('#ddlLocState option:selected').text();
	var LocCity = $('#ddlLocCity option:selected').text();
	var PerAddress = $('#txtPerAddress').val();
	var PerLocality = $('#txtPerLocality').val();
	var PerState = $('#ddlPerState option:selected').text();
	var PerCity = $('#ddlPerCity option:selected').text();
	var Qualification = $('#txtQualification').val();
	var Experience = $('#txtExperience').val();
	var Designation = $('#ddlDesignation option:selected').text();
	var BloodGroup = $('#ddlBloodGroup option:selected').text();
	var AadharNo = $('#txtAadharNo').val();
	var UserType = $('#ddlUserType option:selected').text();
	var Password = $('#txtPassword').val();
	var ConfirmPassword = $('#txtConfirmPassword').val();

	if (EmpName == '') {
		$('#txtEmployeeName').after('<span class="text-danger">Please Provide Employee Name</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtEmployeeName').removeAttr('style').siblings('span').empty();
	}
	if (Gender == 'Select Gender') {
		$('#ddlGender').after('<span class="text-danger">Please Select Gender</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#ddlGender').removeAttr('style').siblings('span').empty();
	}
	if (MaritalStatus == 'Select Marital Status') {
		$('#ddlMaritalStatus').after('<span class="text-danger">Please Select Marital Status</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#ddlMaritalStatus').removeAttr('style').siblings('span').empty();
	}
	if (DOB == '') {
		$('#txtDOB').after('<span class="text-danger">Please Provide DOB</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtDOB').removeAttr('style').siblings('span').empty();
	}
	if (MobileNo == '') {
		$('#txtMobileNo').after('<span class="text-danger">Please Provide Mobile No.</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtMobileNo').removeAttr('style').siblings('span').empty();
	}
	if (HusbandWife == '') {
		$('#txtHusbandWife').after('<span class="text-danger">Please Provide Spouse Name</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtHusbandWife').removeAttr('style').siblings('span').empty();
	}
	if (FatherName == '') {
		$('#txtFatherName').after('<span class="text-danger">Please Provide Father Name</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtFatherName').removeAttr('style').siblings('span').empty();
	}
	if (MotherName == '') {
		$('#txtMotherName').after('<span class="text-danger">Please Provide Mother Name</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtMotherName').removeAttr('style').siblings('span').empty();
	}
	if (LocAddress == '') {
		$('#txtLocalAddress').after('<span class="text-danger">Please Provide Local Address</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtLocalAddress').removeAttr('style').siblings('span').empty();
	}
	if (LocLocality == '') {
		$('#txtLocLocality').after('<span class="text-danger">Please Provide Local Locality</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtLocLocality').removeAttr('style').siblings('span').empty();
	}
	if (LocState == 'Select State') {
		$('#ddlLocState').after('<span class="text-danger">Please Select State</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#ddlLocState').removeAttr('style').siblings('span').empty();
	}
	if (LocCity == 'Select City') {
		$('#ddlLocCity').after('<span class="text-danger">Please Select City</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#ddlLocCity').removeAttr('style').siblings('span').empty();
	}
	if (PerAddress == '') {
		$('#txtPerAddress').after('<span class="text-danger">Please Provide Address</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtPerAddress').removeAttr('style').siblings('span').empty();
	}
	if (PerLocality == '') {
		$('#txtPerLocality').after('<span class="text-danger">Please Provide Locality</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtPerLocality').removeAttr('style').siblings('span').empty();
	}
	if (PerState == 'Select State') {
		$('#ddlPerState').after('<span class="text-danger">Please Select State</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#ddlPerState').removeAttr('style').siblings('span').empty();
	}
	if (PerCity == 'Select City') {
		$('#ddlPerCity').after('<span class="text-danger">Please Select City</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#ddlPerCity').removeAttr('style').siblings('span').empty();
	}
	if (Qualification == '') {
		$('#txtQualification').after('<span class="text-danger">Please Provide Qualification</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtQualification').removeAttr('style').siblings('span').empty();
	}
	if (Experience == '') {
		$('#txtExperience').after('<span class="text-danger">Please Provide Experience</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtExperience').removeAttr('style').siblings('span').empty();
	}
	if (Designation == 'Select Designation') {
		$('#ddlDesignation').after('<span class="text-danger">Please Select Designation</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#ddlDesignation').removeAttr('style').siblings('span').empty();
	}
	if (BloodGroup == 'Select Blood Group') {
		$('#ddlBloodGroup').after('<span class="text-danger">Please Select Blood Group</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#ddlBloodGroup').removeAttr('style').siblings('span').empty();
	}
	if (AadharNo == '') {
		$('#txtAadharNo').after('<span class="text-danger">Please Provide Aadhar No.</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtAadharNo').removeAttr('style').siblings('span').empty();
	}
	if (UserType == 'Select User Type') {
		$('#ddlUserType').after('<span class="text-danger">Please Select User Type</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#ddlUserType').removeAttr('style').siblings('span').empty();
	}
	if (Password == '') {
		$('#txtPassword').after('<span class="text-danger">Please Provide Password</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtPassword').removeAttr('style').siblings('span').empty();
	}
	if (ConfirmPassword == '') {
		$('#txtConfirmPassword').after('<span class="text-danger">Please Provide Confirm Password</span>').css({ 'border-color': 'red' });
		return false;
	}
	else if (ConfirmPassword != Password) {
		$('#txtConfirmPassword').after('<span class="text-danger">Confirm Password Do Not Match.</span>').css({ 'border-color': 'red' });
		return false;
	}
	else {
		$('#txtConfirmPassword').removeAttr('style').siblings('span').empty();
	}
	return true;
}


