$(document).ready(function () { 
    $('#tblTestDetails tbody,#tblTestLinkToLab tbody').on('change', 'input.parent', function () {
        const isCheck = $(this).is(':checked')
        {        
            if (isCheck) {
                $(this).parents('table').find('tbody').find('input:checkbox').prop('checked', true);
            }
            else {
                $(this).parents('table').find('tbody').find('input:checkbox').prop('checked', false);
            }
        }
        const category = $(this).data('category');           
        if (isCheck) {
            $(this).parents('tbody').find('input.' + category + '').prop('checked', true);
          
        }
        else {
            $(this).parents('tbody').find('input.' + category + '').prop('checked', false);
           
        }
        
    });

    $('#tblTestDetails thead,#tblTestLinkToLab thead').on('change', 'input:checkbox', function () {
        const isCheck = $(this).is(':checked');            
        if (isCheck) {
            $(this).parents('table').find('tbody').find('input:checkbox').prop('checked', true);
        }
        else {
            $(this).parents('table').find('tbody').find('input:checkbox').prop('checked', false);
        }
    });
    GetCategory();
    GetLabInfo();    
});



function GetCategory() {
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
                    $("#ddlCategory").append($("<option></option>").val("0").html("Select"));
                    $("#ddlCategory").append($("<option></option>").val("ALL").html("ALL"));
                    $.each(data.ResultSet.Table, function (key, value) {
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
function GetLabInfo() {
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
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#ddlLab").append($("<option></option>").val("0").html("Select"));
                    $.each(data.ResultSet.Table1, function (key, value) {
                        $("#ddlLab").append($("<option></option>").val(value.LabCode).html(value.LabName)).select2();

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
function GetTestInfo() {
    var url = config.baseUrl + "/api/Lab/LabOutSourceQueries";
    var objBO = {};
    objBO.subcatId = $("#ddlCategory option:selected").val();
    objBO.prm1 = "Y";  
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
            var subCatId = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (subCatId != val.SubCatId) {
                            tbody += "<tr class='cat-group'>";             
                         // tbody += "<td colspan='4'>" + val.SubCatName + ' [ ' + val.SubCatId + ' ]' + "<input type='checkbox' data-category=" + val.SubCatId + " class='parent' checked style='float:right;margin: 0px 14px 0px 0px;'/></td>";
                            tbody += "<td colspan='4'>" + val.SubCatName  + "<input type='checkbox'   data-category=" + val.SubCatName + " class='parent'  style='float:right;margin: 0px 14px 0px 0px;'/></td>";
                            tbody += "</tr>";
                            subCatId = val.SubCatId;
                            count = 0;
                        }
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.testcode + "</td>";
                        tbody += "<td>" + val.TestName + "</td>";
                       tbody += "<td><input type='checkbox'   class=" + val.SubCatId + " /></td>";
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
function GetTestByLab() {
    var url = config.baseUrl + "/api/Lab/LabOutSourceQueries";
    var objBO = {};   
    objBO.prm1 = $("#ddlLab option:selected").val();
    objBO.logic = "GetTestByLab";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {          
            $('#tblTestLinkToLab tbody').empty();
            var tbody = '';
            var count = 0;
            var labCode = '';
            var subCatId = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        //if (labCode != val.LabCode) {
                        //    tbody += "<tr class='lab-group'>";
                        //    tbody += "<td colspan='4'>" + val.LabName + ' [ ' + val.LabCode + ' ]' + "</td>";
                        //    tbody += "</tr>";
                        //    labCode = val.LabCode;                          
                        //}
                        if (subCatId != val.SubCatId) {
                            tbody += "<tr class='cat-group'>";
                            tbody += "<td colspan='4'>" + val.SubCatName  + "<input type='checkbox' data-category=" + val.SubCatId + " class='parent'  style='float:right;margin: 0px 14px 0px 0px;'/></td>";
                            tbody += "</tr>";
                            subCatId = val.SubCatId;
                            count = 0;
                        }
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.testcode + "</td>";
                        tbody += "<td>" + val.TestName + "</td>";
                        tbody += "<td><input type='checkbox'  class=" + val.SubCatId + " /></td>";
                        tbody += "</tr>";
                    });
                    $('#tblTestLinkToLab tbody').append(tbody);
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
function GetTestByName() {
    var url = config.baseUrl + "/api/Lab/LabOutSourceQueries";
    var objBO = {};   
    objBO.prm1 = "Y";
    objBO.prm2 = $("#txtTestName").val();
    objBO.logic = "GetTestByName";
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
            var subCatId = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (subCatId != val.SubCatId) {
                            tbody += "<tr class='cat-group'>";
                           //tbody += "<td colspan='4'>" + val.SubCatName + "<input type='checkbox' data-category=" + val.SubCatName + " class='parent' checked style='float:right;margin: 0px 14px 0px 0px;'/></td>";
                            tbody += "<td colspan='4'>" + val.SubCatName + "<input type='checkbox' data-category=" + val.SubCatName + " class='parent' checked style='float:right;margin: 0px 14px 0px 0px;'/></td>";
                            tbody += "</tr>";
                            subCatId = val.SubCatId;
                            count = 0;
                        }
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.testcode + "</td>";
                        tbody += "<td>" + val.TestName + "</td>";
                        tbody += "<td><input type='checkbox'  class=" + val.SubCatId + " /></td>";
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
function LinkTestToLab() {
    if ($('#ddlLab option:selected').text() == 'Select') {
        alert('Please Select Lab..');
        return;
    }
        if (confirm('Are you sure to Link Test To Lab')) {
            var url = config.baseUrl + "/api/Lab/LabSetProcTimeAndPerformingLab";
            var objBO = [];
            $('#tblTestDetails tbody tr:not(.cat-group) input:checkbox:checked').each(function () {
                objBO.push({
                    'LabCode': '',
                    'ToLabCode': $('#ddlLab option:selected').val(),
                    'TestCode': $(this).closest('tr').find('td:eq(1)').text(),
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
                complete: function (c) {
                    GetTestByLab();
                },
                error: function (response) {
                    alert('Server Error...!');
                }
            });
        }
    }



function DeleteTest() {
    if ($('#ddlLab option:selected').text() == 'Select') {
        alert('Please Select Lab..');
        return;
    }
    if (confirm('Are you sure to Delete Test from Lab')) {
        var url = config.baseUrl + "/api/Lab/LabSetProcTimeAndPerformingLab";
        var objBO = [];
        $('#tblTestLinkToLab tbody tr:not(.cat-group) input:checkbox:checked').each(function () {
            objBO.push({
                'LabCode': '',
                'ToLabCode': $('#ddlLab option:selected').val(),
                'TestCode': $(this).closest('tr').find('td:eq(1)').text(),
                'SampleCode': '',
                'ProcessingTime': 0,
                'hosp_id': Active.unitId,
                'login_id': Active.userId,
                'Logic': 'DeleteTestToLab',
            });
        });
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                GetTestByLab();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
