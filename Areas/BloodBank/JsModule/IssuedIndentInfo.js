var _IPOPNo, _IPOPType, _IndentNo;
$(document).ready(function () {
    IssuedIndentList('IssuedIndentList');
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
});
function IssuedIndentList(logic) {
    $('#tblIssueIndentInfo tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = '-';
    objBO.VisitId = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = $('input[name=IndentBy]:checked').val();
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    var counter = 0;
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        counter++;
                        tbody += "<tr>";
                        tbody += "<td class='hide'>" + JSON.stringify(data.ResultSet.Table[count]) + "</td>";
                        tbody += "<td>" + counter + "</td>";
                        tbody += "<td>" + val.IssuedDate + "</td>";
                        tbody += "<td>" + val.IPOPNo + "</td>";
                        tbody += "<td>" + val.PatientName + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td class='text-center'>" + val.Quantity + "</td>";
                        tbody += "<td>" + val.roomFullName + "</td>";
                        tbody += "<td>" + val.BloodGroupAllotted + "</td>";
                        tbody += "<td style='padding:0px 5px'><button data-autoid=" + val.AutoId + " style='height: 17px;line-height:0;' onclick=CancelIssueIndent(this) class='btn btn-danger btn-xs'>Cancel</button></td>";
                        tbody += "</tr>";
                        count++;
                    });
                    $('#tblIssueIndentInfo tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CancelIssueIndent(elem) {    
    if (confirm('Are you sure?')) {
        var url = config.baseUrl + "/api/BloodBank/BB_Insert_ModifyBloodIssue";
        var objBO = {};
        objBO.AutoId = $(elem).data('autoid');
        objBO.hosp_id = Active.HospId;
        objBO.Stock_ID = '-';
        objBO.ItemID = '-';
        objBO.IndentNo = '-';
        objBO.IPOPNo = $(elem).closest('tr').find('td:eq(3)').text();
        objBO.IPOPType = '-';
        objBO.Quantity = '-';
        objBO.Prm1 = $(elem).closest('tr').find('select option:selected').val();
        objBO.Prm2 = '-';
        objBO.login_id = Active.userId;
        objBO.Logic = "CancelIssueIndent";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    IssuedIndentList('IssuedIndentList');
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}