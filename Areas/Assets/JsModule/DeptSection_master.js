$(document).ready(function () {
    AssetsQueries('GetDeptAndSection', '', '');
    $('#btnSaveDept').on('click', function () {
        if (ValidateDept()) {
            InsertModifyAssets('InsertDept', '');
        }       
    });
    $('#btnSaveSection').on('click', function () {
        var DeptCode = $('#ddlDept option:selected').val();
        if (ValidateSec()) {
            InsertModifyAssets('InsertSection', DeptCode, '');
        }       
    });
    $('#btnUpdateDept').on('click', function () {
        var DeptCode = $(this).data('deptcode');
        if (ValidateDept()) {
            InsertModifyAssets('UpdateDept', DeptCode, '');
        }
    });
    $('#btnUpdateSection').on('click', function () {
        
        var SectCode = $(this).data('sectcode');
        var DeptCode = $('#ddlDept option:selected').val();
        if (ValidateSec()) {
            InsertModifyAssets('UpdateSection', DeptCode, SectCode);
        }
    });
    $('#tblDept tbody').on('click', '.edit', function () {
        var DeptCode = $(this).data('deptcode');
        AssetsQueries('GetDeptByDeptCode', DeptCode, '');
    });
    $('#tblSection tbody').on('click', '.edit', function () {
        var SectCode = $(this).data('sectcode');
        AssetsQueries('GetSectionBySecCode', '', SectCode);
    });
    $('#tblDept tbody').on('click', '.delete', function () {
        var DeptCode = $(this).data('deptcode');
        if (confirm('Are You Sure Want to Delete this Record..!')) {
            InsertModifyAssets('DeleteDept', DeptCode, '');
        }
    });
    $('#tblSection tbody').on('click', '.delete', function () {
        var SectCode = $(this).data('sectcode');
        if (confirm('Are You Sure Want to Delete this Record..!')) {
            InsertModifyAssets('DeleteSection', '', SectCode);
        }
    });
    $('#btnGetDeptHead').on('click', function () {
        var empName = $('#txtEmpName').val();
        GetDeptHeadDetails(empName);
    });
    $('#txtSearchDept').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblDept tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('#txtSearchSec').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblSection tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
});

function AssetsQueries(logic, DeptCode, SectCode) {

    var url = config.baseUrl + "/api/Asset/AssetsQueries";
    var objBO = {};
    objBO.unit_id = Active.unitId;
    objBO.DeptCode = DeptCode;
    objBO.DeptName = $('#txtDeptName').val();
    objBO.DeptHead = $('#ddlDeptHead option:selected').val();
    objBO.SectionCode = SectCode;
    objBO.SectionName = $('#txtSectionName').val();
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.Msg = 'Success') {
                if (logic == 'GetDeptAndSection') {
                    $('#btnSaveDept').show();
                    $('#btnUpdateDept').hide().data('deptcode', '');
                    $('#btnSaveSection').show();
                    $('#btnUpdateSection').data('sectcode','').hide();
                    $('#tblDept tbody').empty();                   
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('<tr><td>' + val.DeptCode + '</td><td>' + val.DeptName + '</td><td>' + val.DeptHeadName + '</td><td>' + val.cr_date + '</td><td>' +
                            '<div class="input-group-btn">' +
                            '<span type = "button" data-deptcode=' + val.DeptCode + ' class= "btn btn-danger delete" > <i class="fa fa-trash"></i></span> ' +
                            '<span type="button" data-deptcode=' + val.DeptCode + ' class="btn btn-warning edit"><i class="fa fa-edit"></i></span>' +
                            '</td></div></tr>').appendTo($('#tblDept tbody'));
                        $('#ddlDept').append($('<option value="' + val.DeptCode + '"></option>').val(val.DeptCode).html(val.DeptName));
                    });

                    $('#tblSection tbody').empty();
                    $.each(data.ResultSet.Table1, function (key, val) {

                        $('<tr><td>' + val.DeptName + '</td><td>' + val.SectionName + '</td><td>' + val.cr_date + '</td><td>' +
                            '<div class="input-group-btn">' +
                            '<span type="button" data-sectcode=' + val.SectionCode + ' class="btn btn-danger delete"><i class="fa fa-trash"></i></span>' +
                            '<span type="button" data-sectcode=' + val.SectionCode + ' class="btn btn-warning edit"><i class="fa fa-edit"></i></span>' +
                            '</td></tr>').appendTo($('#tblSection tbody'));
                    });
                }
                else if (logic == 'GetDeptByDeptCode') {
                    $.each(data.ResultSet.Table, function (key, val) {
                        
                        $('#btnSaveDept').hide();
                        $('#btnUpdateDept').show();
                        $('#txtDeptName').val(val.DeptName);
                        $('#txtEmpName').val(val.DeptHeadName);
                        $('#btnGetDeptHead').trigger('click');
                        $('#btnUpdateDept').data('deptcode', val.DeptCode);
                        $('#ddlDeptHead option').map(function () {
                            $(this).removeAttr('Selected');
                            if ($(this).val() == val.DeptHead) return this;
                        }).attr('Selected', 'Selected');
                    });
                }
                else if (logic == 'GetSectionBySecCode') {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#btnSaveSection').hide();
                        $('#btnUpdateSection').show();
                        $('#txtSectionName').val(val.SectionName);
                        $("#btnUpdateSection").data('sectcode', val.SectionCode);
                        $('#ddlDept option').map(function () {
                            $(this).removeAttr('Selected');
                            if ($(this).val() == val.DeptCode) return this;
                        }).attr('Selected', 'Selected');

                    });
                }
            }
            else {
                alert(data.Msg);
            }
        },
        error: function (response) {
            alert(data.Msg);
        }
    });
}
function InsertModifyAssets(logic, DeptCode, SectCode) {
    
    var url = config.baseUrl + "/api/Asset/InsertModifyAssets";
    var objBO = {};
    objBO.unit_id = Active.unitId;
    objBO.DeptCode = DeptCode;
    objBO.DeptName = $('#txtDeptName').val();
    objBO.DeptHead = $('#ddlDeptHead option:selected').val();
    objBO.SectionCode = SectCode;
    objBO.SectionName = $('#txtSectionName').val();
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {

            if (data == 'Success') {
                $('#txtDeptName').val('');
                $('#txtSectionName').val('');
                //$('#ddlDept')[0].SelectedIndex=0;
                $('#ddlDeptHead').empty().append('<option>Select Employee</option>');
                AssetsQueries('GetDeptAndSection', '', '');
            }
            else {
                alert(data)
            }
        },
        error: function (response) {
            alert(data);
        }
    });
}
function GetDeptHeadDetails(empName) {

    var url = config.baseUrl + "/api/ApplicationResource/MenuQueries";
    var objBO = {};
    objBO.Prm1 = empName,
        objBO.Logic = 'GetEmployee'
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                $('#ddlDeptHead').empty().append($('<option>Select Employee</option>'));
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#txtEmpName').val('');
                    $('#ddlDeptHead').append($('<option></option>').val(val.emp_code).html(val.emp_name));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ValidateDept() {
    var DeptHead = $('#ddlDeptHead option:selected').text();
    var Dept = $('#txtDeptName').val();

    if (DeptHead == 'Select Employee') {
        $('#ddlDeptHead').css('border-color', 'red');
        return false;
    }
    else {
        $('#ddlDeptHead').removeAttr('style');
    }
    if (Dept == '') {
        $('#txtDeptName').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtDeptName').removeAttr('style');
    }
    return true;
}
function ValidateSec() {
    var Dept = $('#ddlDept option:selected').text();
    var Sec = $('#txtSectionName').val();

    if (Dept == 'Select Department') {
        $('#ddlDept').css('border-color', 'red');
        return false;
    }
    else {
        $('#ddlDept').removeAttr('style');
    }
    if (Sec == '') {
        $('#txtSectionName').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtSectionName').removeAttr('style');
    }
    return true;
}