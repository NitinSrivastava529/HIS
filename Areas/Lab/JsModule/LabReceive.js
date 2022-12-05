

$(document).ready(function () {
    $('#tblLabDetails thead').on('change', 'input:checkbox', function () {
        const isCheck = $(this).is(':checked');
        if (isCheck) {
            $(this).parents('table').find('tbody').find('input:checkbox').prop('checked', true);
        }
        else {
            $(this).parents('table').find('tbody').find('input:checkbox').prop('checked', false);
        }
    });
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
    CloseSidebar();
    GetCategory();
});
function GetCategory() {
    $("#ddlCategory").empty().append($("<option></option>").val("0").html("Select")).select2();
    $("#ddlCategory").append($("<option></option>").val("ALL").html("ALL"));
    var url = config.baseUrl + "/api/Lab/LabOutSourceQueries";
    var objBO = {};
    objBO.logic = "GetLabSubCatList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                    });
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
function GetTestBySubCategory() {
    $("#ddlTest").empty().append($("<option></option>").val("0").html("Select"));
    $("#ddlTest").append($("<option></option>").val("ALL").html("ALL"));
    var url = config.baseUrl + "/api/Lab/SampleLabReceivingQueries";
    var objBO = {};
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.SubCatId = $('#ddlCategory option:selected').val();
    objBO.Logic = "GetTestBySubCatId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlTest").append($("<option></option>").val(value.TestCode).html(value.TestName)).select2();
                    });
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
function GetInfoSampleReceive() {
    var url = config.baseUrl + "/api/Lab/SampleLabReceivingQueries";
    var objBO = {};
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.hosp_id = Active.unitId;
    objBO.SubCatId = $("#ddlCategory option:selected").val();
    objBO.TestCode = $("#ddlTest option:selected").val();
    objBO.Logic = "GetInfoForSampleReceive";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblLabDetails tbody').empty();
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td style='display:none'>" + val.AutoTestId + "</td>";
                        tbody += "<td>" + val.visitNo + "</td>";
                        tbody += "<td>" + val.barcodeNo + "</td>";
                        tbody += "<td>" + val.patient_name + "</td>";
                        tbody += "<td style='display:none'>" + val.TestCode + "</td>";
                        tbody += "<td>" + val.testName + "</td>";
                        tbody += "<td>" + val.samp_type + "</td>";
                        tbody += "<td><input type='checkbox'  ></td>";
                        tbody += "</tr>";
                    });
                    $('#tblLabDetails tbody').append(tbody);
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
function GetInfoByParameter() {
    var url = config.baseUrl + "/api/Lab/SampleLabReceivingQueries";
    var objBO = {};
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = $('#txtBarcode').val();
    objBO.Logic = "GetInfoForSampleReceiveByParameter";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblLabDetails tbody').empty();
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td style='display:none'>" + val.AutoTestId + "</td>";
                        tbody += "<td>" + val.visitNo + "</td>";
                        tbody += "<td>" + val.barcodeNo + "</td>";
                        tbody += "<td>" + val.patient_name + "</td>";
                        tbody += "<td style='display:none'>" + val.TestCode + "</td>";
                        tbody += "<td>" + val.testName + "</td>";
                        tbody += "<td>" + val.samp_type + "</td>";
                        tbody += "<td><input type='checkbox'  ></td>";
                        tbody += "</tr>";
                    });
                    $('#tblLabDetails tbody').append(tbody);
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
function LabSampleReceive() {
    if ($('#tblLabDetails tbody tr').length == 0) {
        alert('Please Choose Set...');
        return;
    }
    if ($('#tblLabDetails tbody tr').find('input[type=checkbox]:checked').length == 0) {
        alert('Please select any Set..');
        return;
    }
    if (confirm('Are you sure to Receive Lab....')) {
        var url = config.baseUrl + "/api/Lab/LabSampleReceiveInLab";
        var objBO = [];
        $('#tblLabDetails tbody tr').find('input[type=checkbox]:checked').each(function() {
            objBO.push({
                'AutoTestId': $(this).closest('tr').find('td:eq(1)').text(),
                'VisitNo': $(this).closest('tr').find('td:eq(2)').text(),
                'testcode': $(this).closest('tr').find('td:eq(5)').text(),
                'LabCode': '',
                'DispatchLab': '',
                'DispatchNo': '',
                'BarcodeNo': '',
                'login_id': Active.userId,
                'Logic': 'LabReceived',
            });
        });
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    $('#tblLabDetails tbody').empty();
                    $('input[type=text]').val('');
                    FillCurrentDate('txtFrom');
                    FillCurrentDate('txtTo');
                    alert(data);
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

}