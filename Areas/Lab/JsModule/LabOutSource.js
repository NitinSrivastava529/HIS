$(document).ready(function () {
    searchTable('txtSearch', 'tblLabOutSource')
    GetLabOutSource();
    $('#btnSubmit').on('click', function () {
        LabOutSource();
    });
    $('#btnNew').on('click', function () {
        alert('hyy');
    });
    $('#tbody').on('click', '', function () {
    });
});
function LabOutSource() {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/LabInsertUpdateOutSource";
    objBO.LabType = $('#ddlLabtype option:selected').text();
    objBO.LabName = $('#txtName').val();
    objBO.address = $('#txtdegree').val();
    objBO.cstate = $('#ddlState option:selected').text();
    objBO.city = $('#ddlDistrict option:selected').text();
    objBO.contact_no = $('#txtContactNo').val();
    objBO.cin = $('#txtCinNo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = "Insert";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                GetLabOutSource();

            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetLabOutSource() {
    var url = config.baseUrl + "/api/Lab/LabOutSourceQuerries";
    var objBO = {};
    objBO.logic = "GetLabOutSource";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {          
            $('#tblLabOutSource tbody').empty();
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" +
                            '<category type="button" class="btn btn-primary btn-xs getCat" ><i class="fa fa-edit"></i></category>' +
                            "</td>";
                        tbody += "<td>" + val.LabCode + "</td>";
                        tbody += "<td>" + val.LabName + "</td>";
                        tbody += "<td>" +
                            '<label class="switch">' +
                            '<input type="checkbox" id="chkActive" ' + val.checked + '>' +
                            '<span class="slider round"></span>' +
                            '</label>' +
                            "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblLabOutSource tbody').append(tbody);

                }
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}