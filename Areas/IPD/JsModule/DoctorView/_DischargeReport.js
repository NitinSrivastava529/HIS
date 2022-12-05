var _AutoId;
var _TemplateId=null;
$(document).ready(function () {
    $('#ddlTemplates').empty().append($('<option></option>').val('Select').html('Select')).select2();
    HeaderList('Y');
    TemplateList('Y');
    DischargeSummary();
    $('#dash-dynamic-section').find('label.title').text('Patient Discharge').show();
    $('select').select2();
    CKEDITOR.replace('txtTemplate', {
        enterMode: CKEDITOR.ENTER_BR,
        shiftEnterMode: CKEDITOR.ENTER_P,
    });
    $('#tblHeaderMaster tbody').on('click', 'button', function () {
        selectRow($(this));
        var AutoId = $(this).closest('tr').find('td:eq(1)').text();
        var HeaderName = $(this).closest('tr').find('td:eq(2)').text();
        _AutoId = AutoId;
        $('#txtHeaderName').val(HeaderName);
        $('#btnSaveHeaderMaster i').removeClass('fa-plus-circle').addClass('fa-edit');
    });
    $('#tblTemplateMaster tbody').on('click', 'button', function () {
        selectRow($(this));
        var AutoId = $(this).closest('tr').find('td:eq(1)').text();
        var HeaderId = $(this).closest('tr').find('td:eq(2)').text();
        var TemplateName = $(this).closest('tr').find('td:eq(3)').text();
        _AutoId = AutoId;
        $('#txtTemplateName').val(TemplateName);
        $('#ddlHeaderMaster').val(HeaderId).change();
        $('#btnSaveTemplateMaster i').removeClass('fa-plus-circle').addClass('fa-edit');
    });
    $('#tblDischargeSummary tbody').on('click', 'button.edit', function () {
        selectRow($(this));
        var HeaderId = $(this).closest('tr').find('td:eq(1)').text();    
        var TemplateId = $(this).closest('tr').find('td:eq(2)').text();    
        $('#ddlHeader').val(HeaderId).change();
        _TemplateId = TemplateId;        
        var TemplateContent = $(this).closest('tr').find('td:eq(3)').html();        
        CKEDITOR.instances['txtTemplate'].setData(TemplateContent);           
    });
});

function HeaderList(prm) {
    $('#tblHeaderMaster tbody').empty();
    var url = config.baseUrl + "/api/IPDDoctor/IPD_DoctorQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = prm;
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'HeaderList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = '';
                    var count = 0;
                    var temp = "";
                    $('#ddlHeader').empty().append($('<option></option>').val('Select').html('Select')).select2();
                    $('#ddlHeaderMaster').empty().append($('<option></option>').val('Select').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (val.IsActive == 'Y') {
                            $('#ddlHeader').append($('<option></option>').val(val.HeaderId).html(val.HeaderName));
                            $('#ddlHeaderMaster').append($('<option></option>').val(val.HeaderId).html(val.HeaderName));
                        }
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td class='hide'>" + val.AutoId + "</td>";
                        tbody += "<td>" + val.HeaderName + "</td>";
                        tbody += "<td>" + val.cr_date + "</td>";
                        tbody += "<td><button class='btn btn-warning btn-xs'><i class='fa fa-edit'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblHeaderMaster tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function TemplateList(prm) {
    $('#tblTemplateMaster tbody').empty();
    var url = config.baseUrl + "/api/IPDDoctor/IPD_DoctorQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = prm;
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'TemplateList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = '';
                    var count = 0;
                    var temp = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.HeaderName) {
                            tbody += "<tr class='bg-warning'>";
                            tbody += "<td colspan='4'><b>" + val.HeaderName + "</b></td>";
                            tbody += "</tr>";
                            temp = val.HeaderName;
                        }
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td class='hide'>" + val.AutoId + "</td>";
                        tbody += "<td class='hide'>" + val.HeaderId + "</td>";
                        tbody += "<td>" + val.TemplateName + "</td>";
                        tbody += "<td>" + val.cr_date + "</td>";
                        tbody += "<td><button class='btn btn-warning btn-xs'><i class='fa fa-edit'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblTemplateMaster tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetTemplateListByHeader() {
    var url = config.baseUrl + "/api/IPDDoctor/IPD_DoctorQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#ddlHeader option:selected').val();
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'TemplateListByHeader';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $('#ddlTemplates').empty().append($('<option></option>').val('Select').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlTemplates').append($('<option></option>').val(val.TemplateId).html(val.TemplateName));
                    });
                }
            }
        },
        complete: function () {            
            if (_TemplateId != null)                
                $('#ddlTemplates').val(_TemplateId).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DischargeSummaryByTemplateId() {
    CKEDITOR.instances['txtTemplate'].setData('');
    var url = config.baseUrl + "/api/IPDDoctor/IPD_DoctorQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#ddlTemplates option:selected').val();
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'DischargeSummaryByTemplateId';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {                   
                    $.each(data.ResultSet.Table, function (key, val) {
                        CKEDITOR.instances['txtTemplate'].setData(val.template_content);
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertUpdateHeader() {
    var url = config.baseUrl + "/api/IPDDoctor/InsertDischargeTemplate";
    var objBO = {};
    objBO.AutoId = _AutoId;
    objBO.UHID = '-';
    objBO.IPDNo = _IPDNo;
    objBO.HeaderId = '-';
    objBO.HeaderName = $('#txtHeaderName').val();
    objBO.TemplateId = '-';
    objBO.TemplateName = '-';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = ($('#btnSaveHeaderMaster i').is('.fa-plus-circle') == true) ? "InsertHeader" : 'UpdateHeader';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                HeaderList('Y');
                Clear();
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
function InsertUpdateTemplate() {
    var url = config.baseUrl + "/api/IPDDoctor/InsertDischargeTemplate";
    var objBO = {};
    objBO.AutoId = _AutoId;
    objBO.UHID = '-';
    objBO.IPDNo = _IPDNo;
    objBO.HeaderId = $('#ddlHeaderMaster option:selected').val();
    objBO.HeaderName = '-',
        objBO.TemplateId = '-';
    objBO.TemplateName = $('#txtTemplateName').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = ($('#btnSaveTemplateMaster i').is('.fa-plus-circle') == true) ? "InsertTemplate" : 'UpdateTemplate';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                TemplateList('Y');
                Clear();
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
function InsertDischargeSummary(logic) {
    var url = config.baseUrl + "/api/IPDDoctor/IPD_InsertDischargeReportInfo";
    var objBO = {};
    objBO.IPDNo = _IPDNo;
    objBO.TemplateId = $('#ddlTemplates option:selected').val();
    objBO.TemplateName = $('#ddlTemplates option:selected').text();
    objBO.TemplateContent = CKEDITOR.instances['txtTemplate'].getData();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                DischargeSummary();                
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
function DischargeSummary() {
    $('#tblDischargeSummary tbody').empty();
    var url = config.baseUrl + "/api/IPDDoctor/IPD_DoctorQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'DischargeSummary';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = '';
                    var count = 0;
                    var temp = "";                   
                    $.each(data.ResultSet.Table, function (key, val) {                       
                        count++;
                        if (temp != val.HeaderName) {
                            tbody += "<tr class='bg-warning'>";
                            tbody += "<td colspan='4'><b>" + val.HeaderName + "</b></td>";
                            tbody += "</tr>";
                            temp = val.HeaderName;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td class='hide'>" + val.HeaderId + "</td>";
                        tbody += "<td class='hide'>" + val.TemplateId + "</td>";
                        tbody += "<td>" + val.template_content + "</td>";
                        tbody += "<td>" + val.cr_date + "</td>";
                        tbody += "<td><button class='btn btn-warning btn-xs edit'><i class='fa fa-edit'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblDischargeSummary tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Clear() {
    $('#txtHeaderName').val('');
    $('#txtTemplateName').val('');
    _AutoId = 0;
    $('#btnSaveHeaderMaster i').removeClass('fa-edit').addClass('fa-plus-circle');
    $('#btnSaveTemplateMaster i').removeClass('fa-edit').addClass('fa-plus-circle');
}