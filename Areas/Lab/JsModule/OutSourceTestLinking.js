$(document).ready(function () {
    searchTable('txtSearch', 'tblTestDetails');
    $('#tblTestDetails thead').on('change', '#ddlSelectName', function () {
        var LabCode = $(this).val();
        $('#tblTestDetails tbody tr').find('select').val(LabCode).change();
       // alert(LabCode);    
    });
    GetCategory();
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
function GetTestByDept() {  
    var url = config.baseUrl + "/api/Lab/LabOutSourceQueries";
    var objBO = {};
    objBO.subcatId = $('#ddlCategory option:selected').val();
    objBO.prm1 = "Y";
    objBO.logic = "GetTestBySubCategory";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#tblTestDetails tbody").empty();
                    var tbody ="";
                    var count = 0;        
                    var option = '';
                    $.each(data.ResultSet.Table, function (key, val) {     
                        option = '';
                        option += "<option selected value='select'>Select</option>";
                        $.each(data.ResultSet.Table1, function (key,val) {                            
                            option += "<option value=" + val.LabCode + ">" + val.LabName+"</option>";
                        });
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.testcode + "</td>";
                        tbody += "<td>" + val.TestName + "</td>";    
                        tbody += "<td><select class='form-control'>"+option+"</select></td>"                            
                        tbody += "</tr>";
                   });
                    $("#tblTestDetails tbody").append(tbody);
                   $("#ddlSelectName").empty().append($("<option></option>").val("0").html("Select"));                   
                    $.each(data.ResultSet.Table1, function (key, val) {                         
                        $("#tblTestDetails thead tr").find($("select").append($("<option></option>").val(val.LabCode).html(val.LabName)));
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
function LinkTestToLab() {
    if (confirm('Are you sure to Link Test To Lab')) {
        var url = config.baseUrl + "/api/Lab/LabSetProcTimeAndPerformingLab";
        var objBO = [];
        $('#tblTestDetails tbody tr').each(function () {
            objBO.push({
                'LabCode': '',
                'ToLabCode': $(this).find('td:eq(3)').find('select option:selected').val(),
                'TestCode': $(this).find('td:eq(1)').text(),
                'SampleCode': '',
                'ProcessingTime': 0,
                'hosp_id': Active.unitId,
                'login_id': Active.userId,
                'Logic': 'LinkTestToLab',
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