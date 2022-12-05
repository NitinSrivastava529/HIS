$(document).ready(function () {
    CloseSidebar();
    OnLoad();
    searchTable("txtSearch", "tblReferralDetails");
});

function LoadAll() {
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.Logic = "LoadAllRefrerralsofPro";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblReferralDetails').show();
                $('#tblReferralDetails tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    if (val.IsApprove=='N')
                        htmldata += '<tr style="background-color:pink">';
                    else
                        htmldata += '<tr>';
                    htmldata += '<td>' + val.business_type + '</td>';
                    htmldata += '<td>' + val.ref_name + '</td>';
                    htmldata += '<td>' + val.ref_code + '</td>';
                    htmldata += '<td>' + val.mobile_no + '</td>';
                    htmldata += '<td><a href="javascript:void(0)" onclick=EditReferral(' + "'" + val.ref_code + "'" + ')><i class="fa fa-edit fa-lg text-blue" style="font-size:11px"></i></a></td>';
                    htmldata += '</tr>';
                });
                $('#tblReferralDetails tbody').append(htmldata);
            }
            else {
                $('#tblReferralDetails').show();

                $('#tblReferralDetails tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblReferralDetails tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function SearchReferrals() {
    var refname = $("#txtReferralSearch").val();
    var objBO = {};
    if (refname != "") {
        var url = config.baseUrl + "/api/master/mReferralQueries";
        objBO.prm_1 = refname;
        objBO.hosp_id = Active.unitId;
        objBO.login_id = Active.userId;
        objBO.Logic = "SearchByRefrerrals";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                var htmldata = "";
                if (data.ResultSet.Table.length > 0) {
                    $('#tblReferralDetails').show();
                    $('#tblReferralDetails tbody').empty();
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (val.IsApprove == 'N')
                            htmldata += '<tr style="background-color:pink">';
                        else
                            htmldata += '<tr>';
                        htmldata += '<td>' + val.business_type + '</td>';
                        htmldata += '<td>' + val.ref_name + '</td>';
                        htmldata += '<td>' + val.ref_code + '</td>';
                        htmldata += '<td>' + val.mobile_no + '</td>';
                        htmldata += '<td><a href="javascript:void(0)" onclick=EditReferral(' + "'" + val.ref_code + "'" + ')><i class="fa fa-edit fa-lg text-blue" style="font-size:11px"></i></a></td>';
                        htmldata += '</tr>';
                    });
                    $('#tblReferralDetails tbody').append(htmldata);
                }
                else {
                    $('#tblReferralDetails').show();

                    $('#tblReferralDetails tbody').empty();
                    htmldata += '<tr>';
                    htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                    htmldata += '</tr>';
                    $('#tblReferralDetails tbody').append(htmldata);
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
    else {
        alert('Please enter Referral Name')
        return false;
    }
}

function OnLoad() {
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.Logic = "OnLoad";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("#ddlDegree").empty();
                $("#ddlDegree").append($("<option></option>").val("0").html("Please Select"));
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlDegree").append($("<option></option>").val(value.DegId).html(value.DegreeName));
                });
            }
            if (data.ResultSet.Table1.length > 0) {
                $("#ddlSpeciality").empty();
                $("#ddlSpeciality").append($("<option></option>").val("0").html("Please Select"));
                $.each(data.ResultSet.Table1, function (key, value) {
                    $("#ddlSpeciality").append($("<option></option>").val(value.Spec_id).html(value.SpecializationName));
                });
            }
            if (data.ResultSet.Table2.length > 0) {
                $("#ddlState").empty();
                $("#ddlState").append($("<option></option>").val("0").html("Please Select"));
                $.each(data.ResultSet.Table2, function (key, value) {
                    $("#ddlState").append($("<option data-statecode=" + value.state_code + "></option>").val(value.state_name).html(value.state_name));
                });
            }
            if (data.ResultSet.Table3.length > 0) {
                $("#ddlCity").empty();
                $("#ddlCity").append($("<option></option>").val("0").html("Please Select"));
                $.each(data.ResultSet.Table3, function (key, value) {
                    $("#ddlCity").append($("<option data-distcode=" + value.dist_code + "></option>").val(value.distt_name).html(value.distt_name));
                });

            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function GetCityByState() {
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.prm_1 = $("#ddlState option:selected").data('statecode'); //.val();
    objBO.Logic = "GetCityByState";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("#ddlCity").empty();
                $("#ddlCity").append($("<option></option>").val("0").html("Please Select"));
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlCity").append($("<option data-distcode=" + value.dist_code + "></option>").val(value.distt_name).html(value.distt_name));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function InsertUpdateReferralMaster() {
    if (ValidateReferral()) {
        var url = config.baseUrl + "/api/master/mReferralInsertUpdate";
        var objBO = {};
        var btntext = $("#SaveUpdate").val();
        if (btntext.trim() == "Save") {
            objBO.Logic = "Insert";
        }
        if (btntext.trim() == "Update") {
            objBO.Logic = "Update";
        }
        objBO.BusinessType = $("#ddlBusinessType option:selected").val() == "0" ? "-" : $("#ddlBusinessType option:selected").val();
        objBO.Ref_Name = $("#txtReferralName").val();
        objBO.Degree = $("#ddlDegree option:selected").val();
        objBO.Speciality = $("#ddlSpeciality option:selected").val() == "0" ? "-" : $("#ddlSpeciality option:selected").val();
        objBO.Dob = Properdate($("#txtDob").val(), '-');
        objBO.Clinicname = $("#txtClinicName").val();
        objBO.Clinicaddress = $("#txtAddress").val();
        objBO.Cliniclocality = $("#txtLocality").val();
        objBO.State = $("#ddlState option:selected").text();
        objBO.City = $("#ddlCity option:selected").text();
        objBO.Phone = $("#txtPhone").val();
        objBO.Mobile_no = $("#txtMobile").val();
        objBO.Email = $("#txtEmail").val();
        objBO.EmpCode = Active.userId;
        objBO.hosp_id = Active.unitId;
        objBO.login_id = Active.userId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                
                if (data == 'failed') {
                    alert('Failed to save data');
                    return false;
                }
                else {
                    var splitdata = data.split('|');
                    if (splitdata[0] == "success" && splitdata[1] == "1") {
                        LoadAll(splitdata[2]);
                        alert('Referral created successfully');
                    }
                    if (splitdata[0] == "success" && splitdata[1] == "2") {
                        LoadAll(splitdata[2]);
                        alert('Referral updated successfully');
                    }
                    ClearAll();
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}

function EditReferral(refcode) {

    $('#SaveUpdate').prop("disabled", true);
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    if (refcode != "" && typeof refcode != 'undefined') {
        objBO.RefCode = refcode;
        objBO.hosp_id = Active.unitId;
        objBO.login_id = Active.userId;
        objBO.Logic = "EditRefrerrals";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                
                if (data.ResultSet.Table.length > 0) {
                    var btype = data.ResultSet.Table[0].business_type;
                    var degree = data.ResultSet.Table[0].degree;
                    var speciality = data.ResultSet.Table[0].speciality;

                    if (btype == "-" || btype == "" || btype == null || btype == "null" || typeof btype == 'undefined') {
                        $("#ddlBusinessType").val("0");
                    }
                    else {
                        $("#ddlBusinessType").val(data.ResultSet.Table[0].business_type);
                    }
                    if (degree == "-" || degree == "" || degree == null || degree == "null" || typeof degree == 'undefined') {
                        $("#ddlDegree").val("0");
                    }
                    else {
                        $("#ddlDegree").val(data.ResultSet.Table[0].degree);
                    }
                    if (speciality == "-" || speciality == "" || speciality == null || speciality == "null" || typeof speciality == 'undefined') {
                        $("#ddlSpeciality").val("0");
                    }
                    else {
                        $("#ddlSpeciality").val(data.ResultSet.Table[0].speciality);
                    }
                    $("#txtReferralName").val(data.ResultSet.Table[0].ref_name);
                    $("#txtDob").val(data.ResultSet.Table[0].d_o_b);
                    $("#txtClinicName").val(data.ResultSet.Table[0].c_name);
                    $("#txtAddress").val(data.ResultSet.Table[0].c_address);
                    $("#txtLocality").val(data.ResultSet.Table[0].c_locality);

                    $("#ddlState").val(data.ResultSet.Table[0].state);
                    $('#ddlState').trigger('change');
                    $("#ddlCity").val(data.ResultSet.Table[0].c_city).prop('selected', true);

                    $("#txtPhone").val(data.ResultSet.Table[0].c_phone);
                    $("#txtMobile").val(data.ResultSet.Table[0].mobile_no);
                    $("#txtEmail").val(data.ResultSet.Table[0].email);
                    var empname = data.ResultSet.Table[0].emp_name;
                    if (empname != "" && typeof empname != 'undefined') {
                        $("#txtProEmpCode").val(empname);
                        $("#btnFindEmployee").trigger('click');
                        $("#ddlEmpCode").val(data.ResultSet.Table[0].emp_code).prop('selected', true);
                    }
                    else {
                        $("#txtProEmpCode").val('');
                        $("#ddlEmpCode").empty();
                    }
                    //$("#ddlEmpCode").val(data.ResultSet.Table[0].ProCode);                
                }
                else {
                    alert('No Data found');
                    return false;
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
    else {
        alert('No data found');
        return false;
    }
}

function FindEmployee() {
    var empname = $("#txtProEmpCode").val();
    if (empname.length >= 4) {
        var url = config.baseUrl + "/api/master/mReferralQueries";
        var objBO = {};
        objBO.hosp_id = Active.unitId;
        objBO.login_id = Active.userId;
        objBO.EmpName = empname;
        objBO.Logic = "SearchEmployeeByName";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            async: false,
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.ResultSet.Table.length > 0) {
                    $("#ddlEmpCode").empty();
                    $("#ddlEmpCode").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlEmpCode").append($("<option></option>").val(value.emp_code).html(value.empname));
                    });
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
    else {
        alert('Please enter employee name upto 4 character')
        $("#txtProEmpCode").focus();
        $("#ddlEmpCode").empty();
        return false;
    }
}

function ValidateReferral() {
    var refname = $("#txtReferralName").val();
    var degree = $("#ddlDegree option:selected").val();
    var mob = $("#txtMobile").val();
    var state = $("#ddlState option:selected").val();
    var city = $("#ddlCity option:selected").val();
    var empname = $("#txtProEmpCode").val();

    if (refname == "" || typeof refname == 'undefined') {
        alert('Please enter referral Name');
        return false;
    }
    if (degree == "0" || typeof degree == 'undefined') {
        alert('Please select degree');
        return false;
    }
    if (state == "0" || typeof state == 'undefined') {
        alert('Please select state');
        return false;
    }
    if (city == "0" || typeof city == 'undefined') {
        alert('Please select city');
        return false;
    }
    if (mob == "" || typeof mob == 'undefined') {
        alert('Please enter mobile no');
        return false;
    }
    if (mob != "" && mob.length != 10) {
        alert('Please enter 10 digit mobile no');
        return false;
    }
    if (empname != "") {
        var empcode = $("#ddlEmpCode option:selected").val();
        if (empcode == "0") {
            alert('Please select employee code');
            return false;
        }
    }
    return true;
}

function ClearAll() {
    $('#SaveUpdate').prop("disabled", false);
    $("#ddlBusinessType").prop("selectedIndex", 0);   
    $("#txtReferralName").val('');
    $("#ddlDegree").prop("selectedIndex", 0);  
    $("#ddlSpeciality").prop("selectedIndex", 0);  
    $("#txtDob").val('');
    $("#txtClinicName").val('');
    $("#txtAddress").val('');
    $("#txtLocality").val('');
    $("#ddlState").prop("selectedIndex", 0);   
    $("#ddlCity").prop("selectedIndex", 0); 
    $("#txtPhone").val('');
    $("#txtMobile").val('');
    $("#txtEmail").val('');
    $("#txtProEmpCode").val('');
    $("#ddlEmpCode").empty(); 
}