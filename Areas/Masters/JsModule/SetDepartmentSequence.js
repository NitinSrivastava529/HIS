$(document).ready(function () {
    GetDepartmentList();
});

function GetDepartmentList() {
    var url = config.baseUrl + "/api/Doctors/Web_DepartmentQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.IsActive = "Y";
    objBO.Logic = "GetDepartmentsOnly";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblDepartmentList tbody').empty();
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++
                        tbody += "<tr>";
                        tbody += "<td style='display:none;'>" + val.autoId + "</td>";
                        tbody += "<td><input type='text' style='width:100%;' value='" + val.seqNo + "'/></td>";
                        tbody += "<td>" + val.dept_name + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblDepartmentList tbody').append(tbody);
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function UpdateDepartmentSequence() {
    var AutoSeq = [];
    //A1:S1|A2:S2|A3:S3
    $('#tblDepartmentList tbody tr').each(function () {
        var auto_id = $(this).find('td:eq(0)').text();
        var SeqNo = $(this).find('td:eq(1)').find('input:text').val();
        AutoSeq.push(
            '' + $(this).find('td:eq(0)').text() + ':' + $(this).find('td:eq(1)').find('input:text').val() + ''
        );
    });
    var url = config.baseUrl + "/api/Doctors/InsertDepartmentFeatures";
    var objBO = {};
    objBO.Prm1 = AutoSeq.join('|');
    objBO.Logic = "DepartmentSequence";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('success'))
                alert(data)
            else
                alert(data)
        },
        error: function (response) {
            alert('Server Error....!');
        }
    });
}