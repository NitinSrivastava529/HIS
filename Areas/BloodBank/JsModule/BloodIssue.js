var _IPOPNo, _IPOPType, _IndentNo, _PatientName, _IndentAutoId;
$(document).ready(function () {
    DonorInfo();
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
    $('#tblDonorInfo tbody').on('click', 'button', function () {
        var IPOPNo = $(this).closest('tr').find('td:eq(5)').text();
        var IPOPType = $(this).closest('tr').find('td:eq(2)').text();
        var ComponentId = $(this).closest('tr').find('td:eq(1)').text();
        var IndentNo = $(this).closest('tr').find('td:eq(4)').text();
        var PatientName = $(this).closest('tr').find('td:eq(6)').text();
        var IndentAutoId = $(this).closest('tr').find('td:eq(10)').text();
        selectRow($(this))
        _IPOPNo = IPOPNo;
        _IPOPType = IPOPType;
        _IndentNo = IndentNo;
        _IndentAutoId = IndentAutoId;
        _PatientName = PatientName;
        StockInfo($(this));
    });
});
function DonorInfo() {
    $('#tblDonorInfo tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = '-';
    objBO.VisitId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.IndentNo = '-';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "BloodIssue:DonorInfo";
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
                        tbody += "<tr>";
                        tbody += "<td style='padding:0px 5px'><button style='height: 17px;line-height:0;' class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i></button></td>";
                        tbody += "<td class='hide'>" + val.ComponentId + "</td>";
                        tbody += "<td class='hide'>" + val.IPOPType + "</td>";
                        tbody += "<td>" + val.IndentDate + "</td>";
                        tbody += "<td>" + val.IndentNo + "</td>";
                        tbody += "<td>" + val.IPOPNo + "</td>";
                        tbody += "<td>" + val.PatientName + "</td>";
                        tbody += "<td>" + val.BloodGroupAllotted + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td>" + val.roomFullName + "</td>";
                        tbody += "<td class='hide'>" + val.IndentAutoId + "</td>";
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
function StockInfo(elem) {
    $('#tblStockInfo tbody').empty();
    $('#tblIssuedBloodIndent tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = '-';
    objBO.VisitId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.IndentNo = $(elem).closest('tr').find('td:eq(4)').text(); //Indent No carries
    objBO.Prm1 = $(elem).closest('tr').find('td:eq(1)').text(); //Component Id carries
    objBO.Prm2 = $(elem).closest('tr').find('td:eq(7)').text(); //Blood Group Allotted carries
    objBO.login_id = Active.userId;
    objBO.Logic = "BloodIssue:StockInfo";
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
                        if (val.IsIssueLocked == 'Y')
                            tbody += "<tr class='hold'>";
                        else
                            tbody += "<tr>";

                        tbody += "<td>" + counter + "</td>";
                        tbody += "<td class='hide'>" + val.itemId + "</td>";
                        tbody += "<td class='hide'>" + val.ComponentID + "</td>";
                        tbody += "<td>" + val.Stock_Id + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td class='text-right'>" + val.Qty + "</td>";
                        tbody += "<td>" + val.ExpDate + "</td>";
                        tbody += "<td>" + val.BBTubeNo + "</td>";
                        tbody += "<td>" + val.BloodGroup + "</td>";
                        tbody += "<td><button class='btn btn-warning btn-xs' data-autoid=" + val.AutoId + " onclick=Issue(this) style='height: 17px;line-height: 0;'><i class='fa fa-check-circle'>&nbsp;</i>Issue</button></td>";
                        if (val.IsHold != 'Y') {
                            if (val.IsIssueLocked != 'Y')
                                tbody += "<td><button class='btn btn-danger btn-xs' onclick=HoldUnHold(" + val.AutoId + ",'Hold') style='height: 17px;line-height: 0;'><i class='fa fa-clock-o'>&nbsp;</i>Hold</button></td>";
                            else
                                tbody += "<td>Hold</td>";

                        }
                        else
                            tbody += "<td><button class='btn btn-danger btn-xs' onclick=HoldUnHold(" + val.AutoId + ",'UnHold') style='height: 17px;line-height: 0;'><i class='fa fa-clock-o'>&nbsp;</i>Un-Hold</button></td>";


                        tbody += "<td>" + val.IssueHoldTo + "</td>";
                        tbody += "</tr>";
                        count++;
                    });
                    $('#tblStockInfo tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbody = "";
                    var counter = 0;
                    var count = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        counter++;
                        tbody += "<tr>";
                        tbody += "<td>" + counter + "</td>";
                        tbody += "<td>" + val.IndentNo + "</td>";
                        tbody += "<td>" + val.PatientName + "</td>";
                        tbody += "<td>" + val.BloodGroup + "</td>";
                        tbody += "<td>" + val.BBTubeNo + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblIssuedBloodIndent tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Issue(elem) {
    if (confirm('Are you sure to Issue?')) {
        var url = config.baseUrl + "/api/BloodBank/BB_Insert_ModifyBloodIssue";
        var objBO = {};
        objBO.AutoId = $(elem).data('autoid');
        objBO.hosp_id = Active.HospId;
        objBO.Stock_ID = $(elem).closest('tr').find('td:eq(3)').text();
        objBO.ItemID = $(elem).closest('tr').find('td:eq(1)').text();
        objBO.IndentNo = _IndentNo;
        objBO.IPOPNo = _IPOPNo;
        objBO.IPOPType = _IPOPType;
        objBO.Quantity = $(elem).closest('tr').find('td:eq(5)').text();
        objBO.Prm1 = _IPOPNo + ' : ' + _PatientName;
        objBO.Prm2 = _IndentAutoId;
        objBO.login_id = Active.userId;
        objBO.Logic = "Issue";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    $('#tblDonorInfo tbody tr.select-row').css('background-color', 'green');
                    $('#tblDonorInfo tbody tr.select-row').find('button').click();
                }
                else {
                    alert(data)
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function HoldUnHold(AutoId, logic) {
    if (confirm('Are you sure to ' + logic+'?')) {
        var url = config.baseUrl + "/api/BloodBank/BB_Insert_ModifyBloodIssue";
        var objBO = {};
        objBO.AutoId = AutoId;
        objBO.hosp_id = Active.HospId;
        objBO.Stock_ID = '-';
        objBO.ItemID = '-';
        objBO.IndentNo = _IndentNo;
        objBO.IPOPNo = _IPOPNo;
        objBO.IPOPType = _IPOPType;
        objBO.Quantity = 0;
        objBO.Prm1 = _IPOPNo + ' : ' + _PatientName;
        objBO.Prm2 = '-';
        objBO.login_id = Active.userId;
        objBO.Logic =logic;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    alert('Successfully ' + logic+'');
                    $('#tblDonorInfo tbody tr.select-row').find('button').click();
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}