$(document).ready(function () {
    RegisterDonorInfo();
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
});
function RegisterDonorInfo() {
    $('#tblDonorInfo tbody').empty();
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
    objBO.Logic = 'Register:DonorInfo';
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
                            tbody += "<td colspan='10'>Regiser Date : " + val.dtEntry + "</td>";
                            tbody += "</tr>";
                            temp = val.dtEntry;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + counter + "</td>";
                        tbody += "<td>" + val.donor_id + "</td>";
                        tbody += "<td>" + val.donorName + "</td>";
                        tbody += "<td>" + val.Gender + "</td>";
                        tbody += "<td>" + val.address + "</td>";
                        tbody += "<td>" + val.contactNo + "</td>";
                        tbody += "<td>" + val.aadharNo + "</td>";
                        tbody += "<td>" + val.donor_BloodGroup + "</td>";
                        tbody += "<td>" + val.BloodGroup + "</td>";
                        tbody += "<td>" + val.bloodAllotted + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblDonorInfo tbody').append(tbody);
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
    objBO.Logic = 'Register:DonorInfo';
    Global_DownloadExcel(url, objBO, "RegisterDonorInfo.xlsx");
}