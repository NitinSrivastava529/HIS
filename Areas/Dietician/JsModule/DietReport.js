$(document).ready(function () {
    FillCurrentDate('txtFrom');    
    GetDietMaster();
});

function GetDietMaster() {
    $('#ddlFloor').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
    $('#ddlCategory').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetDietCategory';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlCategory').append($('<option></option>').val(val.CategoryName).html(val.CategoryName));
            });
            $.each(data.ResultSet.Table1, function (key, val) {
                $('#ddlFloor').append($('<option></option>').val(val.FloorName).html(val.FloorName));
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DietReportOfTheDay() {
    $('#tblPatientDietInfo tbody').empty();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtFrom").val();
    objBO.Prm2 = $("#ddlCategory option:selected").text();
    objBO.Prm1 = $("#ddlFloor option:selected").text();
    objBO.login_id = Active.userId;
    objBO.Logic = 'DietReportOfTheDay';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var count =0;
            var temp = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {    
                        if (temp != val.IPDNo) {
                            tbody += "<tr style='background:#ffebbe'>";
                            tbody += "<td colspan='7'><b>IPD No : </b>" + val.IPDNo+"</td>";
                            tbody += "</tr>";
                            temp = val.IPDNo;
                        }
                        if (val.DietList != '-')
                            tbody += "<tr style='background:#b9f3b9'>";
                        else
                            tbody += "<tr>";                      


                        tbody += "<td style='display:none'>" + val.RequestId + "</td>";
                        tbody += "<td style='display:none'>" + val.IPDNo + "</td>";
                        tbody += "<td>" + val.PatientName + "</td>";                        
                        tbody += "<td>" + val.RoomDetail + "</td>";
                        tbody += "<td class='dietCategory' data-ipd=" + val.IPDNo + " onclick=GetPatientInfo(this)>" + val.CategoryName + "</td>";                       
                        tbody += "<td>" + val.DietList + "</td>";        
                        tbody += "<td>" + val.ScheduledBy + "</td>";  
                        tbody += "<td>" + val.dietecianLockBy + "</td>";                       
                        tbody += "<td>" + val.FreezedBy + "</td>";                                                                    
                        tbody += "</tr>";
                        count++;
                    });
                }
            }
            $('#tblPatientDietInfo tbody').append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPatientInfo(elem) {
    selectRow(elem)
    PatientInfo($(elem).data('ipd'));
    $('#txtScheduleDate').trigger('change');
    $('#modalSchedule').modal('show');
}