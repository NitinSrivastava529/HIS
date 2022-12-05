var _otpNo;
$(document).ready(function () {
    sessionStorage.setItem('Username', "-");
    sessionStorage.setItem('UserID', "-");



    //$('#divFormBody').addClass("disable");

    $('input[type="checkbox"]').click(function () {
        if ($(this).prop("checked") == true) {
            $("#btnSaveAppointment").prop("disabled", false);
        }
        else if ($(this).prop("checked") == false) {
            $("#btnSaveAppointment").prop("disabled", true);
        }
    });

    $("#btnSaveAppointment").prop("disabled", true);
    Clear();
    $('#btnSaveAppointment').on('click', function () {
        InsertDoctorAppointment();
    });
    $('#btnClear').on('click', function () {
        Clear();
    });
    //$('#btnverify').on('click', function () {
    //    if ($('#txtOTP').val() == _otpNo)
    //        $('#divFormBody').removeClass("disable");
    //});   
    //$('#btnGetOTP').on('click', function () {
    //   Online_SentOtp();
    //}); 
});

function Online_SentOtp() {
    var mobile = $('#txtMobile').val();
    if (mobile == '' || mobile.length!=10) {
            $('#txtMobile').css('border-color', 'red');
            return false;
        }
        else {
            $('#txtMobile').removeAttr('style');
        }
        $("#btnGetOTP").prop("disabled", true);
        $("#txtMobile").prop("disabled", true);
        var url = config.baseUrl + "/api/Hospital/Online_SentOtp";
        var objBO = {};
        objBO.Mobile = $('#txtMobile').val();
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data != '') {
                    _otpNo = data
                }
                else {
                    alert(data);
                }
            },
            error: function (response) {
                alert(data);
            }
        });
}
function InsertDoctorAppointment() {
    if (ValidateAppointment()) {
        
        var url = config.baseUrl + "/api/Hospital/Online_InsertDoctorAppointment";
        var objBO = {};
        objBO.CardNo ="-"// Active.userId;
        objBO.UHID ="-"// $('#txtUHID').val();
        objBO.Mobile = $('#txtMobile').val();
        objBO.Email = $('#txtEmail').val();
        objBO.PatientName = $('#txtPatientName').val();
        objBO.Gender = $('#ddlGender option:selected').text();
        objBO.Age = $('#txtAge').val();
        objBO.AgeType = $('#ddlAgeType option:selected').text();
        objBO.City = $('#ddlCity option:selected').text();
        objBO.Locality = $('#txtLocality').val();
        objBO.Address = $('#txtAddress').val();
        objBO.AppomtReason = $('#txtAppomtReason').val();
        objBO.Logic = "Insert";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data != '') {
                    $("#btnSaveAppointment").prop("disabled", true);
                    Clear();
                    alert(data);
                }
                else {
                    alert(data);
                }
            },
            error: function (response) {
                alert(data);
            }
        });
    }
}
function ValidateAppointment() {
    var UHID = $('#txtUHID').val();
    var PatientName = $('#txtPatientName').val();
    var Gender = $('#ddlGender option:selected').text();
    var Age = $('#txtAge').val();
    var AgeType = $('#ddlAgeType option:selected').text();
    var Mobile = $('#txtMobile').val();
    var City = $('#ddlCity option:selected').text();
    var Locality = $('#txtLocality').val();
    var Address = $('#txtAddress').val();
    var Email = $('#txtEmail').val();
    var AppomtReason = $('#txtAppomtReason').val();

    if (UHID == '') {
        $('#txtUHID').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtUHID').removeAttr('style');
    }
    if (PatientName == '') {
        $('#txtPatientName').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtPatientName').removeAttr('style');
    }
    if (UHID == '') {
        $('#txtUHID').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtUHID').removeAttr('style');
    }
    if (Gender == 'Select Gender') {
        $('#ddlGender').css('border-color', 'red');
        return false;
    }
    else {
        $('#ddlGender').removeAttr('style');
    }
    if (Age == '') {
        $('#txtAge').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtAge').removeAttr('style');
    }
    if (AgeType == 'Age Type') {
        $('#ddlAgeType').css('border-color', 'red');
        return false;
    }
    else {
        $('#ddlAgeType').removeAttr('style');
    }
    if (Mobile == '') {
        $('#txtMobile').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtMobile').removeAttr('style');
    }
    if (City == 'Select City') {
        $('#ddlCity').css('border-color', 'red');
        return false;
    }
    else {
        $('#ddlCity').removeAttr('style');
    }
    if (Locality == '') {
        $('#txtLocality').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtLocality').removeAttr('style');
    }
    if (Address == '') {
        $('#txtAddress').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtAddress').removeAttr('style');
    }
    //if (Email == '') {
    //    $('#txtEmail').css('border-color', 'red');
    //    return false;
    //}
    //else {
    //    $('#txtEmail').removeAttr('style');
    //}
    if (AppomtReason == '') {
        $('#txtAppomtReason').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtAppomtReason').removeAttr('style');
    }
    return true;
}
function Clear() {
    $('input[type=text],input[type=email]').val('');
    $('select').prop('selectedIndex',0);
}