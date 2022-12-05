var _uhid = '';
var _template = '';
$(document).ready(function () {
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
    $('#tblVaccinationInfo tbody').on('click', '#btnView', function () {
        _uhid = $(this).data('uhid');
        _template = $(this).data('temp');
        GetSchedule('GetVaccineInfo:ALL')
    });
    $('#tblVaccinationInfo tbody').on('click', '#btnCallDone', function () {
        _uhid = $(this).data('uhid');
        var autoId = [];
        $(this).closest('tr').nextUntil('.groupday').each(function () {
            autoId.push($(this).find('td:eq(1)').text());       
        });
        UpdateCallingInfo(autoId.join(','))
    });
});

function GetPatientInfo() {
    $('#tblVaccinationInfo tbody').empty();
    var url = config.baseUrl + "/api/Appointment/OPD_VaccineQueries";
    var objBO = {};
    objBO.UHID = '';
    objBO.app_no = '';
    objBO.DoctorId = '';
    objBO.Template = '';
    objBO.dob = '1900/01/01';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.VaccineId = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetPatientInfoBetweenDate';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                var tbody = "";
                var temp = "";
                var autoid =[];
                var count = 0;
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        autoid.push(val.auto_id);
                        if (temp != val.UHID) {
                            tbody += "<tr class='groupday'>";
                            tbody += "<td colspan='5'>";
                            tbody += "<b>UHID : </b>" + val.UHID + ",&nbsp;";
                            tbody += "<b>Patient Name : </b>" + val.PatientName + ",&nbsp;";
                            tbody += "<b>Gender : </b>" + val.Gender + ",&nbsp;";
                            tbody += "<b>DOB : </b>" + val.DOB.substring(0, 10) + ",&nbsp;";
                            tbody += "<b>Mobile No : </b>" + val.mobileNo + ",&nbsp;";
                            tbody += "<b>District : </b>" + val.District + "";
                            tbody += "<button disabled class='btn btn-warning btn-xs pull-right' data-temp='" + val.TemplateName + "'  data-uhid=" + val.UHID +" id='btnView'><i class='fa fa-eye'>&nbsp;</i>View</button>&nbsp;";
                            tbody += "<button class='btn btn-success btn-xs pull-right' data-uhid="+val.UHID+" id='btnCallDone'><i class='fa fa-phone'>&nbsp;</i>Call</button>&nbsp;";                                    
                            tbody += "</td> ";
                            tbody += "</tr>";
                            temp = val.UHID;
                        } 

                        if (val.CallBy!='-')
                            tbody += "<tr style='background:#c0e9cc'>";
                        else
                            tbody += "<tr>";
                         
                        tbody += "<td>" +count + "</td>";
                        tbody += "<td style='display:none'>" +val.auto_id + "</td>";
                        tbody += "<td>" + val.VaccineName + "</td>";
                        tbody += "<td>" + val.PlanedFromDate + "</td>";
                        tbody += "<td>" + val.CallBy + "</td>";
                        tbody += "<td>" + val.CallDate + "</td>";                      
                        tbody += "</tr>";
                    });
                    $('#tblVaccinationInfo tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetSchedule(logic) {
    $('#tblVaccinationScheduleInfo tbody').empty();
    var url = config.baseUrl + "/api/Appointment/OPD_VaccineQueries";
    var objBO = {};
    objBO.UHID = _uhid;
    objBO.app_no = '';
    objBO.DoctorId = '';
    objBO.Template = _template;
    objBO.dob = '1900/01/01';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.VaccineId = '';
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length > 0) {
                var tbody = "";
                var temp = "";
                var count = 0;
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        if (temp != val.VaccineGroup) {
                            tbody += "<tr class='groupday'>";
                            tbody += "<td colspan='7'><b>" + val.VaccineGroup + "</b></td>";
                            tbody += "</tr>";
                            temp = val.VaccineGroup;
                        }
                        tbody += "<tr>";

                        if (val.PlanedToDate != '1900-01-01T00:00:00')
                            tbody += "<tr class='planeDone'>";
                        if (val.VaccinationDate != '1900-01-01T00:00:00')
                            tbody += "<tr class='vaccineDone'>";    
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.VaccineId + "</td>";
                        tbody += "<td>" + val.VaccineName + "</td>";
                        tbody += "<td>" + val.ScheduleDate + "</td>";
                        if (val.PlanedFromDate != '1900-01-01T00:00:00')
                            tbody += "<td>" + val.PlanedFromDate.split('T')[0] + "</td>";
                        else tbody += "<td>-</td>";

                        if (val.PlanedToDate != '1900-01-01T00:00:00')
                            tbody += "<td>" + val.PlanedToDate.split('T')[0] + "</td>";
                        else tbody += "<td>-</td>";

                        if (val.VaccinationDate != '1900-01-01T00:00:00')
                            tbody += "<td>" + val.VaccinationDate.split('T')[0] + "</td>";
                        else tbody += "<td>-</td>";
                    
                        tbody += "</tr>";
                    });
                    $('#tblVaccinationScheduleInfo tbody').append(tbody);
                    $('#modalVaccineInfo').modal('show');
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function UpdateCallingInfo(autoId) {
    if (confirm('Are you sure to Submit?')) {      
        var url = config.baseUrl + "/api/Appointment/OPD_VaccinationInsertUpdate";
        var objBO = {};
        objBO.UHID = _uhid;
        objBO.app_no = '';
        objBO.VaccineId = '';
        objBO.from = '1900/01/01';
        objBO.to = '1900/01/01';
        objBO.Prm1 = Active.userId;
        objBO.Prm2 = autoId;
        objBO.login_id = Active.userId;
        objBO.Logic = 'UpdateCallingInfo';         
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    //alert(data);
                    GetPatientInfo();
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