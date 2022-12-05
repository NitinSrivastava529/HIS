$(document).ready(function () {
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
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
function DownloadPDF() {
    var url = "../Print/GetKitchenReqSlip?from=" + $("#txtFrom").val() + "&to=" + $("#txtTo").val() + "&Category=" + $("#ddlCategory option:selected").text() + "&Floor=" + $("#ddlFloor option:selected").text();
    window.open(url,'_blank')
}
function DownloadExcel() {
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.Prm1 = $("#ddlCategory option:selected").text();
    objBO.Prm2 = $("#ddlFloor option:selected").text();
    objBO.OutPutType = "Excel";
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetKitchenReqSlip';  
    Global_DownloadExcel(url, objBO,"KitchenReq.xlsx");
}
function SummarizedDietInfoExcel() {
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.Prm1 = $("#ddlCategory option:selected").text();
    objBO.Prm2 = $("#ddlFloor option:selected").text();
    objBO.OutPutType = "Excel";
    objBO.login_id = Active.userId;
    objBO.Logic = 'SummarizedDietInfoExcel';
    Global_DownloadExcel(url, objBO, "KitchenSummarisedReport.xlsx");
}

function GetPatientDietInfo() {
    $('#tblPatientDietInfo tbody').empty();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.Prm1 = $("#ddlCategory option:selected").text();
    objBO.Prm2 = $("#ddlFloor option:selected").text();
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetPatientDietInfoForEdit';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var count = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {

                        if (val.dietecianLockTime == '1900-01-01T00:00:00')
                            tbody += "<tr>";
                        else
                            tbody += "<tr style=background-color:lightgreen>";


                        if (val.FreezedDateTime != '1900-01-01T00:00:00')
                            tbody += "<tr style=background-color:lightpink>";


                        tbody += "<label style='display:none'>" + JSON.stringify(data.ResultSet.Table[count]) + "</label>";
                        tbody += "<td style='display:none'>" + val.RequestId + "</td>";
                        tbody += "<td>" + val.IPDNo + "</td>";
                        tbody += "<td>" + val.PatientName + "</td>";
                        tbody += "<td>" + val.AgeInfo + "</td>";
                        tbody += "<td>" + val.RoomBedDetail + "</td>";
                        tbody += "<td>" + val.DietName + "</td>";
                        //tbody += "<td><button  class='btn-warning' onclick=onclick=selectRow(this);PatientInfo('" + val.IPDNo + "') style='border:none;'><spna class='fa fa-sign-in'></span></button></td>";
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
function diet_LockOrFreeze() {
    var RequestIds = ''
    $('#tblPatientDietInfo tbody tr').each(function () {

        RequestIds = RequestIds + $(this).closest('tr').find('td:eq(0)').text() + '|';

    });
    var url = config.baseUrl + "/api/Dietician/diet_LockOrFreeze";
    var objBO = {};
    objBO.IPDNo = "-";
    objBO.Prm1 = RequestIds;
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'FreezeDiets';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}