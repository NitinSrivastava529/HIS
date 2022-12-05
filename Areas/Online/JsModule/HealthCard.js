$(document).ready(function () {
    
    if (typeof query()['UnitId'] != 'undefined') {
        sessionStorage.setItem('Username', 'Guest User');
        sessionStorage.setItem('UnitId', query()['UnitId']);
        sessionStorage.setItem('UserID', query()['UnitId']);
        Active.unitId = query()['UnitId'];
        Active.userId = (typeof query()['UserId'] != 'undefined') ? query()['UserId'] : 'ByLink';
    }

    GetState();
    $('#btnSave').on('click', function () {
        Insert();
    });
    $('#btnverify').on('click', function () {
        if ($('#txtOTP').val() == _otpNo)
            verifyOtp();
    });

});
function GetCardInfo() {
    var url = config.baseUrl + "/api/Utility/GetCardUserProfileQueries";
    var obj = {};
    obj.labcode = '-';
    obj.card_no = $('#txtMobile').val();
    obj.member_id = '';
    obj.mobileno = $('#txtMobile').val();
    obj.UHID = "-";
    obj.district = "-";
    obj.state = "-";
    obj.login_id = Active.userId;
    obj.logic = "GetCardInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            $('#tblCardInfo tbody').empty();
            var tbody = "";
            $.each(data.ResultSet.Table, function (key, val) {
                tbody += "<tr>";
                tbody += "<td>" + val.m_type + "</td>";
                tbody += "<td>" + val.member_name + "</td>";
                tbody += "<td>" + val.member_gender + "</td>";
                tbody += "<td>" + val.dob + "</td>";
                tbody += "<td>" + val.mobile_no + "</td>";
                tbody += "</tr>";
            });
            $('#tblCardInfo tbody').append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetState() {
    var url = config.baseUrl + "/api/Utility/GetCardUserProfileQueries";
    var obj = {};
    obj.labcode = '-';
    obj.card_no = $('#txtMobileNo').val();
    obj.member_id = '';
    obj.mobileno = "-";
    obj.UHID = "-";
    obj.district = "-";
    obj.state = "-";
    obj.login_id = Active.userId;
    obj.logic = "GetState";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlState').empty().append($('<option></option>').val(0).html('Select State'));
            $('#ddlDistrict').empty().append($('<option></option>').val(0).html('Select District'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlState').append($('<option></option>').val(val.state_code).html(val.statename)).select2();
            });
        },
        complete: function (response) {
            $('#ddlState option[value="32"]').prop('selected', true).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDistrict() {
    var url = config.baseUrl + "/api/Utility/GetCardUserProfileQueries";
    var obj = {};
    obj.labcode = '-';
    obj.card_no = $('#txtMobileNo').val();
    obj.member_id = '';
    obj.mobileno = "-";
    obj.UHID = "-";
    obj.district = '';
    obj.state = $('#ddlState option:selected').val();
    obj.login_id = Active.userId;
    obj.logic = "GetDistrictByState";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlDistrict').empty().append($('<option></option>').val(0).html('Select District'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlDistrict').append($('<option></option>').val(val.dist_code).html(val.distt_name)).select2();
            });
        },
        complete: function (response) {
            $('#ddlDistrict option[value="45"]').prop('selected', true).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function IsMember() {
    var mobile = $('#txtMobile').val();
    if (mobile == '' || mobile.length != 10) {
        $('#txtMobile').css('border-color', 'red');
        alert('Please Enter Valid Mobile No..!');
        return false;
    }
    else {
        $('#txtMobile').removeAttr('style');
    }
    var url = config.baseUrl + "/api/Utility/Insert_CardUserProfile";
    var obj = {};
    obj.labcode = '-';
    obj.card_no = $('#txtMobile').val();
    obj.mobileno = $('#txtMobile').val();
    obj.logic = "IsMember";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data == 'Yes') {
                $('.IsMember').addClass('disabled');
                GetCardInfo();
                $('#btnAddMember').html('<b>This Card Holder Already Registered..! Add Members from Below.</b>');
                $('#txtMemberMobile').val($('#txtMobile').val());
                $('.info').removeClass('Inactive');
            }
            else {
                $('.IsMember').hide();
                $('#btnGetOTP').show();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Insert() {
    if (Validate1()) {
        var url = config.baseUrl + "/api/Utility/Insert_CardUserProfile";
        var obj = {};
        obj.labcode = '-';
        obj.card_no = $('#txtMobile').val();
        obj.member_id = '';
        obj.m_type = '';
        obj.cust_name = $('#txtCardHolder').val();
        obj.gender = $('#ddlGender option:selected').text();
        obj.dob = $('#txtDOB').val();
        obj.mobileno = $('#txtMobile').val();
        obj.UHID = "-";
        obj.area = $('#txtArea').val();
        obj.Locality = $('#txtLocality').val();
        obj.district = $('#ddlDistrict option:selected').text();
        obj.state = $('#ddlState option:selected').text();
        obj.email = $('#txtEmail').val();
        obj.pin = $('#txtPin').val();
        obj.login_id = Active.userId;
        obj.logic = "Insert";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(obj),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                
                if (data == 'Success') {
                    $('#txtMobile').attr('readonly', 'readonly');
                    GetCardInfo();
                    $('#btnAddMember').html('<b>This Card Holder Added Successfully..! Add Members from Below.</b>');
                    $('#txtMemberMobile').val($('#txtMobile').val());
                }
                else {
                    alert(data);
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function InsertMember() {
    if (Validate2()) {
        var url = config.baseUrl + "/api/Utility/Insert_CardUserProfile";
        var obj = {};
        obj.labcode = '-';
        obj.card_no = $('#txtMobile').val();
        obj.member_id = '';
        obj.m_type = '';
        obj.cust_name = $('#txtMemberName').val();
        obj.gender = $('#ddlMemberGender option:selected').text();
        obj.dob = $('#txtMemberDOB').val();
        obj.mobileno = $('#txtMemberMobile').val();
        obj.UHID = "-";
        obj.area = $('#txtArea').val();
        obj.Locality = $('#txtLocality').val();
        obj.district = $('#ddlDistrict option:selected').text();
        obj.state = $('#ddlState option:selected').text();
        obj.email = $('#txtEmail').val();
        obj.pin = $('#txtPin').val();
        obj.login_id = Active.userId;
        obj.logic = "AddMember";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(obj),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                
                if (data == 'Success') {
                    $('#txtMobile').attr('readonly', 'readonly');
                    GetCardInfo();
                }
                else {
                    alert(data);
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}

function Validate1() {
    var mobile = $('#txtMobile').val();
    var name = $('#txtCardHolder').val();
    var gender = $('#ddlGender option:selected').text();

    if (mobile == '') {
        alert('Please Provide Mobile..');
        $('#txtMobile').css('border-color', 'red').focus();
        return false;
    }
    else if (mobile.length != 10) {
        alert('Mobile should be 10 digit..');
        $('#txtMobile').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtMobile').removeAttr('style');
    }
    if (name == '') {
        alert('Please Provide Name..');
        $('#txtCardHolder').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtCardHolder').removeAttr('style');
    }
    if (gender == 'Select Gender') {
        alert('Please Select Gender..');
        $('#ddlGender').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#ddlGender').removeAttr('style');
    }
    return true;
}
function Validate2() {
    var mobile = $('#txtMemberMobile').val();
    var name = $('#txtMemberName').val();
    var gender = $('#ddlMemberGender option:selected').text();

    if (mobile == '') {
        alert('Please Provide Mobile..');
        $('#txtMemberMobile').css('border-color', 'red').focus();
        return false;
    }
    else if (mobile.length != 10) {
        alert('Mobile should be 10 digit..');
        $('#txtMemberMobile').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtMemberMobile').removeAttr('style');
    }
    if (name == '') {
        alert('Please Provide Name..');
        $('#txtMemberName').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtMemberName').removeAttr('style');
    }
    if (gender == 'Select Gender') {
        alert('Please Select Gender..');
        $('#ddlMemberGender').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#ddlMemberGender').removeAttr('style');
    }
    return true;
}

var _otpNo = "";
function verifyOtp() {
    var otpval = _otpNo;
    if (otpval != "") {
        if (_otpNo == $("#txtOTP").val()) {
            $(".info").removeClass('Inactive');
            alert('Your mobile validate successfully');
            GetCardInfo();
            $('#txtMemberMobile').val($('#txtMobile').val());
        }
        else {
            alert('OTP does not match');
            return false;
        }
    }
    else {
        alert('Otp not found');
        return false;
    }
}

function SendSMS() {
    var mobile = $('#txtMobile').val();
    if (mobile == '' || mobile.length != 10) {
        alert('Please Enter Valid Mobile No..!');
        $('#txtMobile').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtMobile').removeAttr('style');
    }
    $("#btnGetOTP").prop("disabled", true);
    $("#txtMobile").prop("disabled", true);
    var url = config.baseUrl + "/api/Utility/Online_SentOtp";
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
