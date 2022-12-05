var status = "";
var _doctorId = '';
$(document).ready(function () {
    RowSequence(['#tblspecialization', '#tblabout', '#tblEducation', '#tblJourney', '#tblExperience', '#tblMembership']);
    searchTable('txtSearch', 'tblDoctorsList');
    $('select').select2();
    CloseSidebar();
    onloadbindDropdown();
    $("#btnBrowse").on('click', function () {
        $("#docImage").trigger('click');
    });

    $('#tblDepartment tbody').on('click', 'button', function () {
        var DeptId = $(this).closest('tr').find('td:eq(0)').text();
        var DeptName = $(this).closest('tr').find('td:eq(1)').text();
        $('#ddlDepartment').empty();
        $('#ddlDepartment').append($('<option></option>').val(DeptId).html(DeptName)).change();
        $('#DepartmentModal').modal('hide');
    });
    $("#divDoctorScheduleandLeave").hide();
    $("#txtFrom").prop('disabled', true);
    $("#txtto").prop('disabled', true);
    $("#lblLeave").text('Leave Details');
    $(".chkEnableOldSearchDate").on('change', function () {
        if ($(this).is(':checked')) {
            $("#lblLeave").text('Old Leave Details');
            $("#txtFrom").prop('disabled', false);
            $("#txtto").prop('disabled', false);
        }
        else {
            $("#lblLeave").text('Leave Details');
            $("#txtFrom").prop('disabled', true);
            $("#txtto").prop('disabled', true);
        }
    });
    $('input[type=radio][name=daysdate]').change(function () {

        var bydaysdate = $("input[name='daysdate']:checked").val();
        if (bydaysdate == "days") {
            $("#divDays").show();
            $("#divDate").hide();
        }
        else {
            $("#divDays").hide();
            $("#divDate").show();
        }
    });
    $("#chkallPanels").change(function () {
        if (this.checked) {
            $(".pnlchk").each(function () {
                this.checked = true;
            })
        } else {
            $(".pnlchk").each(function () {
                this.checked = false;
            })
        }
    });
    $(document).on('click', ".pnlchk", function () {
        if ($(this).is(":checked")) {
            var isAllChecked = 0;
            $(".pnlchk").each(function () {
                if (!this.checked)
                    isAllChecked = 1;
            })
            if (isAllChecked == 0) { $("#chkallPanels").prop("checked", true); }
        } else {
            $("#chkallPanels").prop("checked", false);
        }
    });
    $("#chkallRooms").change(function () {
        if (this.checked) {
            $(".roomchk").each(function () {
                this.checked = true;
            })
        } else {
            $(".roomchk").each(function () {
                this.checked = false;
            })
        }
    });
    $(document).on('click', ".roomchk", function () {
        if ($(this).is(":checked")) {
            var isAllChecked = 0;
            $(".roomchk").each(function () {
                if (!this.checked)
                    isAllChecked = 1;
            })
            if (isAllChecked == 0) { $("#chkallRooms").prop("checked", true); }
        } else {
            $("#chkallRooms").prop("checked", false);
        }
    });

    $('#txtSearchRateList').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblPanels tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });

    $('#txtSearchPanelRateList').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblPanelRateList tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('table tbody').on('click', '#btnDeleteFeatures', function () {
        var AutoId = $(this).closest('tr').find('td:eq(0)').text();
        DeleteProfileDetails(AutoId)
    });
    $('#tblEmployee tbody').on('click', 'button', function () {
        var emp_code = $(this).closest('tr').find('td:eq(0)').text();
        var emp_name = $(this).closest('tr').find('td:eq(1)').text();
        var mobile = $(this).closest('tr').find('td:eq(3)').text();
        var gender = $(this).closest('tr').find('td:eq(4)').text();
        var dob = $(this).closest('tr').find('td:eq(5)').text();

        $('#txtChandanEmpCode').val(emp_code);
        $('#txtDoctorName').val(emp_name);
        $('#txtMobile').val(mobile);
        $("#ddlGender option").each(function () {
            if ($(this).val() == gender) {
                $("#ddlGender").prop('selectedIndex', '' + $(this).index() + '').change();
            }
            else {
                $("#ddlGender").prop('selectedIndex', '0').change();
            }
        });
        $('#EmployeeModal').modal('hide');
        $('#tblEmployee tbody').empty();
        $("#txtChandanEmployee").val('');
    });
});
function SetSeqOfFeatures(TagName) {
    if (_doctorId == '') {
        alert('DoctorId Not Available.')
        return
    }
    var rowInfo = [];
    $('#' + TagName + ' tbody tr').each(function () {
        var AutoId = $(this).find('td:eq(0)').text();
        var SeqNo = $(this).index() + 1;
        rowInfo.push({
            'AutoId': AutoId,
            'SeqNo': SeqNo
        });
    });
    var url = config.baseUrl + "/api/master/mInsertUpdateDoctor";
    var objBO = {};
    objBO.doctorId = '-';
    objBO.TagName = '-';
    objBO.Description = JSON.stringify(rowInfo);
    objBO.login_id = Active.userId;
    objBO.Logic = "SetSeqOfFeatures";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                EditDoctor(_doctorId);
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
function onloadbindDropdown() {
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.Logic = "OnLoadBindDropDown";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = "";
                $("#ddlDepartment").empty().append($("<option></option>").val("0").html("Select")).change();
                $("#tblDepartment tbody").empty();
                $("#ddlSpecialization").empty().append($("<option></option>").val("0").html("Select")).select2();
                $("#ddlDegree").empty().append($("<option></option>").val("0").html("Select")).select2();
                $("#ddlFloorNo").empty().append($("<option></option>").val("0").html("Select")).select2();
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + val.DeptId + "</td>";
                    tbody += "<td>" + val.ShortDeptName + "</td>";
                    tbody += "<td>" + val.dept_name + "</td>";
                    tbody += "<td><button class='btn-warning btn-tbl'><i class='fa fa-sign-in'></i></button></td>";
                    tbody += "</tr>";
                });
                $("#tblDepartment tbody").append(tbody);
                $.each(data.ResultSet.Table1, function (key, value) {
                    $("#ddlSpecialization").append($("<option></option>").val(value.SpecializationName).html(value.SpecializationName));
                });
                $.each(data.ResultSet.Table2, function (key, value) {
                    $("#ddlDegree").append($("<option></option>").val(value.DegreeName).html(value.DegreeName));
                });
                $.each(data.ResultSet.Table3, function (key, value) {
                    $("#ddlFloorNo").append($("<option></option>").val(value.FloorID).html(value.FloorName));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetRoomsByFloor() {
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.prm_1 = $("#ddlFloorNo option:selected").text();
    objBO.Logic = "GetRoomsByFloor";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("#ddlRoomNo").empty().append($("<option></option>").val("0").html("Select")).select2();
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlRoomNo").append($("<option></option>").val(value.RoomId).html(value.RoomName));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AddSpecialization() {
    var specname = $("#txtSpec").val();
    var specdesc = $("#txtSpecDesc").val();

    if (specname == "") {
        alert('Please enter specialization');
        return false;
    }

    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.SpecName = specname;
    objBO.SpecDesc = specdesc;
    objBO.login_id = Active.userId;
    objBO.Tagname = "Specialization";
    objBO.Logic = "insert";
    var url = config.baseUrl + "/api/master/mInsertUpdateSpecialization";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
            $("#SpecModal").modal('hide');
            onloadbindDropdown();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AddDepartment() {
    var Deptname = $("#txtDepartment").val();
    var deptdesc = $("#txtDepetmentDesc").val();

    if (Deptname == "") {
        alert('Please enter Department');
        return false;
    }
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.DeptName = Deptname;
    objBO.DeptDesc = deptdesc;
    objBO.login_id = Active.userId;
    objBO.Tagname = "Department";
    objBO.Logic = "insert";
    var url = config.baseUrl + "/api/master/mInsertUpdateDepartment";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
            $("#DepartmentModal").modal('hide');
            onloadbindDropdown();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AddDegree() {
    var Degree = $("#txtDegree").val();
    var degdesc = $("#txtDegDesc").val();

    if (Degree == "") {
        alert('Please enter Degree');
        return false;
    }

    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.DegName = Degree;
    objBO.DegDesc = degdesc;
    objBO.login_id = Active.userId;
    objBO.Tagname = "Degree";
    objBO.Logic = "insert";
    var url = config.baseUrl + "/api/master/mInsertUpdateDegree";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
            $("#DegreeModal").modal('hide');
            onloadbindDropdown();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AddUpdateDoctorProfile1() {
    if (ValidateField()) {
        var url = config.baseUrl + "/api/master/mInsertUpdateDoctor";
        var objBO = {};
        objBO.doctorId = _doctorId;
        objBO.Prefix = $("#ddlPrefix option:selected").text();
        objBO.doctorname = $("#txtDoctorName").val();
        objBO.doctype = $("#ddlDoctorType option:selected").text();
        objBO.phone = $("#txtPhone").val() == "" ? null : $("#txtPhone").val();
        objBO.mobile = $("#txtMobile").val();
        objBO.address = $("#txtAddress").val();
        objBO.specialization = $("#ddlSpecialization option:selected").val() == "" ? null : $("#ddlSpecialization option:selected").val();
        objBO.DeptId = $("#ddlDepartment option:selected").val();
        objBO.Designation = $("#txtDesignation").val();
        objBO.degree = $("#ddlDegree option:selected").val();
        objBO.degree2 = $("#txtDegreeDes").val();
        objBO.gender = $("#ddlGender option:selected").val();
        objBO.imaregno = $("#txtRegImaNo").val() == "" ? null : $("#txtRegImaNo").val();
        objBO.regdate = $("#txtRegDate").val() == "" ? null : $("#txtRegDate").val();
        objBO.Emrgavail = $("input[name='Emrgavail']:checked").val();
        objBO.docshare = $("input[name='docshare']:checked").val();
        objBO.onlineAppoint = $("input[name='onlineAppoint']:checked").val();
        objBO.IsTokenReq = ($("input[name='Token']").is(':checked')) ? 1 : 0;
        objBO.drstatus = $("input[name='drstatus']:checked").val();
        objBO.IsDirector = ($('input[name=IsDirector]').is(':checked')) ? 'Y' : 'N';
        objBO.IsOPD = ($('input[name=IsOPD]').is(':checked')) ? 'Y' : 'N';
        objBO.IsProfile = ($('input[name=IsProfile]').is(':checked')) ? 'Y' : 'N';
        objBO.feefreq = $("#txtFeeFreq").val();
        objBO.floorno = $("#ddlFloorNo option:selected").val();
        objBO.roomno = $("#ddlRoomNo option:selected").val();
        objBO.patientduration = $("#ddlDuration option:selected").val();
        objBO.hosp_id = Active.unitId;
        objBO.login_id = Active.userId;
        objBO.Logic = ($('#btnSaveDoctor').text() == 'Save') ? 'Insert' : 'Update';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    Clear();
                    var res = data.split("|");
                    alert(res[0]);
                    $("#txtDoctorInfo").text('');
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function AddUpdateDoctorProfile() {
    if (ValidateField()) {
        var url = config.baseUrl + "/api/master/InsertUpdateDoctor";
        var objBO = {};
        objBO.doctorId = _doctorId;
        objBO.Prefix = $("#ddlPrefix option:selected").text();
        objBO.emp_code = $("#txtChandanEmpCode").val();
        objBO.HISDoctorId = $("#txtHISDoctorId").val();
        objBO.doctorname = $("#txtDoctorName").val();
        objBO.doctype = $("#ddlDoctorType option:selected").text();
        objBO.phone = $("#txtPhone").val() == "" ? null : $("#txtPhone").val();
        objBO.mobile = $("#txtMobile").val();
        objBO.address = $("#txtAddress").val();
        objBO.specialization = $("#ddlSpecialization option:selected").val() == "" ? null : $("#ddlSpecialization option:selected").val();
        objBO.DeptId = $("#ddlDepartment option:selected").val();
        objBO.Designation = $("#txtDesignation").val();
        objBO.degree = $("#ddlDegree option:selected").val();
        objBO.degree2 = $("#txtDegreeDes").val();
        objBO.gender = $("#ddlGender option:selected").val();
        objBO.imaregno = $("#txtRegImaNo").val() == "" ? null : $("#txtRegImaNo").val();
        objBO.regdate = $("#txtRegDate").val() == "" ? null : $("#txtRegDate").val();
        objBO.Emrgavail = $("input[name='Emrgavail']:checked").val();
        objBO.docshare = $("input[name='docshare']:checked").val();
        objBO.onlineAppoint = $("input[name='onlineAppoint']:checked").val();
        objBO.IsTokenReq = ($("input[name='Token']").is(':checked')) ? 1 : 0;
        objBO.drstatus = $("input[name='drstatus']:checked").val();
        objBO.IsDirector = ($('input[name=IsDirector]').is(':checked')) ? 'Y' : 'N';
        objBO.IsOPD = ($('input[name=IsOPD]').is(':checked')) ? 'Y' : 'N';
        objBO.IsFreeOPD = ($('input[name=IsFreeOPD]').is(':checked')) ? 'Y' : 'N';
        objBO.IsProfile = ($('input[name=IsProfile]').is(':checked')) ? 'Y' : 'N';
        objBO.IsExamRoomByPass = ($('input[name=IsExamRoomByPass]').is(':checked')) ? 'Y' : 'N';
        objBO.feefreq = $("#txtFeeFreq").val();
        objBO.floorno = $("#ddlFloorNo option:selected").text();
        objBO.roomno = $("#ddlRoomNo option:selected").text();
        objBO.patientduration = $("#ddlDuration option:selected").val();
        objBO.ImageName = _doctorId + '.jpg';
        objBO.virtual_path = "-";
        objBO.hosp_id = Active.unitId;
        objBO.login_id = Active.userId;
        objBO.Logic = ($('#btnSaveDoctor').text() == 'Save') ? 'Insert' : 'Update';
        var UploadDocumentInfo = new XMLHttpRequest();
        var data = new FormData();
        data.append('obj', JSON.stringify(objBO));
        var bytes = $('input[id=docImage]')[0].files[0];
        data.append('ImageByte', $('input[id=docImage]')[0].files[0]);
        UploadDocumentInfo.onreadystatechange = function () {
            if (UploadDocumentInfo.status) {
                if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
                    var json = JSON.parse(UploadDocumentInfo.responseText);
                    if (json.Message.includes('Success')) {
                        Clear();
                        var res = json.Message.split("|");
                        alert(res[0]);
                        $("#txtDoctorInfo").text('');
                    }
                    else {
                        alert(json.Message);
                    }
                }
            }
        }
        UploadDocumentInfo.open('POST', url, true);
        UploadDocumentInfo.send(data);
    }
}

function AddUpdateDoctorSlot() {
    if (ValidateOPDField()) {
        var days = '';
        var objBO = {};
        $.each($("input[name='daysname']:checked"), function () {
            days += $(this).val() + ',';
        });
        newDays = days.toString().replace(/,\s*$/, '');
        objBO.doctorId = _doctorId;
        objBO.StartTime = $("#txtStartTime").val();// + " " + $("#ddlStartSLots option:selected").val();
        objBO.EndTime = $("#txtEndTime").val();// + " " + $("#ddlEndSLots option:selected").val();
        objBO.ShiftName = $("#ddlShift option:selected").val();
        objBO.PatientLimit = $("#txtpatientLimit").val();
        objBO.Daysvalues = newDays;
        objBO.hosp_id = Active.unitId;
        objBO.Logic = "Insert";
        objBO.login_id = Active.userId;
        var url = config.baseUrl + "/api/master/mInsertUpdateDoctorTimeSlot";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                alert(data);
                BindOPDSchedule(_doctorId);
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function BindDoctorList() {
    $('#tblDoctorsList tbody').empty();
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.prm_1 = $("input[name='status']:checked").val();
    objBO.Logic = "GetDoctorsList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var Deptname = ""
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (Deptname != val.DepartmentName) {
                            tbody += '<tr>';
                            tbody += '<td colspan="4" style="font-weight:bold;background:#fbead1">' + val.DepartmentName + '</td>';
                            tbody += '</tr>';
                            Deptname = val.DepartmentName;
                        }
                        tbody += '<tr>';
                        tbody += '<td>' + val.DoctorId + '</td>';
                        tbody += '<td>' + val.DoctorName + '</td>';
                        tbody += '<td><button class="btn-warning btn-tbl" onclick=selectRow(this);EditDoctor("' + val.DoctorId + '")><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $('#tblDoctorsList tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function EditDoctor(DoctorId) {
    Clear();
    $('#tblspecialization tbody').empty();
    $('#tblabout tbody').empty();
    $('#tblEducation tbody').empty();
    $('#tblExperience tbody').empty();
    $('#tblJourney tbody').empty();
    $('#tblMembership tbody').empty();
    $("#txtHISDoctorId").prop('disabled', true);
    _doctorId = DoctorId;
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.doctorId = DoctorId;
    objBO.Logic = "GetDoctorById";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            var htmlSpec = '';
            var htmlAbout = '';
            var htmlEdu = '';
            var htmlJur = '';
            var htmlExp = '';
            var htmlMem = '';
            if (Object.keys(data.ResultSet.Table).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    if (val.VirtualPhotoPath != null)
                        $('#imgdoctors').prop('src', val.VirtualPhotoPath);
                    else
                        $('#imgdoctors').prop('src', '/Content/logo/noImage.png');

                    $(".txtModalDocName").text(val.DoctorName);
                    $("#txtDoctorInfo").text(val.Prefix + ' ' + val.DoctorName);
                    $('#txtChandanEmpCode').val(val.emp_code);
                    $("#docname").text(val.DoctorName);
                    $("#txtHISDoctorId").val(val.HISDoctorId);
                    $("#docid").text('(' + val.DoctorId + ')');
                    _doctorId = val.DoctorId;

                    if (val.IsDirector == 'Y')
                        $("input[name=IsDirector]").prop('checked', true);
                    else
                        $("input[name=IsDirector]").prop('checked', false);

                    if (val.opdFlag == 'Y')
                        $("input[name=IsOPD]").prop('checked', true);
                    else
                        $("input[name=IsOPD]").prop('checked', false);

                    if (val.ShowProfileFlag == 'Y')
                        $("input[name=IsProfile]").prop('checked', true);
                    else
                        $("input[name=IsProfile]").prop('checked', false);

                    if (val.FreeOpd == 'Y')
                        $("input[name=IsFreeOPD]").prop('checked', true);
                    else
                        $("input[name=IsFreeOPD]").prop('checked', false);

                    if (val.IsExamRoomByPass == 'Y')
                        $("input[name=IsExamRoomByPass]").prop('checked', true);
                    else
                        $("input[name=IsExamRoomByPass]").prop('checked', false);

                    $("#txtDoctorName").val(val.DoctorName);
                    $("#ddlPrefix option").each(function () {
                        if ($(this).val() == val.Prefix) {
                            $("#ddlPrefix").prop('selectedIndex', '' + $(this).index() + '').change();
                        }
                    });
                    $("#ddlDoctorType option").each(function () {
                        if ($(this).val() == val.DoctorType) {
                            $("#ddlDoctorType").prop('selectedIndex', '' + $(this).index() + '').change();
                        }
                    });
                    $("#ddlGender option").each(function () {
                        if ($(this).val() == val.gender) {
                            $("#ddlGender").prop('selectedIndex', '' + $(this).index() + '').change();
                        }
                    });
                    $("#ddlSpecialization option").each(function () {
                        if ($(this).val() == val.speciality) {
                            $("#ddlSpecialization").prop('selectedIndex', '' + $(this).index() + '').change();
                        }
                    });
                    $('#ddlDepartment').empty();
                    $('#ddlDepartment').append($('<option></option>').val(val.DeptId).html(val.DepartmentName)).change();
                    $("#ddlDuration option").each(function () {
                        if ($(this).val() == val.Patient_duration) {
                            $("#ddlDuration").prop('selectedIndex', '' + $(this).index() + '').change();
                        }
                    });
                    $("#ddlDegree option").each(function () {
                        if ($(this).val() == val.degree) {
                            $("#ddlDegree").prop('selectedIndex', '' + $(this).index() + '').change();
                        }
                    });
                    $("#ddlFloorNo option").each(function () {
                        if ($(this).text() == val.FloorName) {
                            $("#ddlFloorNo").prop('selectedIndex', '' + $(this).index() + '').change();
                        }
                        $("#ddlRoomNo option").each(function () {
                            if ($(this).text() == val.RoomNo) {
                                $("#ddlRoomNo").prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                        });
                    });

                    $("#txtPhone").val(val.landline_no);
                    $("#txtMobile").val(val.mobile_no);
                    $("#txtAddress").val(val.addres1);
                    $("#txtRegImaNo").val(val.Imaregno);
                    if (val.Imaregdate != "") {
                        var olddate = val.Imaregdate.split('/');
                        newDate = olddate[2] + "-" + olddate[1] + "-" + olddate[0];
                    }
                    $("#txtRegDate").val(newDate);
                    $("#txtFeeFreq").val(val.fee_freq);
                    $("#txtDesignation").val(val.Designation);
                    $("#txtDegreeDes").val(val.degree2);
                    $("input[name=Emrgavail][value=" + val.emergency_availability + "]").prop('checked', 'checked');
                    $("input[name=docshare][value=" + val.share_flag + "]").prop('checked', 'checked');
                    $("input[name=onlineAppoint][value=" + val.online_appointment + "]").prop('checked', 'checked');
                    if (val.IsTokenRequired == true) {
                        $("input[name=Token][value='1']").prop('checked', 'checked');
                    }
                    else {
                        $("input[name=Token][value='0']").prop('checked', 'checked');
                    }
                    if (val.Isactive == 'Y') {
                        $("input[name=drstatus][value='Y']").prop('checked', 'checked');
                    }
                    else {
                        $("input[name=drstatus][value='N']").prop('checked', 'checked');
                    }

                });

                $.each(data.ResultSet.Table1, function (key, val) {
                    htmlSpec = '';
                    htmlAbout = '';
                    htmlEdu = '';
                    htmlJur = '';
                    htmlExp = '';
                    htmlMem = '';
                    if (val.TagName == "Specialization") {
                        htmlSpec += '<tr>';
                        htmlSpec += '<td style="display:none">' + val.auto_id + '</td>';
                        htmlSpec += '<td>' + val.seqNo + '</td>';
                        htmlSpec += '<td>' + val.Description + '</td>';
                        htmlSpec += '<td><button id="btnDeleteFeatures" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>';
                        $('#tblspecialization tbody').append(htmlSpec);
                    }
                    if (val.TagName == "About") {
                        htmlAbout += '<tr>';
                        htmlAbout += '<td style="display:none">' + val.auto_id + '</td>';
                        htmlAbout += '<td>' + val.seqNo + '</td>';
                        htmlAbout += '<td>' + val.Description + '</td>';
                        htmlAbout += '<td><button id="btnDeleteFeatures" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>';
                        $('#tblabout tbody').append(htmlAbout);
                    }
                    if (val.TagName == "Education") {
                        htmlEdu += '<tr>';
                        htmlEdu += '<td style="display:none">' + val.auto_id + '</td>';
                        htmlEdu += '<td>' + val.seqNo + '</td>';
                        htmlEdu += '<td>' + val.Description + '</td>';
                        htmlEdu += '<td><button id="btnDeleteFeatures" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>';
                        $('#tblEducation tbody').append(htmlEdu);
                    }
                    if (val.TagName == "Journey") {
                        htmlJur += '<tr>';
                        htmlJur += '<td style="display:none">' + val.auto_id + '</td>';
                        htmlJur += '<td>' + val.seqNo + '</td>';
                        htmlJur += '<td>' + val.Description + '</td>';
                        htmlJur += '<td><button id="btnDeleteFeatures" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>';
                        $('#tblJourney tbody').append(htmlJur);
                    }
                    if (val.TagName == "Experience") {
                        htmlExp += '<tr>';
                        htmlExp += '<td style="display:none">' + val.auto_id + '</td>';
                        htmlExp += '<td>' + val.seqNo + '</td>';
                        htmlExp += '<td>' + val.Description + '</td>';
                        htmlExp += '<td><button id="btnDeleteFeatures" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>';
                        $('#tblExperience tbody').append(htmlExp);
                    }
                    if (val.TagName == "Membership") {
                        htmlMem += '<tr>';
                        htmlMem += '<td style="display:none">' + val.auto_id + '</td>';
                        htmlMem += '<td>' + val.seqNo + '</td>';
                        htmlMem += '<td>' + val.Description + '</td>';
                        htmlMem += '<td><button id="btnDeleteFeatures" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>';
                        $('#tblMembership tbody').append(htmlMem);
                    }
                });
                var newDate = "";

                //$("input[name=drstatus][value='" +  + "']").prop('checked', 'checked');
                $("#btnSaveDoctor").text('Update');
                BindOPDSchedule(_doctorId);
                GetLeaveDetailsOnEdit(_doctorId);
                $("#divDoctorScheduleandLeave").show();
            }
            else {
                $("#divDoctorScheduleandLeave").hide();
                alert("No Data Found");
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DeleteProfileDetails(autoId) {
    if (confirm('Are you sure to delete?')) {
        var url = config.baseUrl + "/api/master/mInsertUpdateDoctor";
        var objBO = {};
        objBO.prm_1 = autoId;
        objBO.Logic = "DeleteDoctorProfile";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    EditDoctor(_doctorId);
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
function InsertDoctorFeatures(TagName) {
    if (_doctorId == '') {
        alert('DoctorId Not Available.')
        return
    }
    if ($('#txtFeature' + TagName).val() == '') {
        alert('Please Provide ' + TagName)
        return
    }
    var url = config.baseUrl + "/api/master/mInsertUpdateDoctor";
    var objBO = {};
    objBO.doctorId = _doctorId;
    objBO.TagName = TagName;
    objBO.Description = $('#txtFeature' + TagName).val();
    objBO.login_id = Active.userId;
    objBO.Logic = "InsertDoctorFeatures";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                EditDoctor(_doctorId);
                $('#txtFeature' + TagName).val('');
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
function BindOPDSchedule(doctorId) {
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.doctorId = doctorId;
    objBO.Logic = "GetOPDSceduleByDoctorId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {

            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblopdSchedule').show();
                $('#tblopdSchedule tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    //htmldata += '<td>' + val.DoctorName + '</td>';
                    htmldata += '<td>' + val.day_name + '</td>';
                    htmldata += '<td>' + val.shift_start + '</td>';
                    htmldata += '<td>' + val.shift_end + '</td>';
                    htmldata += '<td>' + val.patient_limit + '</td>';
                    htmldata += '<td>' + val.shift_name + '</td>';
                    htmldata += '<td><i class="fa fa-trash fa-lg text-red" onclick=DeleteSchedule(' + "'" + val.auto_id + "'" + ')></i></td>';
                    htmldata += '</tr>';
                });
                $('#tblopdSchedule tbody').append(htmldata);
            }
            else {
                $('#tblopdSchedule').show();
                $('#tblopdSchedule tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblopdSchedule tbody').append(htmldata);
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DeleteSchedule(autoid) {
    var objBO = {};
    objBO.autoid = autoid;
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.doctorId = _doctorId;
    objBO.Logic = "Delete";
    var url = config.baseUrl + "/api/master/mDeleteDoctorSchedule";
    if (confirm("Are you sure to delete schedule ?")) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                alert(data);
                BindOPDSchedule(_doctorId);
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }

}
function GetLeaveDetailsOnEdit(doctorId) {
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.doctorId = doctorId;
    objBO.Logic = "LastFewDaysLeaveDetail";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblLeaveDetails').show();
                $('#tblLeaveDetails tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    //htmldata += '<td>' + val.DoctorName + '</td>';
                    htmldata += '<td>' + val.input_date + '</td>';
                    htmldata += '<td>' + val.slotTime + '</td>';
                    htmldata += '<td>' + val.attType + '</td>';
                    htmldata += '<td>' + val.status + '</td>';
                    //htmldata += '<td><a href="javascript:void(0)" onclick=CancelDoctorLeave(' + "'" + val.auto_id + "'" + ')><i class="fa fa-trash fa-lg text-red"></i></a></td>';
                    htmldata += '</tr>';
                });
                $('#tblLeaveDetails tbody').append(htmldata);
            }
            else {
                $('#tblLeaveDetails').show();
                $('#tblLeaveDetails tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblLeaveDetails tbody').append(htmldata);
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetApplyLeaveDetails() {
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.doctorId = _doctorId;
    objBO.prm_1 = $("#txtFromDate").val();
    objBO.prm_2 = $("#txttoDate").val();
    objBO.Logic = "GetOldLeaveDetails";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblLeaveDetails').show();
                $('#tblLeaveDetails tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    //htmldata += '<td>' + val.DoctorName + '</td>';
                    htmldata += '<td>' + val.input_date + '</td>';
                    htmldata += '<td>' + val.slotTime + '</td>';
                    htmldata += '<td>' + val.attType + '</td>';
                    htmldata += '<td>' + val.status + '</td>';
                    //htmldata += '<td><a href="javascript:void(0)" onclick=CancelDoctorLeave(' + "'" + val.auto_id + "'" + ')><i class="fa fa-trash fa-lg text-red"></i></a></td>';
                    htmldata += '</tr>';
                });
                $('#tblLeaveDetails tbody').append(htmldata);
            }
            else {
                $('#tblLeaveDetails').show();
                $('#tblLeaveDetails tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblLeaveDetails tbody').append(htmldata);
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function GetEmployeeInfo() {
    $('#tblEmployee tbody').empty();
    if ($("#txtChandanEmployee").val() == '') {
        alert('Provide Employee Emp Code or Employye Name.');
        return;
    }
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.prm_1 = $("#txtChandanEmployee").val();
    objBO.Logic = "GetEmployeeInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            if (Object.keys(data.ResultSet.Table).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.emp_code + '</td>';
                    htmldata += '<td>' + val.emp_name + '</td>';
                    htmldata += '<td>' + val.designation + '</td>';
                    htmldata += '<td>' + val.mobile_no + '</td>';
                    htmldata += '<td style="display:none">' + val.gender + '</td>';
                    htmldata += '<td style="display:none">' + val.gender + '</td>';
                    htmldata += "<td><button class='btn-warning btn-tbl'><i class='fa fa-sign-in'></i></button></td>";
                    htmldata += '</tr>';
                });
                $('#tblEmployee tbody').append(htmldata);
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SearchDoctorLeave() {
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.doctorId = _doctorId;
    objBO.prm_1 = $("#txtFrom").val();
    objBO.prm_2 = $("#txtto").val();
    objBO.Logic = "GetOldLeaveDetails";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblLeaveDetails').show();
                $('#tblLeaveDetails tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    //htmldata += '<td>' + val.DoctorName + '</td>';
                    htmldata += '<td>' + val.input_date + '</td>';
                    htmldata += '<td>' + val.slotTime + '</td>';
                    htmldata += '<td>' + val.attType + '</td>';
                    htmldata += '<td>' + val.status + '</td>';
                    //htmldata += '<td><a href="javascript:void(0)" onclick=CancelDoctorLeave(' + "'" + val.auto_id + "'" + ')><i class="fa fa-trash fa-lg text-red"></i></a></td>';
                    htmldata += '</tr>';
                });
                $('#tblLeaveDetails tbody').append(htmldata);
            }
            else {
                $('#tblLeaveDetails').show();
                $('#tblLeaveDetails tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblLeaveDetails tbody').append(htmldata);
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CancelDoctorLeave(autoid) {
    var objBO = {};
    objBO.autoid = autoid;
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.doctorId = _doctorId;
    objBO.Logic = "CancelDoctorLeave";
    var url = config.baseUrl + "/api/master/mCancelDoctorLeave";
    if (confirm("Are you sure to delete schedule ?")) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                alert(data);
                GetLeaveDetailsOnEdit(_doctorId);
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }

}
function GenerateRow() {
    var table = $("#tbldynamic tbody");
    var resultHtml = '';
    var fDate = $("#txtFromDate").val();
    var splitfdate = fDate.split('-');
    var newfdate = splitfdate[2];
    var TDate = $("#txttoDate").val();
    var splittdate = TDate.split('-');
    var newtdate = splittdate[2];
    days = (parseInt(newtdate) - parseInt(newfdate) + 1);
    var firstdate = new Date(fDate);
    var lastdate = new Date(TDate);
    var setdatedata = "";
    firstdate.setDate(firstdate.getDate());
    var dd = String(firstdate.getDate()).padStart(2, '0');
    var mm = String(firstdate.getMonth() + 1).padStart(2, '0');
    var yyyy = firstdate.getFullYear();
    setdatedata = yyyy + "-" + mm + "-" + dd;

    if (fDate == TDate) {
        if (resultHtml != "") {
            firstdate.setDate(firstdate.getDate());
            var dd = String(firstdate.getDate()).padStart(2, '0');
            var mm = String(firstdate.getMonth() + 1).padStart(2, '0');
            var yyyy = firstdate.getFullYear();
            setdatedata = yyyy + "-" + mm + "-" + dd;
        }
        resultHtml += [
            "<tr>",
            '<td><input id="txtDate" type="date" style="width:120px" value="' + setdatedata + '" class="form-control"></td>',
            '<td><input class="st" id="txtsttime" type="time" class="form-control" value="00:00"></td>',
            //'<td><select id="stam"><option value="AM">AM</option><option value="PM">PM</option></select></td>',
            '<td><input class="et" id="txtendtime" type="time" class="form-control" value="23:59"></td>',
            //'<td><select id="stpm"><option value="PM">PM</option><option value="AM">AM</option></select></td>',
            '</tr>'].join("\n");
    }
    while (firstdate < lastdate) {
        if (resultHtml != "") {
            firstdate.setDate(firstdate.getDate() + 1);
            var dd = String(firstdate.getDate()).padStart(2, '0');
            var mm = String(firstdate.getMonth() + 1).padStart(2, '0');
            var yyyy = firstdate.getFullYear();
            setdatedata = yyyy + "-" + mm + "-" + dd;
        }
        resultHtml += [
            "<tr>",
            '<td><input id="txtDate" type="date" style="width:120px" value="' + setdatedata + '" class="form-control"></td>',
            '<td><input class="st" id="txtsttime" type="time" class="form-control" value="00:00"></td>',
            //'<td><select id="stam"><option value="AM">AM</option><option value="PM">PM</option></select></td>',
            '<td><input class="et" id="txtendtime" type="time" class="form-control" value="23:59"></td>',
            //'<td><select id="stpm"><option value="PM">PM</option><option value="AM">AM</option></select></td>',
            '</tr>'].join("\n");
    }
    table.html(resultHtml);

}
function InsertDoctorLeave() {
    var objBO = [];
    var editdocId = _doctorId;
    if (editdocId == "") {
        alert("please chose doctor form List");
        return false;
    }
    $('#tbldynamic tbody tr').each(function () {
        var inputdate = $(this).find("td:eq(0) input").val();
        var sttime = $(this).find("td:eq(1) input").val();  // + " " + $(this).find("td:eq(2) select").find('option:selected').val();
        var endtime = $(this).find("td:eq(2) input").val(); // + " " + $(this).find("td:eq(4) select").find('option:selected').val();
        objBO.push({
            doctorId: _doctorId,
            inputdate: inputdate,
            StartTime: sttime,
            EndTime: endtime,
            login_id: Active.userId,
            Logic: "InsertDoctorOnLeave",
        });
    });
    var url = config.baseUrl + "/api/master/mInsertDoctorLeave";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
            GetApplyLeaveDetails();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}
function ValidateField() {
    var title = $("#ddlTitle option:selected").val();
    var doctorname = $("#txtDoctorName").val();
    var doctype = $("#ddlDoctorType option:selected").val();
    var mobile = $("#txtMobile").val();
    var gender = $("#ddlgender option:selected").val();
    var FeeFreq = $("#txtFeeFreq").val();

    if (doctype == "0") {
        alert('Please select doctor type');
        return false;
    }
    if (title == "0") {
        alert('Please select title');
        return false;
    }
    if (doctorname == "") {
        alert('Please enter doctor name');
        return false;
    }
    if (gender == "0") {
        alert('Please select gender');
        return false;
    }
    if (mobile == "") {
        alert('Please enter mobile number');
        return false;
    }
    if (FeeFreq == "") {
        alert('Please enter Fee Frequency');
        return false;
    }
    return true;
}

function ValidateOPDField() {
    var editdocId = _doctorId;
    var shift = $("#ddlShift option:selected").val();
    var strattime = $("#txtStartTime").val();
    var endtime = $("#txtEndTime").val();
    var patlimit = $("#txtpatientLimit").val();

    if (editdocId == "") {
        alert("please chose doctor form List");
        return false;
    }

    if ($('input[name=daysname]:checked').length == 0) {
        alert("ERROR! Please select at least one checkbox");
        return false;
    }
    if (shift == "") {
        alert('Please select shift');
        return false;
    }
    if (strattime == "") {
        alert('Please enter shit start time');
        return false;
    }
    if (endtime == "") {
        alert('Please enter shit end time');
        return false;
    }
    if (patlimit == "") {
        alert('Please enter patient limit');
        return false;
    }
    return true;
}
function Clear() {
    $("#txtHISDoctorId").prop('disabled', false);
    $('#page-content input:text').val('');
    $('#page-content input[type=radio][value=Y]:not(input[name=status])').prop('checked', true);
    $('#page-content input[type=checkbox]').prop('checked', false);
    $('#page-content input[type=date],textarea').val('');
    $('#page-content select').prop('selectedIndex', '0').change();
    $("#ddlDepartment").empty().append($("<option></option>").val("0").html("Select")).change();
    $('#imgdoctors').prop('src', '/Content/logo/noImage.png');
    $("#btnSaveDoctor").text('Save');
}

/* Start Edit Rate */

function OnLoadGetRateRoomVisit() {
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.doctorId = _doctorId;
    objBO.Logic = "OnLoadBindRateRoomVisit";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmlPanels, htmlRoom, htmlVisit;
            htmlPanels = htmlRoom = htmlVisit = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblPanels tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    htmlPanels += '<tr>';
                    htmlPanels += '<td><input id="chkpnl" data-ratelistid="' + val.RateListId + '" type="checkbox" class="pnlchk"> </td>';
                    htmlPanels += '<td>' + val.RateListName + '</td>';
                    htmlPanels += '<td><a href="javascript:void(0)" onclick=GetPanelRateList(' + "'" + val.RateListId + "'" + ')><i class="fa fa-eye fa-lg text-red"></i></a></td>';
                    htmlPanels += '</tr>';
                });
                $('#tblPanels tbody').append(htmlPanels);
            }
            if (data.ResultSet.Table1.length > 0) {
                $('#tblRoomType tbody').empty();
                $.each(data.ResultSet.Table1, function (key, val) {
                    htmlRoom += '<tr>';
                    htmlRoom += '<td><input id="chkRoom" data-billingcategory="' + val.BillingCategory + '" type="checkbox" class="roomchk"> </td>';
                    htmlRoom += '<td>' + val.BillingCategory + '</td>';
                    htmlRoom += '</tr>';
                });
                $('#tblRoomType tbody').append(htmlRoom);
            }
            if (data.ResultSet.Table2.length > 0) {
                $('#tblVisit tbody').empty();
                $.each(data.ResultSet.Table2, function (key, val) {
                    htmlVisit += '<tr>';
                    htmlVisit += '<td><input id="chkvisit" data-itemid="' + val.item_id + '" type="checkbox" class="checkbox" checked="checked"> </td>';
                    htmlVisit += '<td style="width:30%">' + val.SubCatName + '</td>';
                    htmlVisit += '<td><input type="text" onkeypress="return isNumberKey(event)" value=' + val.rate + ' maxlength="4" style="width:80%"  class="form-control text-right"/></td>';
                    htmlVisit += '</tr>';
                });
                $('#tblVisit tbody').append(htmlVisit);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SaveRateList() {
    var docId = _doctorId;
    if (docId == "" || typeof docId == 'undefined') {
        alert('Please select doctor from doctor list');
        return false;
    }
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.doctorId = _doctorId;
    var RateListData = []
    $('#tblPanels tbody').find('tr').each(function () {
        var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
        if (ischecked) {
            var pnlids = $(this).find('td:eq(0)').find('input').data('ratelistid');
            var types = "RateList";
            var Rate = "0";
            RateListData.push({ ids: pnlids.toString(), typeval: types, Rates: Rate });
        }
    });
    $('#tblRoomType tbody').find('tr').each(function () {
        var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
        if (ischecked) {
            var billcatids = $(this).find('td:eq(0)').find('input').data('billingcategory');
            var types = "Room";
            var Rate = "0";
            RateListData.push({ ids: billcatids, typeval: types, Rates: Rate });
        }
    });
    $('#tblVisit tbody').find('tr').each(function () {
        var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
        if (ischecked) {
            var itemid = $(this).find('td:eq(0)').find('input').data('itemid');
            var types = "Rates";
            var Rate = $(this).find('td:eq(2)').find('input').val();
            RateListData.push({ ids: itemid, typeval: types, Rates: Rate });
        }
    });

    if (RateListData.length == 0) {
        alert('Please load the record first');
        return false;
    }

    objBO.lstarrvalues = JSON.stringify(RateListData);
    var url = config.baseUrl + "/api/master/mInsertDoctorRateList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
            $('input:checkbox').removeAttr('checked');
            $("input:text").val("");
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPanelRateList(RateListId) {
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.prm_1 = RateListId;
    objBO.Logic = "GetDoctorRateListByPanel";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata, roombillcategory;
            htmldata = roombillcategory = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblPanelRateList').show();
                $('#tblPanelRateList tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    if (roombillcategory != val.RoomBillingCategory) {
                        htmldata += '<tr class="uprow">';
                        htmldata += '<td colspan="4" style="font-weight:bold;background-color:#d1ebfb">' + val.RoomBillingCategory + '</td>';
                        htmldata += '</tr>';
                        roombillcategory = val.RoomBillingCategory;
                    }
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.SubCatName + '</td>';
                    htmldata += '<td>' + val.rate + '</td>';
                    htmldata += '</tr>';
                });
                $('#tblPanelRateList tbody').append(htmldata);
            }
            else {
                $('#tblPanelRateList').show();
                $('#tblPanelRateList tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblPanelRateList tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

/* Stop Edit Rate */

//Doctor Profile
var reader = new FileReader();
function readURL(input) {
    $('#imgdoctors').prop('src', '');
    if (input.files && input.files[0]) {
        var ext = $('#docImage').val().split('.').pop().toLowerCase();
        if (ext != "" && ext == null && typeof ext != 'undefined') {
            if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'bmp']) == -1) {
                alert('invalid file extension!');
                return false;
            }
            // convert to base64 string
        }
        reader.onload = function (e) {
            $('#imgdoctors').prop('src', '');
            $('#imgdoctors').prop('src', e.target.result);
            $("#hidIsImage").val("1");
        }
        reader.readAsDataURL(input.files[0]);
        //$(input).val(null);
    }
}
