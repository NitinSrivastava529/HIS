$(document).ready(function () {
    $('select').select2();  
    $('#tblReferralDetails thead').on('change', 'input:checkbox', function () {
        const isCheck = $(this).is(':checked');
        if (isCheck) {
            $(this).parents('table').find('tbody').find('input:checkbox').prop('checked', true);
        }
        else {
            $(this).parents('table').find('tbody').find('input:checkbox').prop('checked', false);
        }
    });
    GetProList();
});
function GetProList() { 
        var url = config.baseUrl + "/api/master/mReferralQueries";
        var objBO = {};
        objBO.hosp_id = Active.unitId;
        objBO.login_id = Active.userId;
        objBO.EmpName = "";
        objBO.Logic = "GetProListInDoctor";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            async: false,
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.ResultSet.Table.length > 0) {
                    $("#ddlEmpCode").empty();
                    $("#ddlEmpCode").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlEmpCode").append($("<option></option>").val(value.emp_code).html(value.empname));
                    });
                    $('input:text').val('');
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
}
function FindPRO() {
    var empname = $("#txtProCode").val();
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.EmpName = empname;
    objBO.Logic = "SearchEmployeeByName";
    $.ajax({
        method:"POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("#ddlPROCode").empty();
                $("#ddlPROCode").append($("<option></option>").val("0").html("Please Select"));
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlPROCode").append($("<option></option>").val(value.emp_code).html(value.empname));
                });
                $('input:text').val('');
            }
        },
        error: function (response) {
            alert('Server Error.....!');
        }
    });
}
function GetReferralById() {
    var url = config.baseUrl + "/api/master/mReferralQueries";
    var objBO = {};
    objBO.prm_1 = $('#ddlEmpCode option:selected').val();
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.Logic = "GetRefrerralByPROId";
    $.ajax({
        method:"POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblReferralDetails tbody').empty();
            var tbody = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.ref_code + "</td>";
                        tbody += "<td>" + val.ref_name + "</td>";
                        tbody += "<td>" + val.degree + "</td>";
                        tbody += "<td>" + val.c_name + "</td>";
                        tbody += "<td>" + val.c_locality + "</td>";
                        tbody += "<td>" + val.speciality + "</td>";
                        tbody += "<td>" + val.mobile_no + "</td>";
                        tbody += "<td>" + val.address + "</td>";
                        tbody += "<td><input type='checkbox'></td>";
                        tbody += "</tr>";
                    });
                    $('#tblReferralDetails tbody').append(tbody);
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
function UpdateReferralByProCode() {
    var url = config.baseUrl + "/api/master/mReferralInsertUpdate";
    var objBO = {};
    //A1|A2|A3
    var refCode = [];
    $('#tblReferralDetails tbody tr').find('td:eq(8)').find('input:checkbox:checked').each(function() {
        refCode.push($(this).closest('tr').find('td:eq(0)').text());
    });
    objBO.prm_1 = refCode.join('|');
    objBO.EmpCode = $('#ddlPROCode option:selected').val();
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.Logic = "ReferralTransferToPro";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('success')) {
                alert('Update successfully');
                GetReferralById();
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


