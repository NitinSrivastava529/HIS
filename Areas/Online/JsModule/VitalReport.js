$(document).ready(function () {
    GetPatientDetails();    
    $('#tblAdmittedIPDPatient tbody').on('click', 'tr', function () {
        $('span[data-pname]').text($(this).data('pname'));
        $('span[data-age]').text($(this).data('age'));
        $('span[data-gender]').text($(this).data('gender'));
        $('span[data-bdate]').text($(this).data('bdate'));
        $('span[data-dname]').text($(this).data('dname'));
    });   
});
function GetPatientDetails() {
    
    var url = config.baseUrl + "/api/Online/PackageQueries";
    var from = "1900-01-01"
    var to = "1900-01-01"
    var obj = {};
    obj.DoctorId = "CH01";
    obj.PatientId = "-";
    obj.fromdate = from;
    obj.todate = to;
    obj.prm_1 = "-";
    obj.login_id = "-"
    obj.Logic = "CovidPatientListForDoctor";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                
                $("#tblAdmittedIPDPatient tbody").empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr data-dname="' + val.DoctorName + '" data-pname="' + val.patient_name + '" data-age="' + val.age + '" data-gender="' + val.gender + '" data-bdate="' + val.booking_date + '"><td><img id=' + val.PatientId + '  src="/images/hand.png" style="width:16px;cursor:pointer" onclick="VitalReport(this.id)" /></td><td>' + val.booking_date + '</td><td>' + val.PatientId + '</td><td>' + val.patient_name + '</td><td>' + val.age + '</td>' + '<td>' + val.gender + '</td></tr>').appendTo($("#tblAdmittedIPDPatient tbody"));
                });
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function VitalReport(PatientId) {
    var url = config.baseUrl + "/api/Online/VitalReports";
    var objBO = {};
    objBO.PatientId = PatientId;
    objBO.Logic = "CovidReport";
    objBO.prm_1 = "DoctorView";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                $("#divStatic").html(data.TableHtml);
                PopulateChartBP(data.datachart);
                PopulateChartSPO2(data.datachart);
                PopulateChartPulse(data.datachart);
                PopulateChartTemprature(data.datachart);
            }
            else {
            }
        },
        complete: function (res) {
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PopulateChartBP(response) {

    var xValues = [];
    var bpHighArr = [];
    var bpLowArr = [];
    for (var i in response) {
        xValues.push(response[i].day);
        bpHighArr.push(response[i].bp_Sys_high);
        bpLowArr.push(response[i].bp_dias_low);
    }
    var ctxL = document.getElementById("chartBP").getContext('2d');
    var myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: "BP Systolic",
                    data: bpHighArr,
                    backgroundColor: ['rgba(205,0,190,.2)',], borderColor: ['rgba(300,99,25,.7)',],
                    borderWidth: 2
                },
                {
                    label: "BP Diastolic ",
                    data: bpLowArr,
                    backgroundColor: ['rgba(0, 137, 132, .2)',], borderColor: ['rgba(0, 10, 130, .7)',],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}
function PopulateChartSPO2(response) {
    var xValues = [];
    var spo2Arr = [];
    for (var i in response) {
 
        xValues.push(response[i].day);
        spo2Arr.push(response[i].SPO2);
    }
    var ctxL = document.getElementById("chartSPO2").getContext('2d');
    var myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
            {
                    label: "SPO2",
                    data: spo2Arr,
                    backgroundColor: ['rgba(0, 137, 132, .2)',], borderColor: ['rgba(0, 10, 130, .7)',],
                    borderWidth: 2
            }
          ]
        },
        options: {
            responsive: true
        }
    });
}
function PopulateChartPulse(response) {

    var xValues = [];
    var pulseArr = [];
    for (var i in response) {

        xValues.push(response[i].day);
        pulseArr.push(response[i].pulse);
    }
    var ctxL = document.getElementById("chartPulse").getContext('2d');
    var myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                 {
                    label: "PULSE",
                    data: pulseArr,
                    backgroundColor: ['rgba(0, 137, 132, .2)',], borderColor: ['rgba(0, 10, 130, .7)',],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true
        }
    });


}
function PopulateChartTemprature(response) {
    var xValues = [];
    var TempArr = [];
    for (var i in response) {
        xValues.push(response[i].day);
        TempArr.push(response[i].temprature);
    }
    var ctxL = document.getElementById("chartTemprature").getContext('2d');
    var myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: "Temprature",
                    data: TempArr,
                    backgroundColor: ['rgba(0, 137, 132, .2)',], borderColor: ['rgba(0, 10, 130, .7)',],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true
        }
    });


}
function UpdateAndCloseVitalRemark(id) {
    
    var patientid = $(id).data('patientid');
    var read_date = $(id).data('read_date');
    var remark = $(id).closest('tr').find('textarea').val();
    var url = config.baseUrl + "/api/Online/UpdateAndCloseVitalRemark";
    var from = ddmmyyToyymmdd(read_date, '-');
    var objBO = {};
    objBO.PatientId = patientid;
    objBO.read_date = from;
    objBO.remark = remark;
    objBO.login_id = Active.userId;
    objBO.DoctorId = Active.doctorId;
    objBO.Logic = "UpdateRemark";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                $(id).closest('tr').find('textarea').val('');
                alert(data);
            }
            else {
            }
        },
        complete: function (res) {
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}




