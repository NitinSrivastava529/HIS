$(document).ready(function () {
    $('select').select2();
    $("#ddlState").empty().append($("<option></option>").val("0").html("Please Select")).change();
    $("#ddlCity").empty().append($("<option></option>").val("0").html("Please Select")).change();
    CloseSidebar();
    OnLoad();
    searchTable("txtSearch", "tblReferralDetails");
    $("#ddlLocality").on('change', function () {
        var val = $(this).find('option:selected').text();
        $("#txtLocality").val(val);
    });
    $("#btnFilterByPRO").on('click', function () {
        var val = $('#ddlProName option:selected').val();
        LoadAll(val, 'GetRefrerralByPROId');
    });
});
function LoadAll(prm1, logic) {
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.RefCode = 'ALL';
    objBO.hosp_id = Active.unitId;
    objBO.prm_1 = prm1;
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var temp = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblReferralDetails').show();
                $('#tblReferralDetails tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.ProName) {
                        tbody += "<tr style='background:#ffebcb'>";
                        tbody += "<td colspan='11'>" + val.ProName + "</td>";
                        tbody += "</tr>";
                        temp = val.ProName;
                    }
                    tbody += '<tr>';
                    tbody += '<td><button class="btn-warning btn-tbl" onclick=selectRow(this);EditReferral("' + val.ref_code + '")><i class="fa fa-sign-in"></i></button></td>';
                    tbody += "<td>" + val.ref_code + "</td>";
                    tbody += "<td>" + val.ref_name + "</td>";
                    tbody += "<td>" + val.degree + "</td>";
                    tbody += "<td>" + val.speciality + "</td>";
                    tbody += "<td>" + val.c_city + "</td>";
                    tbody += "<td>" + val.c_locality + "</td>";
                    tbody += "<td>" + val.c_name + "</td>";
                    tbody += "<td>" + val.mobile_no + "</td>";
                    tbody += "<td>" + val.address + "</td>";
                    tbody += '<td>-</td>';
                    tbody += '</tr>';
                });
                $('#tblReferralDetails tbody').append(tbody);
            }
            else {
                $('#tblReferralDetails').show();

                $('#tblReferralDetails tbody').empty();
                tbody += '<tr>';
                tbody += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                tbody += '</tr>';
                $('#tblReferralDetails tbody').append(tbody);
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
        objBO.Logic = "SearchReferral";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                var tbody = "";
                var temp = "";
                if (data.ResultSet.Table.length > 0) {
                    $('#tblReferralDetails').show();
                    $('#tblReferralDetails tbody').empty();
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.ProName) {
                            tbody += "<tr style='background:#ffebcb'>";
                            tbody += "<td colspan='11'>" + val.ProName + "</td>";
                            tbody += "</tr>";
                            temp = val.ProName;
                        }
                        tbody += '<tr>';
                        tbody += '<td><button class="btn-warning btn-tbl" onclick=selectRow(this);EditReferral("' + val.ref_code + '")><i class="fa fa-sign-in"></i></button></td>';
                        tbody += "<td>" + val.ref_code + "</td>";
                        tbody += "<td>" + val.ref_name + "</td>";
                        tbody += "<td>" + val.degree + "</td>";
                        tbody += "<td>" + val.speciality + "</td>";
                        tbody += "<td>" + val.c_city + "</td>";
                        tbody += "<td>" + val.c_locality + "</td>";
                        tbody += "<td>" + val.c_name + "</td>";
                        tbody += "<td>" + val.mobile_no + "</td>";
                        tbody += "<td>" + val.address + "</td>";
                        tbody += '<td>-</td>';
                        tbody += '</tr>';
                    });
                    $('#tblReferralDetails tbody').append(tbody);
                }
                else {
                    $('#tblReferralDetails').show();

                    $('#tblReferralDetails tbody').empty();
                    tbody += '<tr>';
                    tbody += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                    tbody += '</tr>';
                    $('#tblReferralDetails tbody').append(tbody);
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
                $("#ddlDegree").append($("<option></option>").val("0").html("Please Select")).change();
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlDegree").append($("<option></option>").val(value.DegId).html(value.DegreeName));
                });
            }
            if (data.ResultSet.Table1.length > 0) {
                $("#ddlSpeciality").empty();
                $("#ddlSpeciality").append($("<option></option>").val("0").html("Please Select")).change();
                $.each(data.ResultSet.Table1, function (key, value) {
                    $("#ddlSpeciality").append($("<option></option>").val(value.Spec_id).html(value.SpecializationName));
                });
            }
            //        if (data.ResultSet.Table2.length > 0) {
            //            $("#ddlState").empty();
            //$("#ddlState").append($("<option></option>").val("0").html("Please Select")).change();
            //            $.each(data.ResultSet.Table2, function (key, value) {
            //                $("#ddlState").append($("<option data-statecode=" + value.state_code + "></option>").val(value.state_name).html(value.state_name));
            //            });
            //        }
            if (data.ResultSet.Table3.length > 0) {
                $("#ddlCity").empty().append($("<option></option>").val("0").html("Please Select")).change();
                $.each(data.ResultSet.Table3, function (key, value) {
                    $("#ddlCity").append($("<option data-distcode=" + value.dist_code + "></option>").val(value.distt_name).html(value.distt_name));
                });
            }
            if (Object.keys(data.ResultSet.Table4).length > 0) {
                $("#ddlLocality").empty().append($("<option></option>").val("0").html("Select")).change();
                $.each(data.ResultSet.Table4, function (key, value) {
                    $("#ddlLocality").append($("<option></option>").val(value.Locality).html(value.Locality));
                });
            }
            if (Object.keys(data.ResultSet.Table5).length > 0) {
                $("#ddlProName").empty().append($("<option></option>").val("ALL").html("ALL")).change();
                $.each(data.ResultSet.Table5, function (key, value) {
                    $("#ddlProName").append($("<option></option>").val(value.ProCode).html(value.ProName));
                });
            }
            if (Object.keys(data.ResultSet.Table6).length > 0) {
                $("#ddlCountry").empty().append($("<option></option>").val("0").html("Select")).change();
                $.each(data.ResultSet.Table6, function (key, value) {
                    $("#ddlCountry").append($("<option></option>").val(value.CountryID).html(value.contry_Name));
                });
            }
            $("#ddlCountry").val(14).change();
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
function InsertUpdateReferralMaster() {
    if (ValidateReferral()) {
        var url = config.baseUrl + "/api/master/mReferralInsertUpdate";
        var objBO = {};
        var btntext = $("#btnSaveUpdate").text();

        if (btntext.trim() == "Save") {
            objBO.Logic = "Insert";
        }
        if (btntext.trim() == "Update") {
            objBO.Logic = "Update";
        }
        objBO.RefCode = $('#tblReferralDetails tbody').find('tr.select-row').find('td:eq(1)').text();
        objBO.BusinessType = $("#ddlBusinessType option:selected").val() == "0" ? "-" : $("#ddlBusinessType option:selected").val();
        objBO.Ref_Name = $("#txtReferralName").val();
        objBO.Degree = $("#ddlDegree option:selected").val();
        objBO.Speciality = $("#ddlSpeciality option:selected").text() == "0" ? "-" : $("#ddlSpeciality option:selected").text();
        objBO.Dob = Properdate($("#txtDob").val(), '-');
        objBO.Clinicname = $("#txtClinicName").val();
        objBO.Clinicaddress = $("#txtAddress").val();
        objBO.Cliniclocality = $("#txtLocality").val();
        objBO.prm_1 = $("#ddlCountry option:selected").text();
        objBO.State = $("#ddlState option:selected").text();
        objBO.City = $("#ddlCity option:selected").text();
        objBO.Phone = $("#txtPhone").val();
        objBO.Mobile_no = $("#txtMobile").val();
        objBO.Email = $("#txtEmail").val();
        objBO.EmpCode = $("#ddlEmpCode option:selected").val() == "0" ? "-" : $("#ddlEmpCode option:selected").val();
        //objBO.hosp_id = Active.unitId;
        objBO.Logic = ($("#btnSaveUpdate").text().toLowerCase() == 'save') ? "Insert" : "Update";
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
                        alert('Referral created successfully');
                    }
                    if (splitdata[0] == "success" && splitdata[1] == "2") {
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
function ApproveReferral(logic) {
    var url = config.baseUrl + "/api/master/mReferralInsertUpdate";
    var objBO = {};
    objBO.RefCode = $('#tblReferralDetails tbody').find('tr.select-row').find('td:eq(1)').text();
    objBO.Dob = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('success')) {
                alert('Success');
                $('#tblReferralDetails tbody').find('tr.select-row').remove();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function EditReferral(refcode) {
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
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (data.ResultSet.Table[0].IsApprove == 'N')
                            $("#btnApprove").show();
                        else
                            $("#btnApprove").hide();

                        $("#btnSaveUpdate").text("Update");

                        $("#ddlDegree option").each(function () {
                            if ($(this).val() == val.degree) {
                                $("#ddlDegree").prop('selectedIndex', '' + $(this).index() + '').change();
                            }

                        });


                        $("#ddlSpeciality option").each(function () {
                            if ($(this).text() == val.speciality) {
                                $("#ddlSpeciality").prop('selectedIndex', '' + $(this).index() + '').change();
                            }

                        });

                        $("#txtReferralName").val(val.ref_name);
                        $("#txtDob").val(val.d_o_b);
                        $("#txtClinicName").val(val.c_name);
                        $("#txtAddress").val(val.c_address);
                        $("#txtLocality").val(val.c_locality);
                        $("#ddlCountry option").each(function () {
                            if ($(this).text() == val.country) {
                                $("#ddlCountry").prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                        });
                        $("#ddlState option").each(function () {
                            if ($(this).text() == val.state) {
                                $("#ddlState").prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                        });

                        $("#ddlCity option").each(function () {
                            if ($(this).text() == val.c_city) {
                                $("#ddlCity").prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                        });


                        $("#txtPhone").val(val.c_phone);
                        $("#txtMobile").val(val.mobile_no);
                        $("#txtEmail").val(val.email);

                        $("#ddlEmpCode").append($('<option></option>').val(val.ProCode).html(val.ProName)).change();



                    });

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
function DownloadXL() {
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.prm_1 = $('#ddlProName option:selected').val();
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.ReportType = 'Excel';
    objBO.Logic = "GetRefrerralByPROId";
    Global_DownloadExcel(url, objBO, "Referral.xlsx");
}