$(document).ready(function () {
    ClearAll();
    $('select').select2();
    CloseSidebar();
    Onload();
    GetReferrals();
    searchTable('txtSearch', 'tblReferralDetails');
    $("#ddlLocality").on('change', function () {
        var val = $(this).find('option:selected').text();
        $("#txtLocality").val(val);
    });
});
function DownloadXL() {
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.prm_1 = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.ReportType = 'Excel';
    objBO.Logic = "GetRefrerralByPROId";
    Global_DownloadExcel(url, objBO, "Referral.xlsx");
}
function GetReferrals() {
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.prm_1 = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.Logic = "GetRefrerralByPROId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblReferralDetails tbody').empty();
            var tbody = '';
            var temp = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.ProName) {
                            tbody += "<tr style='background:#ffebcb'>";
                            tbody += "<td colspan='9'>" + val.ProName + "</td>";
                            tbody += "</tr>";
                            temp = val.ProName;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + val.ref_code + "</td>";
                        tbody += "<td>" + val.ref_name + "</td>";
                        tbody += "<td>" + val.degree + "</td>";
                        tbody += "<td>" + val.mobile_no + "</td>";
                        tbody += "<td>" + val.speciality + "</td>";
                        tbody += "<td>" + val.c_city + "</td>";
                        tbody += "<td>" + val.c_locality + "</td>";
                        tbody += "<td>" + val.address + "</td>";
                        tbody += "<td>" + val.c_name + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblReferralDetails tbody').append(tbody);
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Onload() {
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.Logic = "OnLoad";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlDegree").append($("<option></option>").val("0").html("Please Select")).change();
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlDegree").append($("<option></option>").val(value.DegId).html(value.DegreeName));
                    });
                }
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#ddlSpeciality").append($("<option></option>").val("0").html("Please Select")).change();
                    $("#ddlSpeciality").prop('selectedIndex', '0');
                    $.each(data.ResultSet.Table1, function (key, value) {
                        $("#ddlSpeciality").append($("<option></option>").val(value.Spec_id).html(value.SpecializationName))
                    });
                }
                //if (Object.keys(data.ResultSet.Table2).length > 0) {
                //    $("#ddlState").append($("<option></option>").val("0").html("Please Select")).change();
                //    $.each(data.ResultSet.Table2, function (key, value) {
                //        $("#ddlState").append($("<option></option>").val(value.state_code).html(value.state_name));
                //    });
                //}
                //if (Object.keys(data.ResultSet.Table3).length > 0) {
                //    $("#ddlCity").append($("<option></option>").val("0").html("Please Select")).change();
                //    $.each(data.ResultSet.Table3, function (key, value) {
                //        $("#ddlCity").append($("<option></option>").val(value.dist_code).html(value.distt_name));
                //    });
                //}
                if (Object.keys(data.ResultSet.Table4).length > 0) {
                    $("#ddlLocality").append($("<option></option>").val("0").html("Select")).change();
                    $.each(data.ResultSet.Table4, function (key, value) {
                        $("#ddlLocality").append($("<option></option>").val(value.Locality).html(value.Locality));
                    });
                }
                if (Object.keys(data.ResultSet.Table6).length > 0) {
                    $("#ddlCountry").empty().append($("<option></option>").val("0").html("Select")).change();
                    $.each(data.ResultSet.Table6, function (key, value) {
                        $("#ddlCountry").append($("<option></option>").val(value.CountryID).html(value.contry_Name));
                    });
                }
                $("#ddlCountry").val(14).change();
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetStateByCountry() {
    $("#ddlState").empty().append($("<option></option>").val("0").html("Select")).change();
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.prm_1 = $("#ddlCountry option:selected").val();
    objBO.Logic = "GetStateByCountry";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlState").append($("<option></option>").val(value.state_code).html(value.state_name));
                });
            }
            //$("#ddlState").val(32).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetCityByState() {
    $("#ddlCity").empty().append($("<option></option>").val("0").html("Please Select")).change();
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.prm_1 = $("#ddlState option:selected").val();
    objBO.Logic = "GetCityByState";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlCity").append($("<option></option>").val(value.dist_code).html(value.distt_name));
                });
            }
            //$("#ddlCity").val(45).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SearchReferralByName() {
    var empname = $('#txtSearchByName').val();
    if (empname.length >= 2) {
        var url = config.baseUrl + "/api/master/mReferralQueries";
        var objBO = {};
        objBO.prm_1 = $('#txtSearchByName').val();
        objBO.hosp_id = Active.unitId;
        objBO.login_id = Active.userId;
        objBO.Logic = "SearchRefrerral";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data);
                $('#tblReferralDetails tbody').empty();
                var tbody = '';
                var temp = '';
                if (Object.keys(data.ResultSet).length > 0) {
                    if (Object.keys(data.ResultSet.Table).length > 0) {
                        $.each(data.ResultSet.Table, function (key, val) {
                            if (temp != val.ProName) {
                                tbody += "<tr style='background:#ffebcb'>";
                                tbody += "<td colspan='9'>" + val.ProName + "</td>";
                                tbody += "</tr>";
                                temp = val.ProName;
                            }
                            tbody += "<tr>";
                            tbody += "<td>" + val.ref_code + "</td>";
                            tbody += "<td>" + val.ref_name + "</td>";
                            tbody += "<td>" + val.degree + "</td>";
                            tbody += "<td>" + val.speciality + "</td>";
                            tbody += "<td>" + val.c_name + "</td>";
                            tbody += "<td>" + val.c_locality + "</td>";
                            tbody += "<td>" + val.mobile_no + "</td>";
                            tbody += "<td>" + val.address + "</td>";
                            tbody += "</tr>";
                        });
                        $('#tblReferralDetails tbody').append(tbody);
                    }
                }
                else {
                    alert('No Data Found')
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
    else
        alert('Please Enter Refferral Name');
}
function InsertUpdateReferralMaster() {
    if (Validation()) {
        var url = config.baseUrl + "/api/master/mReferralInsertUpdate";
        var objBO = {};
        objBO.BusinessType = $("#ddlBusinessType option:selected").text();
        objBO.Ref_Name = $("#txtReferralName").val();
        objBO.Degree = $("#ddlDegree option:selected").val();
        objBO.Speciality = $("#ddlSpeciality option:selected").text();
        objBO.Dob = $("#txtDOB").val();
        objBO.Clinicname = $("#txtClinicName").val();
        objBO.Clinicaddress = $("#txtAddress").val();
        objBO.Cliniclocality = $("#txtLocality").val();
        objBO.prm_1 = $("#ddlCountry option:selected").text();
        objBO.State = $("#ddlState option:selected").text();
        objBO.City = $("#ddlCity option:selected").text();
        objBO.Phone = $("#txtPhone").val();
        objBO.Mobile_no = $("#txtMobile").val();
        objBO.Email = $("#txtEmail").val();
        objBO.EmpCode = Active.userId;
        objBO.hosp_id = Active.unitId;
        objBO.login_id = Active.userId;
        objBO.Logic = "Insert";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('success')) {
                    alert('Referral Created Successfully....');
                    ClearAll();
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
function ClearAll() {
    $('input[type=text]').val('');
    $('input[type=date]').val('');
    $('textarea').val('');
    $('select').prop('selectedIndex', '0');
}
function Validation() {
    var RefName = $('#txtReferralName').val();
    var Degree = $('#ddlDegree option:selected').text();
    var Speciality = $('#ddlSpeciality option:selected').text();
    var ClinicName = $('#txtClinicName').val();
    var Address = $('#txtAddress').val();
    var Locality = $('#txtLocality').val();
    var State = $('#ddlState option:selected').text();
    var City = $('#ddlCity option:selected').text();
    var Mobile = $('#txtMobile').val();

    if (RefName == '') {
        alert('Please Provide Referral Name');
        $('#txtReferralName').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtReferralName').removeAttr('style');
    }
    if (Degree == 'Please Select') {
        alert('Please Select Degree');
        $('span.selection').find('span[aria-labelledby=select2-ddlDegree-container]').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlDegree-container]').removeAttr('style');
    }
    if (Speciality == 'Please Select') {
        alert('Please Select Speciality');
        $('span.selection').find('span[aria-labelledby=select2-ddlSpeciality-container]').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlSpeciality-container]').removeAttr('style');
    }
    if (ClinicName == '') {
        alert('Please Provide Clinic Name');
        $('#txtClinicName').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtClinicName').removeAttr('style');
    }
    if (Address == '') {
        alert('Please Provide Address');
        $('#txtAddress').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtAddress').removeAttr('style');
    }
    if (Locality == '') {
        alert('Please Provide Locality');
        $('#Locality').css('border-color', 'red').focus();
        return false;
    }
    else if (Locality == 'Select') {
        alert('Please Provide Locality');
        $('#Locality').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#Locality').removeAttr('style');
    }
    if (Speciality == 'Please Select') {
        alert('Please Select Speciality');
        $('span.selection').find('span[aria-labelledby=select2-ddlSpeciality-container]').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlSpeciality-container]').removeAttr('style');
    }
    if (State == 'Please Select') {
        alert('Please Select State');
        $('span.selection').find('span[aria-labelledby=select2-ddlState-container]').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlState-container]').removeAttr('style');
    }
    if (City == 'Please Select') {
        alert('Please Select City');
        $('span.selection').find('span[aria-labelledby=select2-ddlCity-container]').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlCity-container]').removeAttr('style');
    }
    if (Mobile == '') {
        alert('Please Provide Mobile No.');
        $('#txtMobile').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtMobile').removeAttr('style');
    }
    return true;
}
