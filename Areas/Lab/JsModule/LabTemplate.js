$(document).ready(function () {
    CloseSidebar();
    Onload();
    $("#ddlTemplateList").on('change', function () {
        CKEDITOR.instances['txtTemplate'].setData();
    });
});

function Onload() {
    var url = config.baseUrl + "/api/Lab/mLabTemplateQueries";
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
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlTestSubCategory").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlTestSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                    });
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
function SearchBySubCategory() {
    $("#tblTestDetails tbody").empty();
    var htmldata = "";
    var url = config.baseUrl + "/api/Lab/mInvestigationQueries";
    var objBO = {};
    objBO.Logic = "GetTestBySubCategory";
    objBO.subcateid = $("#ddlTestSubCategory option:selected").val();
    objBO.prm_1 = $("#ddlStatus option:selected").val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        htmldata += '<tr>';
                        htmldata += '<td>' + val.TestName + '</td>';
                        htmldata += '<td><a href="javascript:void(0)" id="btnShowTemplate' + key + '" data-testcode="' + val.testcode + '" onclick=selectRow(this);BindTemplateList("' + val.testcode + '")><i class="fa fa-arrow-circle-o-right fa-lg text-green"></i></a>';
                        htmldata += '</tr>';
                    });
                    $("#tblTestDetails").append(htmldata);
                }
                else {
                    htmldata += '<tr>';
                    htmldata += '<td colspan="3" class="text-center text-red">No Data Found</td>';
                    htmldata += '</tr>';
                    $("#tblTestDetails").append(htmldata);
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
function AddTemplate() {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mLabTemplateInsertUpdate";
    var testcode = $("#tblTestDetails tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    var templatename = $("#txtTemplateName").val();

    if (testcode == "" || testcode == null || typeof testcode == 'undefined') {
        alert('Please select test name from left');
        return false;
    }
    if (templatename == "") {
        alert('Please enter template name');
        return false;
    }
    objBO.templatename = templatename;
    objBO.testcode = testcode;
    objBO.login_id = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.Logic = "Insert";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                alert('Template created successfully');
                BindTemplateList("");
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
function BindTemplateList(testcode) {
    
    var url = config.baseUrl + "/api/Lab/mLabTemplateQueries";
    var objBO = {};
    objBO.Logic = "LoadTemplate";
    if (testcode != "") {
        objBO.testcode = testcode;
    }
    else {
        objBO.testcode = null;
    }
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlTemplateList").empty();
                    $("#ddlTemplateList").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlTemplateList").append($("<option></option>").val(value.template_name).html(value.template_name));
                    });
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
function AddTemplateContent() {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mLabTemplateInsertUpdate";
    var testcode = $("#tblTestDetails tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    var templatename = $("#ddlTemplateList option:selected").val();
    var templatecontent = CKEDITOR.instances['txtTemplate'].getData();
    if (testcode == "" || testcode == null || typeof testcode == 'undefined') {
        alert('Please select test name from left');
        return false;
    }
    if (templatename == "0") {
        alert('Please select template');
        return false;
    }
    if (templatecontent == "" || templatecontent == null || typeof templatecontent == 'undefined') {
        alert('Please enter template content');
        return false;
    }
    objBO.templatename = templatename;
    objBO.testcode = testcode;
    objBO.templatecontent = templatecontent;
    objBO.login_id = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.Logic = "Update";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                CKEDITOR.instances['txtTemplate'].setData('');
                alert('Template content created successfully');
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

function ViewTemplateContent() {
    var url = config.baseUrl + "/api/Lab/mLabTemplateQueries";
    var objBO = {};
    var testcode = $("#tblTestDetails tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    var templatename = $("#ddlTemplateList option:selected").val();
    if (testcode == "" || testcode == null || typeof testcode == 'undefined') {
        alert('Please select test name from left');
        return false;
    }
    if (templatename == "0") {
        alert('Please select template');
        return false;
    }
    objBO.Logic = "ViewTemplateContent";
    objBO.prm_1 = templatename;
    objBO.testcode = testcode;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    //CKEDITOR.instances['txtTemplate'].setData('');
                    CKEDITOR.instances['txtTemplate'].setData(data.ResultSet.Table[0].template_content);
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