var _IPOPNo, _IPOPType, _IndentNo;
$(document).ready(function () {
    IndentInfo('IndentInfoForBloodTest');
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
});
function IndentInfo(logic) {
    $('#tblDonorInfo tbody').empty();
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
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    var counter = 0;
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        counter++;
                        if (val.BloodGroupNo != 'Not Tested')
                            tbody += "<tr class='bg-success'>";
                        else
                            tbody += "<tr>";

                        tbody += "<td class='hide'>" + JSON.stringify(data.ResultSet.Table[count]) + "</td>";
                        tbody += "<td>" + counter + "</td>";
                        tbody += "<td>" + val.IndentDate + "</td>";
                        tbody += "<td>" + val.IndentNo + "</td>";
                        tbody += "<td>" + val.IPOPNo + "</td>";
                        tbody += "<td>" + val.PatientName + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td>" + val.roomFullName + "</td>";
                        if (val.BloodGroupNo == 'Not Tested') {
                            tbody += "<td><select class='form-control'>";
                            tbody += "<option>Select";
                            $.each(data.ResultSet.Table1, function (key, val) {
                                tbody += "<option value=" + val.BloodGroupId + ">" + val.BloodGroupAllotted + "";
                            });
                            tbody += "</select></td>";
                        }
                        else
                            tbody += "<td class='text-center'>" + val.BloodGroupAllotted + "</td>";

                        if (val.BloodGroupNo == 'Not Tested')
                            tbody += "<td style='padding:0px 5px'><button data-indentno=" + val.IndentNo + " style='height: 17px;line-height:0;' onclick=UpdateBloodGroup(this) class='btn btn-warning btn-xs'>Update</button></td>";
                        else
                            tbody += "<td>-</td>";

                        tbody += "</tr>";
                        count++;
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
function UpdateBloodGroup(elem) {
    if ($(elem).closest('tr').find('select option:selected').text() == 'Select') {
        alert('Please Choose Blood Group.');
        $(elem).closest('tr').find('select').css('border-color', 'red');
        return
    }
    else
        $(elem).closest('tr').find('select').removeAttr('style');

    if (confirm('Are you sure?')) {
        var url = config.baseUrl + "/api/BloodBank/BB_Insert_ModifyBloodIssue";
        var objBO = {};
        objBO.AutoId = 0;
        objBO.hosp_id = Active.HospId;
        objBO.Stock_ID = '-';
        objBO.ItemID = '-';
        objBO.IndentNo = $(elem).data('indentno');
        objBO.IPOPNo = '-';
        objBO.IPOPType = '-';
        objBO.Quantity = '-';
        objBO.Prm1 = $(elem).closest('tr').find('select option:selected').val();
        objBO.Prm2 = '-';
        objBO.login_id = Active.userId;
        objBO.Logic = "UpdateIndentBloodGroup";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    IndentInfo('IndentInfoForBloodTest');
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}