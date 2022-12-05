$(document).ready(function () {
    RegisterComponentInfo();
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
});
function RegisterComponentInfo() {
    $('#tblRegisterComponentInfo tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = '-';
    objBO.VisitId = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'Register:Component';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    var temp = "";
                    var counter = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        counter++;
                        if (temp != val.dtEntry) {
                            tbody += "<tr style=background:#e7e2bf>";
                            tbody += "<td colspan='12'>Regiser Date : " + val.dtEntry + "</td>";
                            tbody += "</tr>";
                            temp = val.dtEntry;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + counter + "</td>";
                        tbody += "<td>" + val.BloodGroup + "</td>";
                        tbody += "<td>" + val.BloodCollection_Id + "</td>";
                        tbody += "<td>" + val.BBTubeNo + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td>" + val.BagType + "</td>";
                        tbody += "<td>" + val.CreatedBy + "</td>";
                        tbody += "<td>" + val.CollectedDate + "</td>";
                        tbody += "<td>" + val.CreationDate + "</td>";
                        tbody += "<td>" + val.IsHold + "</td>";                      
                        tbody += "<td>" + val.isIssued + "</td>";
                        tbody += "<td>" + val.reasonof + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblRegisterComponentInfo tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function DownloadExcel() {
    $('#tblRegisterComponentInfo tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = '-';
    objBO.VisitId = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.OutPutType = "Excel"
    objBO.login_id = Active.userId;
    objBO.Logic = 'Register:Component';
    Global_DownloadExcel(url, objBO, "RegisterComponent.xlsx");
}