var _app_no = "";
var _doctorId = "";
var _uhid = "";
$(document).ready(function () {
    CloseSidebar();
    GetDoctor();
    FillCurrentDate("txtSearchFrom");
    FillCurrentDate("txtSearchTo");
    $('#tblOPDRegister tbody').on('click', '#btnGetInfo', function () {
        selectRow($(this));
        var app_no = $(this).closest('tr').find('td:eq(2)').text();
        SelectedPatientInfo(app_no);
    })
});
function GetDoctor() {
    var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
    var objBO = {};
    objBO.Logic = 'All';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table2).length) {
                    $('#ddlDoctor').empty().append($('<option value="ALL">ALL</option>')).select2();
                    $.each(data.ResultSet.Table2, function (key, val) {
                        $('#ddlDoctor').append($('<option></option>').val(val.DoctorId).html(val.DoctorName));
                    });
                }
            }
            else {
                alert('No Record Found..');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AppointmentList(logic) {
    $('#tblOPDRegister tbody').empty();
    $('#txtAppId').text('');
    $('#txtPatientName').text('');
    $('#txtMobileNo').text('');
    $('#txtAge').text('');
    $('#txtDoctorName').text('');
    $('#txtAppDate').text('');
    var url = config.baseUrl + "/api/Appointment/Opd_ExaminationRoomQueries";
    var objBO = {};
    objBO.Hosp_Id = Active.HospId;
    objBO.SearcKey = $('#ddlStatus option:selected').text();
    objBO.SearchValue = '-'
    objBO.UHID = '-';
    objBO.AppointmentId = $('#txtAppointmentId').val();
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td><button id='btnGetInfo' class='btn-warning btn-tbl'><i class='fa fa-sign-in'>&nbsp;</i></button>";
                        tbody += "<td>" + val.token_no + "</td>";
                        tbody += "<td>" + val.app_no + "</td>";
                        tbody += "<td>" + val.patient_name + "</td>";
                        tbody += "<td>" + val.ageInfo + "</td>";
                        tbody += "<td>" + val.DoctorName + "</td>";
                        if (val.IsEmergencyVisit == '1')
                            tbody += "<td style='background:#ed4f4f;color:#fff'>" + val.uStatus + "</td>";
                        else
                            tbody += "<td>" + val.uStatus + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblOPDRegister tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 1) {
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('#txtBpSys').val(val.BP_Sys);
                    $('#txtBpDys').val(val.BP_Dys);
                    $('#txtPulse').val(val.Pulse);
                    $('#txtResp').val(val.Resp);
                    $('#txtTemprarture').val(val.Temprarture);
                    $('#txtHT').val(val.HT);
                    $('#txtWT').val(val.WT);
                    $('#txtArmSpan').val(val.ArmSpan);
                    $('#txtSittingHeight').val(val.SittingHeight);
                    $('#txtIBW').val(val.IBW);
                    $('#txtSPO2').val(val.SPO2);
                    $('#btnSaveVital').text('Update');
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SelectedPatientInfo(appNo) {
    $('#btnCall').prop('disabled', true);
    $('#btnIn').prop('disabled', true);
    $('#btnOut').prop('disabled', true);
    $('#btnSaveVital').prop('disabled', false);
    $('#btnAbsent').prop('disabled', true);
    $('#btnAbsent').prop('disabled', true);
    $('#btnCancel').prop('disabled', true);

    $('#txtBpSys').val('');
    $('#txtBpDys').val('');
    $('#txtPulse').val('');
    $('#txtResp').val('');
    $('#txtTemprarture').val('');
    $('#txtHT').val('');
    $('#txtWT').val('');
    $('#txtArmSpan').val('');
    $('#txtSittingHeight').val('');
    $('#txtIBW').val('');
    $('#txtSPO2').val('');
    $('#btnSaveVital').text('Save');
    var url = config.baseUrl + "/api/Appointment/Opd_ExaminationRoomQueries";
    var objBO = {};
    objBO.Hosp_Id = Active.HospId;
    objBO.SearcKey = '-'
    objBO.SearchValue = '-'
    objBO.UHID = '-';
    objBO.AppointmentId = appNo;
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = "AppointmentDetail";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtAppId').text(val.app_no);
                        $('#txtPatientName').text(val.patient_name);
                        $('#txtMobileNo').text(val.mobile_no);
                        $('#txtAge').text(val.ageInfo);
                        $('#txtDoctorName').text(val.DoctorName);
                        $('#txtAppDate').text(val.appDate);
                        $('#txtDoctorId').text(val.DoctorId);
                        $('#txtUHID').text(val.UHID);

                        if (val.CallTime == null && val.InTime == null && val.outTime == null) {
                            $('#btnCall').prop('disabled', false);
                            $('#btnIn').prop('disabled', true);
                            $('#btnOut').prop('disabled', true);
                        }

                        if (val.CallTime != null && val.InTime == null && val.outTime == null) {
                            $('#btnCall').prop('disabled', true);
                            $('#btnIn').prop('disabled', false);
                            $('#btnOut').prop('disabled', true);
                        }

                        if (val.CallTime != null && val.InTime != null && val.outTime == null) {
                            $('#btnCall').prop('disabled', true);
                            $('#btnIn').prop('disabled', true);
                            $('#btnOut').prop('disabled', false);
                        }

                        if (val.uStatus == 'Closed')
                            $('.btnNavigation').prop('disabled', true);

                    });
                }
                else {
                    alert("Data Not Found..");
                };
            }
            if (Object.keys(data.ResultSet.Table1).length > 0) {
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('#txtBpSys').val(val.BP_Sys);
                    $('#txtBpDys').val(val.BP_Dys);
                    $('#txtPulse').val(val.Pulse);
                    $('#txtResp').val(val.Resp);
                    $('#txtTemprarture').val(val.Temprarture);
                    $('#txtHT').val(val.HT);
                    $('#txtWT').val(val.WT);
                    $('#txtArmSpan').val(val.ArmSpan);
                    $('#txtSittingHeight').val(val.SittingHeight);
                    $('#txtIBW').val(val.IBW);
                    $('#txtSPO2').val(val.SPO2);
                    $('#btnSaveVital').text('Update');
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetVitalSign() {
    var url = config.baseUrl + "/api/Appointment/Opd_ExaminationRoomQueries";
    var objBO = {};
    objBO.AppointmentId = _app_no;
    objBO.Logic = 'PatientForAdvice';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                $('#tblVitalSign tbody').empty();
                var tbody = "";
                var count = 0;
                $.each(data.ResultSet.Table3, function (key, val) {
                    count++;
                    tbody += "<tr>"
                    tbody += "<td>" + count + "</td>";
                    tbody += "<td>" + val.BP_Sys + '/' + val.BP_Dys + "</td>";
                    tbody += "<td>" + val.Pulse + "</td>";
                    tbody += "<td>" + val.Resp + "</td>";
                    tbody += "<td>" + val.Temprarture + "</td>";
                    tbody += "<td>" + val.HT + "</td>";
                    tbody += "<td>" + val.WT + "</td>";
                    tbody += "<td>-</td>";
                    tbody += "<td>" + val.ArmSpan + "</td>";
                    tbody += "<td>" + val.SittingHeight + "</td>";
                    tbody += "<td>" + val.IBW + "</td>";
                    tbody += "<td>" + val.SPO2 + "</td>";
                    tbody += "<td>" + val.login_id + "</td>";
                    tbody += "<td>" + val.read_date + "</td>";
                    tbody += "<td><button onclick=VitalSignForUpdate() class='btn-flat btn-success'>Edit</button></td>";
                    tbody += "</tr>"
                });
                $('#tblVitalSign tbody').append(tbody);
            }
            else {
                alert('No Record Found..');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function VitalSignForUpdate() {
    var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
    var objBO = {};
    objBO.AppointmentId = Active.AppId;
    objBO.Logic = 'PatientForAdvice';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                $.each(data.ResultSet.Table3, function (key, val) {
                    $('#txtBpSys').val(val.BP_Sys);
                    $('#txtBpDys').val(val.BP_Dys);
                    $('#txtPulse').val(val.Pulse);
                    $('#txtResp').val(val.Resp);
                    $('#txtHT').val(val.HT);
                    $('#txtWT').val(val.WT);
                    $('#txtArmSpan').val(val.ArmSpan);
                    $('#txtTemprarture').val(val.Temprarture);
                    $('#txtIBW').val(val.IBW);
                    $('#txtSPO2').val(val.SPO2);
                    $('#txtSittingHeight').val(val.SittingHeight);
                });
            }
            else {
                alert('No Record Found..');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertVitalSign() {
    if ($('#txtAppId').text() == '') {
        alert('Appointment No Not Found.');
        return
    }
    var url = config.baseUrl + "/api/Prescription/CPOE_InsertVitalSign";
    var objBO = {};
    objBO.RefNo = $('#txtAppId').text();
    objBO.UHID = $('#txtUHID').text();
    objBO.DoctorId = $('#txtDoctorId').text();
    objBO.EntrySource = 'OPD';
    objBO.BP_Sys = $('#txtBpSys').val();
    objBO.BP_Dys = $('#txtBpDys').val();
    objBO.Pulse = $('#txtPulse').val();
    objBO.Resp = $('#txtResp').val();
    objBO.Temprarture = $('#txtTemprarture').val();
    objBO.HT = $('#txtHT').val();
    objBO.WT = $('#txtWT').val();
    objBO.ArmSpan = $('#txtArmSpan').val();
    objBO.SittingHeight = $('#txtSittingHeight').val();
    objBO.IBW = $('#txtIBW').val();
    objBO.SPO2 = $('#txtSPO2').val();
    objBO.login_id = Active.userId;
    objBO.Logic = ($('#btnSaveVital').text() == 'Save') ? 'Insert' : 'Update';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                Clear();
                $('#btnSaveVital').text('Save');
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
function InOutMarking(logic) {
    if ($('#txtAppId').text() == '') {
        alert('Appointment No Not Found.');
        return
    }
    var url = config.baseUrl + "/api/Appointment/Opd_InOutMarking";
    var objBO = {};
    objBO.DoctorId = $('#txtDoctorId').text();
    objBO.BookingNo = $('#txtAppId').text();
    objBO.inputDate = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                Clear();
                if (objBO.Logic == "ExaminationRoom_CALL") {
                    $('#btnCall').prop('disabled', true);
                    $('#btnIn').prop('disabled', false);
                    $('#btnAbsent').prop('disabled', false);
                }

                if (objBO.Logic == "ExaminationRoom_IN") {
                    $('#btnIn').prop('disabled', true);
                    $('#btnOut').prop('disabled', false);
                }

                if (objBO.Logic == "ExaminationRoom_OUT" || objBO.Logic == "ExaminationRoom_Absent") {
                    $('#btnCall').prop('disabled', true);
                    $('#btnIn').prop('disabled', true);
                    $('#btnOut').prop('disabled', true);
                    $('#btnSaveVital').prop('disabled', false);
                    $('#btnAbsent').prop('disabled', true);
                    $('#btnAbsent').prop('disabled', true);
                    $('#btnCancel').prop('disabled', true);
                    AppointmentList('AppList:ExaminationRoom');
                }
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
function Clear() {
    $('input:text').val('');
}