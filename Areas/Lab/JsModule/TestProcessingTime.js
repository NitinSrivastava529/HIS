$(document).ready(function () {
    GetCategory();
    //$('#tblTestDetails thead').on('change','input[type=number]', function () {
    //    var time = $(this).val();
    //    $('#tblTestDetails tbody').find('input[type=number]').val(time);
    //});
});

function GetCategory() {
    var url = config.baseUrl + "/api/Lab/mInvestigationQueries";
    var objBO = {};
    objBO.Logic = "OnLoad";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#ddlCategory").append($("<option></option>").val("0").html("Please Select"));
                    $("#ddlCategory").append($("<option></option>").val("ALL").html("ALL"));
                    $.each(data.ResultSet.Table1, function (key, value) {
                        $("#ddlCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName)).select2();
                       
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

function GetTestBySubCategory()
{
    var url = config.baseUrl + "/api/Lab/LabOutSourceQueries";
    var objBO = {};
    objBO.subcatId = $("#ddlCategory option:selected").val();
    objBO.prm1 = ($("#ddlStatus option:selected").text() == 'Active') ? 'Y' : 'N';
    objBO.logic = "GetTestBySubCategory";  
       $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
           success: function (data) {
           
            $('#tblTestDetails tbody').empty();
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count+ "</td>";
                        tbody += "<td>" + val.testcode + "</td>";
                        tbody += "<td>" + val.TestName + "</td>";
                        tbody += "<td>" + val.sample_name + "</td>";
                        tbody += "<td  class='text-right'>" + val.max_time + "</td>";                        
                        tbody += "</tr>";
                    });
                    $('#tblTestDetails tbody').append(tbody);
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

function UpdateProcessingLab() {
    if (confirm('Are you sure to Insert Processing Time')) {
        var url = config.baseUrl + "/api/Lab/LabSetProcTimeAndPerformingLab";
        var objBO = [];
        $('#tblTestDetails tbody tr').each(function () {
            objBO.push({               
                'LabCode': '',           
                'ToLabCode':'',
                'TestCode': $(this).find('td:eq(1)').text(),
                'SampleCode':'',
                'ProcessingTime': $(this).find('td:eq(4)').text(),
                'hosp_id': Active.unitId,
                'login_id': Active.userId,
                'Logic': 'UpdateProcessingLab',
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