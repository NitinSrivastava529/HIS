var _AppId = '';
var _doctorId = '';
$(document).ready(function () {
    CloseSidebar();
    //ViewConsultation();     
    FillCurrentDate('txtFromAppDate')
    FillCurrentDate('txtToAppDate')
    $('select').select2();  
    GetDoctorList();    
    $('#tblDoneAppointment tbody').on('click', '#btnView', function () {
        var AppId = $(this).closest('tr').find('td:eq(1)').text();
        var dashboard = $(this).data('dashboard');
        selectRow($(this));
        sessionStorage.setItem('AppId', AppId);
        window.location.href = config.rootUrl + "/OPD/Prescription/" + dashboard;
    }); 
    $('#tblEmergencyAppList tbody').on('click', '#btnCall', function () {
        var AppId = $(this).closest('tr').find('td:eq(1)').text();
        var DoctorId = $(this).closest('tr').find('td:eq(2)').text();
        selectRow($(this));
        _AppId = AppId;
        _doctorId = DoctorId;
        InOutMarking('DoctorRoom_CALL');
    });
    $('#tblEmergencyAppList tbody').on('click', '#btnView', function () {
        var AppId = $(this).closest('tr').find('td:eq(1)').text();
        var dashboard = $(this).data('dashboard');
        selectRow($(this));
        sessionStorage.setItem('AppId', AppId);
        window.location.href = config.rootUrl + "/OPD/Prescription/" + dashboard;
    });
    $('#tblOtherAppList tbody').on('click', '#btnView', function () {
        var AppId = $(this).closest('tr').find('td:eq(1)').text();
        var dashboard = $(this).data('dashboard');
        selectRow($(this));
        sessionStorage.setItem('AppId', AppId);
        window.location.href = config.rootUrl + "/OPD/Prescription/" + dashboard;
    });
    $('#tblOtherAppList tbody').on('click', '#btnCall', function () {
        var AppId = $(this).closest('tr').find('td:eq(1)').text();
        var DoctorId = $(this).closest('tr').find('td:eq(2)').text();
        selectRow($(this));
        _AppId = AppId;
        _doctorId = DoctorId;
        InOutMarking('DoctorRoom_CALL');
    });
    $('#tblEmergencyAppList tbody').on('click', '#btnIn', function () {
        var AppId = $(this).closest('tr').find('td:eq(1)').text();
        var DoctorId = $(this).closest('tr').find('td:eq(2)').text();
        selectRow($(this));
        _AppId = AppId;
        _doctorId = DoctorId;
        InOutMarking('DoctorRoom_IN');
    });
    $('#tblOtherAppList tbody').on('click', '#btnIn', function () {
        var AppId = $(this).closest('tr').find('td:eq(1)').text();
        var DoctorId = $(this).closest('tr').find('td:eq(2)').text();
        selectRow($(this));
        _AppId = AppId;
        _doctorId = DoctorId;
        InOutMarking('DoctorRoom_IN');
    });
});
function GetDoctorList() {
    $('#ddlDoctor').empty().select2();  
    var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
    var objBO = {};
    objBO.DoctorId = Active.doctorId;
    objBO.DeptId = '-';
    objBO.Logic = 'GetDoctorForConsult';    
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length>0) {
                if (Object.keys(data.ResultSet.Table).length>0) {                         
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlDoctor').append($('<option></option>').val(val.DoctorId).html(val.DoctorName)).change();
                    });
                }
            }
        },
        complete: function () {
            $('#ddlDoctor').prop('selectedIndex','0').change();
            ViewConsultation();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ViewConsultation() {
    $('#tblEmergencyAppList tbody').empty();
    $('#tblOtherAppList tbody').empty();
    $('#tblDoneAppointment tbody').empty();
    $('#divEmergency').hide();
    $('#divOther').hide();
    var url = config.baseUrl + "/api/Appointment/Opd_AppointmentSearch";
    var objBO = {};
    objBO.SearchValue = $('#txtSearchValue').val();
    objBO.DoctorId = $('#ddlDoctor option:selected').val();
    objBO.from = $('#txtFromAppDate').val();
    objBO.to = $('#txtToAppDate').val();
    objBO.Logic = 'ViewConsultation';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = "";
            var temp = "";
            var total = 0;
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        total++;
                        tbody += "<tr>";
                        tbody += "<td>" + total + "</td>";
                        tbody += "<td>" + val.app_no + "</td>";
                        tbody += "<td style='display:none'>" + val.DoctorId + "</td>";
                        tbody += "<td>" + val.patient_name + "</td>";
                        tbody += "<td>" + val.ageInfo + "</td>";
                        tbody += "<td>" + val.AppDate + "</td>";
                        tbody += "<td>" + val.DoctorName + "</td>";
                        tbody += "<td style='background:#fff;'>";
                        tbody += "<button class='btn btn-success btn-xs' id='btnCall' " + val.IsCalled + ">Call</button>";
                        if (val.IsIn == 'disabled')                        
                            tbody += "<button class='btn btn-warning btn-xs' disabled style='Background:" + val.IsIn_Color + "' id='btnIn'>In</button><div id='skill'><div class='circle'></div></div>";
                        else
                            tbody += "<button class='btn btn-warning btn-xs' style='Background:" + val.IsIn_Color + "' id='btnView' data-dashboard='"+val.Dept+"'>View</button><div id='skill'><div class='circle'></div></div>";
                        tbody += "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblEmergencyAppList tbody').append(tbody);
                    $('#divEmergency').show();
                }
            }
            if (Object.keys(data.ResultSet).length > 1) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    var tbody1 = "";
                    var total = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        total++;
                        tbody1 += "<tr>";
                        tbody1 += "<td>" + total + "</td>";
                        tbody1 += "<td>" + val.app_no + "</td>";
                        tbody1 += "<td>" + val.patient_name + "</td>";
                        tbody1 += "<td>" + val.ageInfo + "</td>";
                        tbody1 += "<td>" + val.AppDate + "</td>";
                        tbody1 += "<td>" + val.DoctorName + "</td>";
                        tbody1 += "<td style='background:#fff;'>";
                        tbody1 += "<button class='btn btn-success btn-xs' id='btnCall' " + val.IsCalled + ">Call</button>";
                        if (val.IsIn == 'disabled')
                            tbody1 += "<button class='btn btn-warning btn-xs' disabled style='Background:" + val.IsIn_Color + "' id='btnIn'>In</button><div id='skill'><div class='circle'></div></div>";
                        else
                            tbody1 += "<button class='btn btn-warning btn-xs' style='Background:" + val.IsIn_Color + "' data-dashboard='" + val.Dept +"' id='btnView'>View</button><div id='skill'><div class='circle'></div></div>";
                        tbody1 += "</td>";
                        tbody1 += "</tr>";
                    });
                    $('#tblOtherAppList tbody').append(tbody1);
                    $('#divOther').show();
                }
            }
            if (Object.keys(data.ResultSet).length > 2) {
                if (Object.keys(data.ResultSet.Table2).length > 0) {
                    var tbody2 = "";
                    var total = 0;
                    $.each(data.ResultSet.Table2, function (key, val) {
                        total++;
                        tbody2 += "<tr>";
                        tbody2 += "<td>" + total + "</td>";
                        tbody2 += "<td>" + val.app_no + "</td>";
                        tbody2 += "<td>" + val.patient_name + "</td>";
                        tbody2 += "<td>" + val.ageInfo + "</td>";
                        tbody2 += "<td>" + val.AppDate + "</td>";
                        tbody2 += "<td>" + val.DoctorName + "</td>";
                        tbody2 += "<td style='background:#fff;'>";
                        tbody2 += "<button class='btn btn-warning btn-xs' id='btnView' data-dashboard='" + val.Dept +"'>View</button>";
                        tbody2 += "</td>";
                        tbody2 += "</tr>";
                    });
                    $('#tblDoneAppointment tbody').append(tbody2);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InOutMarking(logic) {
    $('#tblEmergencyAppList tbody,#tblOtherAppList tbody').removeClass('btnRound*');
    $('#tblEmergencyAppList tbody,#tblOtherAppList tbody').find('#skill*').hide();

    if (_AppId == '') {
        alert('Appointment No Not Found.');
        return
    }
    var url = config.baseUrl + "/api/Appointment/Opd_InOutMarking";
    var objBO = {};
    objBO.DoctorId = _doctorId;
    objBO.BookingNo = _AppId;
    objBO.inputDate = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = logic;
    if (objBO.Logic == "DoctorRoom_IN") {
        $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').find('#btnIn').prop('disabled', true).addClass('btnRound');
        $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').find('#skill').show();
    }    
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                if (objBO.Logic == "DoctorRoom_CALL") {
                     $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').find('#btnCall').prop('disabled', true);
                    $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').find('#btnIn').prop('disabled', false);
                }

                if (objBO.Logic == "DoctorRoom_IN") {
                     $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').find('#btnCall').prop('disabled', true);
                    $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').find('#btnIn').prop('disabled', true);
                     $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').removeClass('btnRound*');
                    $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').find('#skill*').hide();
                    sessionStorage.setItem('AppId', _AppId);
                    window.location.href = "/OPD/Prescription/OPD_Dashboard";
                }
                if (objBO.Logic == "DoctorRoom_Absent") {
                     $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').find('#btnCall').prop('disabled', true);
                    $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').find('#btnIn').prop('disabled', true);
                }
            }
            else {
                 $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').removeClass('btnRound*');
                $('#tblEmergencyAppList tbody tr.select-row,#tblOtherAppList tbody tr.select-row').find('#skill*').hide();
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}