var _SelectedFloor;
$(document).ready(function () { 
    GetPatientDetails();
    $('#txtSearchPatient').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#IPDPatientList .section').filter(function () {
            $(this).toggle($(this).data('name').toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#ddlRoom').on('change', function () {
        _SelectedFloor = this.value;
        updateFilters();      
    });      
});
function updateFilters() {
    $('#IPDPatientList .section').hide().filter(function () {
        var self = $(this),
            result = true;

        if (_SelectedFloor && (_SelectedFloor != 'ALL')) {
            result = result && _SelectedFloor === self.data('floor');
        }     
        return result;
    }).show();
}
function TodayDate() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    $(".section input[id=txtTo]").attr("value", today);
}
function GetPatientInfoByIPDNo() {
    if ($('#txtIPDNo').val() == '') {
        alert('Please Provide IPD No.');
        return;
    }
    $('#IPDPatientList').empty();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = $('#txtIPDNo').val();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'SinglePatientInfoByIPDNo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var count = 0;
            var totalCount = 0;
            var html = ""; var room = []; var roomType = [];
            $.each(data.ResultSet.Table, function (key, val) {
                totalCount++;
                room.push(val.FloorName);
                roomType.push(val.RoomType);
                html += "<div  class='section' data-ipd='" + val.IPDNo + "' data-name='" + val.PatientName + "' data-roomtype='" + val.RoomType + "' data-floor='" + val.FloorName + "'>";
                html += "<label style='display:none'>" + JSON.stringify(data.ResultSet.Table[count]) + "</label>";
                html += "<table class='table'>";
                html += "<tr>";
                html += "<td>IPD No</th>";
                html += "<td>:</th>";
                html += "<td>" + val.IPDNo + "</td>";
                html += "<td>&nbsp</th>";
                html += "<td>Patient Name</th>";
                html += "<td>:</th>";
                html += "<td>" + val.PatientName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Age</th>";
                html += "<td>:</th>";
                html += "<td>" + val.Age + "</td>";
                html += "<td style='display:none'>" + val.Gender + "</td>";
                html += "<td>&nbsp</th>";
                html += "<td>Room No</th>";
                html += "<td>:</th>";
                html += "<td>" + val.RoomName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Admitted Under</th>";
                html += "<td>:</th>";
                html += "<td colspan='5'>" + val.DoctorName + "</td>";
                html += "</tr>";
                var d = val.AdmitDate.split(' ')[0];
                var AdmitDate = d.split('-')[2] + '-' + d.split('-')[1] + '-' + d.split('-')[0];
                html += "<tr>";
                html += "<td>Admit Date</th>";
                html += "<td>:</th>";
                html += "<td colspan='5'><span1 class='flex'><input type='date' id='txtFrom' value='" + AdmitDate + "' class='form-control' /><input type='date' id='txtTo' class='form-control' /><span2 style='display:none'>" + val.DoctorId + "</span2><span3 style='display:none'>" + val.FloorName + "</span3>";
                html += "<span class='text-right' style='margin: -4px 0;float:right'>";
                html += "<button data-ipd=" + val.IPDNo + " class='btn btn-success btn-xs pull-right' onclick=DietAnalytics(this)><i class='fa fa-eye'>&nbsp;</i>View</button>";
                html += "</span></span1>";
                html += "</td>";
                html += "</tr>";
                html += "</tr>";
                html += "</table>";
                html += "</div>";
                count++;
            });
            $('#IPDPatientList').append(html);
            TodayDate();
            $('#ddlRoom').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
            var unique = room.filter(function (itm, i, room) {
                return i == room.indexOf(itm);
            });
            for (i = 0; i < unique.length; i++) {
                var data = '<option>' + unique[i] + '</option>'
                $('#ddlRoom').append(data);
            }
            $('#ddlRoomType').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
            var unique1 = roomType.filter(function (itm, i, room) {
                return i == roomType.indexOf(itm);
            });
            for (i = 0; i < unique1.length; i++) {
                var data = '<option>' + unique1[i] + '</option>'
                $('#ddlRoomType').append(data);
            }
            $('#totaFilterCount').text('Total : ' + totalCount);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPatientDetails() {
    $('#IPDPatientList').empty();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetPatientInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var count = 0;
            var totalCount = 0;
            var html = ""; var room = []; var roomType = [];
            $.each(data.ResultSet.Table, function (key, val) {
                totalCount++;
                room.push(val.FloorName);
                roomType.push(val.RoomType);       
                html += "<div  class='section' data-ipd='" + val.IPDNo + "' data-name='" + val.PatientName + "' data-roomtype='" + val.RoomType + "' data-floor='" + val.FloorName + "'>";
                html += "<label style='display:none'>" + JSON.stringify(data.ResultSet.Table[count]) + "</label>";
                html += "<table class='table'>";             
                html += "<tr>";
                html += "<td>IPD No</th>";
                html += "<td>:</th>";
                html += "<td>" + val.IPDNo + "</td>";
                html += "<td>&nbsp</th>";
                html += "<td>Patient Name</th>";
                html += "<td>:</th>";
                html += "<td>" + val.PatientName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Age</th>";
                html += "<td>:</th>";
                html += "<td>" + val.Age + "</td>";
                html += "<td style='display:none'>" + val.Gender + "</td>";
                html += "<td>&nbsp</th>";
                html += "<td>Room No</th>";
                html += "<td>:</th>";
                html += "<td>" + val.RoomName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Admitted Under</th>";
                html += "<td>:</th>";
                html += "<td colspan='5'>" + val.DoctorName + "</td>";
                html += "</tr>";
                var d = val.AdmitDate.split(' ')[0];
                var AdmitDate = d.split('-')[2] + '-' + d.split('-')[1] + '-' + d.split('-')[0];
                html += "<tr>";
                html += "<td>Admit Date</th>";
                html += "<td>:</th>";
                html += "<td colspan='5'><span1 class='flex'><input type='date' id='txtFrom' value='" + AdmitDate+"' class='form-control' /><input type='date' id='txtTo' class='form-control' /><span2 style='display:none'>" + val.DoctorId + "</span2><span3 style='display:none'>" + val.FloorName + "</span3>";
                html += "<span class='text-right' style='margin: -4px 0;float:right'>";
                html += "<button data-ipd=" + val.IPDNo + " class='btn btn-success btn-xs pull-right' onclick=DietAnalytics(this)><i class='fa fa-eye'>&nbsp;</i>View</button>";
                html += "</span></span1>";
                html += "</td>";
                html += "</tr>";
                html += "</tr>";               
                html += "</table>";
                html += "</div>";
                count++;
            });
            $('#IPDPatientList').append(html);
            TodayDate();
            $('#ddlRoom').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
            var unique = room.filter(function (itm, i, room) {
                return i == room.indexOf(itm);
            });
            for (i = 0; i < unique.length; i++) {
                var data = '<option>' + unique[i] + '</option>'
                $('#ddlRoom').append(data);
            }
            $('#ddlRoomType').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
            var unique1 = roomType.filter(function (itm, i, room) {
                return i == roomType.indexOf(itm);
            });
            for (i = 0; i < unique1.length; i++) {
                var data = '<option>' + unique1[i] + '</option>'
                $('#ddlRoomType').append(data);
            }
            $('#totaFilterCount').text('Total : ' + totalCount);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DietAnalytics(elem) {
    $(elem).parents('#IPDPatientList').find('.section*').removeClass('selected');
    $(elem).parents('.section').addClass('selected');
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = $(elem).data('ipd');
    objBO.from = $(elem).closest('tr').find('#txtFrom').val();
    objBO.to = $(elem).closest('tr').find('#txtTo').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'Ipd:DietAnalytics';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            CalorieChart(data.ResultSet.Table);
            NutritionChart(data.ResultSet.Table1);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CalorieChart(response) {
    $('#graphContainer').empty(); // this is my <canvas> element
    $('#graphContainer').append('<canvas id="chartCalorie"><canvas><br />');
    var canvas = document.querySelector('#chartCalorie');
    var ctxL = canvas.getContext('2d');
    var xValues = [];
    var TempArr = [];
    for (var i in response) {
        xValues.push(response[i].ServingDate);
        TempArr.push(response[i].CalorieCount);
    }
    var config = {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: "Total Calorie Count",
                    data: TempArr,
                    backgroundColor: ['rgba(0, 137, 132, .2)',], borderColor: ['rgba(0, 10, 130, .7)',],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 10,
                        max: 5000
                    }
                }]
            }
        }
    };
    var myLineChart = new Chart(ctxL, config);
}
function NutritionChart(response) {
    $('#nutriGraphContainer').empty(); // this is my <canvas> element
    $('#nutriGraphContainer').append('<canvas id="chartNutrition"><canvas><br />');
    var canvas = document.querySelector('#chartNutrition');
    var ctxL = canvas.getContext('2d');
    var xValues = [];
    var TempArr = [];
    for (var i in response) {
        xValues.push(response[i].NutritionName);
        TempArr.push(response[i].NutritionValue);
    }
    var config = {
        type: 'pie',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: "Total Nutrition Count",
                    data: TempArr,
                    backgroundColor: ["rgba(117,169,255,0.6)", "rgba(148,223,215,0.6)",
                        "rgba(208,129,222,0.6)", "rgba(247,127,167,0.6)",
                        "#f39c12", "#337ab7", "#539906", "#f60"
                    ],
                    borderWidth: 2
                }
            ]
        }
    };
    var myLineChart = new Chart(ctxL, config);
}