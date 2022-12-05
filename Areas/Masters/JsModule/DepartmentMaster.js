var _AutoId = '';
var _DeptId = '';
$(document).ready(function () {   
    TreatRowSequence();  
    MediaRowSequence();
    DoctorRowSequence();
    $('#tblTreat tbody').on('click', '#btndelete', function () {
        var autoid = $(this).data('autoid');
        DeleteFeatures(autoid);
    });
    $('select').select2();
    $('#btnRefersh').on('click', function () {
        $('#ddlDepartment').prop("disabled", false);
    });
    $('#ddlStatus').on('change', function () {
       var flag=  $('#ddlStatus option:selected').val();
        BindDepartment(flag);
    });
    //$("#ddlDepartment").prop("disabled", false);
    $('#ddlDepartment').on('change', function (){
        $('#ddlDepartment').prop("disabled", true);
        GetDepartmentDetails();
    });
    $('#ddlMediaType').on('change', function() {
        var MediaType = $(this).find('option:selected').text();
        if (MediaType == 'Image') {
            $('#fileAttach').show();
            $('.MediaLink').css('visibility', 'hidden');
        }
        else {
            $('#fileAttach').hide();
            $('.MediaLink').css('visibility', 'visible');
        }
    });
    $('#tblWhatWeTreatList tbody').on('click', '#btndelete',function() {
        var autoid = $(this).data('autoid');
        DeleteFeatures(autoid);
    });
    $('#tblMediaList tbody').on('click', '#btndelete', function () {
        var autoid = $(this).data('autoid');
        DeleteFeatures(autoid);
    });
    BindDepartment('Y');
});
function TreatRowSequence() {
    $("#tblWhatWeTreatList").find('tbody').sortable({
        items: 'tr',
        cursor: 'move',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e,ui) {
            ui.item.removeClass("selected");
            $(this).find("tr").each(function (index) {
                if (index > 0) {
                    $(this).find("td").eq(0).html(index);
                }
            });
        }
    });
}
function MediaRowSequence() {
    $("#tblMediaList").find('tbody').sortable({
        items: 'tr',
        cursor: 'move',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            $(this).find("tr").each(function (index) {
                if (index > 0) {
                    $(this).find("td").eq(0).html(index);
                }
            });
        }
    });
}
function DoctorRowSequence() {
    $("#tblDoctorList").find('tbody').sortable({
        items: 'tr',
        cursor: 'move',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            $(this).find("tr").each(function (index) {
                if (index > 0) {
                    $(this).find("td").eq(0).html(index);
                }
            });
        }
    });
}

function BindDepartment(flag){ 
    var url = config.baseUrl + "/api/Doctors/Web_DepartmentQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.Prm1 = flag; 
    objBO.Logic = "GetDepartmentForMaster";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
           //
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlDepartment").append($("<option></option>").val(value.DeptId).html(value.dept_name));
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDepartmentDetails() {
    $('#tblDoctorList tbody').empty();
    $('#tblWhatWeTreatList tbody').empty();
    $('#tblMediaList tbody').empty();
    $('#Status').empty();
    var url = config.baseUrl + "/api/Doctors/Web_DepartmentQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.DeptName = $('#ddlDepartment option:selected').text();
    objBO.DeptId = $('#ddlDepartment option:selected').val();
    objBO.Logic = "GetDepartmentAndDetails";
    $.ajax({
        method:"POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            var Active = "";          
            if (Object.keys(data.ResultSet.Table).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {                    
                    Active = '<label class="switch">' +
                        '<input type="checkbox" onchange="UpdateStatus()" class="IsActive" id="chkActive" ' + val.checked + '>' +
                        '<span class="slider round"></span>' +
                        '</label >';                                                                 

                    $('#txtDepartmentShortName').val(val.DepartmentName);
                     CKEDITOR.instances['txtAbout'].setData(val.about_department);
                    $('#btnDept').text('Update');
                });
                $('#Status').append(Active);

                $.each(data.ResultSet.Table3, function (key, val) {
                    tbody += '<tr>';
                    tbody += '<td>' + val.DeptDocSeqNo + '</td>';
                    tbody += '<td style="display:none">' + val.autoId + '</td>';
                   // tbody += '<td><input style="width:100%" type="text" value="' + val.DeptDocSeqNo + '"/></td>';
                    tbody += '<td>' + val.Doctor_Name + '</td>';
                    tbody += '<td>' + val.Designation + '</td>';
                    tbody += '</tr>';
                });
                $('#tblDoctorList tbody').append(tbody);              

                var tbodyMedia = '';
                var tbodyTreat = '';
                $.each(data.ResultSet.Table1, function (key, val) {
                    if (val.TagName == 'WHATWETREAT') {
                        tbodyTreat += '<tr>';
                        tbodyTreat += '<td>' + val.SeqNo + '</td>';
                        tbodyTreat += '<td>' + val.MediaLink + '</td>';
                        tbodyTreat += "<td><button class='btn-danger btn-tbl' id='btndelete' data-autoid=" + val.autoid + "><span class='fa fa-remove'><button class='btn-success  btn-tbl' onclick=AddHeadingDesc('" + val.autoid + "','" + val.DeptId + "')><span class='fa fa-plus'></button></td >";
                        tbodyTreat += '</tr>';
                    }
                    if (val.TagName == 'MEDIA') {
                        tbodyMedia += '<tr>';
                        tbodyMedia += '<td>' + val.SeqNo + '</td>';
                        if (val.MediaType == "Image") {
                            tbodyMedia += '<td>' + '<img src=' + val.MediaLink + 'alt="image" height=80 width=150></img>' + '</td>';
                        }
                        else {
                            tbodyMedia += '<td>' + '<iframe style="width:150px;height:80px" src='+ val.MediaLink + '></iframe>' + '</td>';
                        }
                        tbodyMedia += '<td>' + val.TagDescription + '</td>';
                        tbodyMedia += "<td><button class='btn-danger btn-tbl' id='btndelete'  data-autoid=" + val.autoid + "><span class='fa fa-remove'></button></td >";
                        tbodyMedia += '</tr>';
                    }
                });
                $('#tblWhatWeTreatList tbody').append(tbodyTreat);
                $('#tblMediaList tbody').append(tbodyMedia);
              
            }
        }
    })
}
function DeleteFeatures(autoid) {
    if (confirm('Are you Sure To delete this Record?')) {
        var url = config.baseUrl + "/api/Doctors/InsertDepartmentFeatures";
        var objBO = {};
        objBO.autoid = autoid;
        objBO.Logic = "DeleteFeatures";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                GetDepartmentDetails();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function UpdateDoctorSequenceByDepartment() {
    var AutoSeq = [];
    //A1:S1|A2:S2|A3:S3
    //$('#tblDoctorList tbody tr').each(function () {
    //    var auto_id = $(this).find('td:eq(0)').text();
    //    var SeqNo = $(this).find('td:eq(1)').find('input:text').val();
    //    AutoSeq.push(
    //        '' + $(this).find('td:eq(0)').text() + ':' + $(this).find('td:eq(1)').find('input:text').val() + ''
    //    );
    //});

    $('#tblDoctorList tbody tr').each(function () {
        var auto_id = $(this).find('td:eq(1)').text();
        var SeqNo = $(this).index() + 1;
        AutoSeq.push(
            '' + auto_id + ':' + SeqNo + ''
      );
    });


    var url = config.baseUrl + "/api/Doctors/InsertDepartmentFeatures";
    var objBO = {};
    objBO.Prm1 = AutoSeq.join('|');
    objBO.Logic = "DoctorSequence";
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
function UpdateStatus() {    
    var url = config.baseUrl + "/api/Doctors/InsertDepartmentFeatures";
    var objBO = {};
    objBO.DeptId = $('#ddlDepartment option:selected').val();
    objBO.Logic = "UpdateStatus";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            //if (data.includes('success'))                     
        },
        error: function (response) {
            alert('Server Error....!');
        }
    });
}
function AddFeatures() {
    var url = config.baseUrl + "/api/Doctors/InsertDepartmentFeatures";
    var objBO = {};
    objBO.autoid = 0;
    objBO.MediaType = $('#ddlMediaType option:selected').text();
    objBO.DeptId = $('#ddlDepartment option:selected').val();
    objBO.TagName = 'WHATWETREAT';
    objBO.fileUpload = '-';
    objBO.Description = '-';
    objBO.MediaLink = $('#txtHeading').val();
    objBO.PhyPath = '-';
    objBO.MediaType = '-';
    objBO.LinkName = '-';
    objBO.Logic = "InsertFeatures";
    $.ajax({
        method:"POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {     
            if (data.includes('Success')) {
                alert(data)
                GetDepartmentDetails();
            }
            else {
                alert(data)
            }
               
        }
    });
}
function AddMedia() {
    var url = config.baseUrl + "/api/Doctors/InsertDeptFeatures";
    var objBO = {};
    objBO.AutoId = 0;
    objBO.MediaType = $('#ddlMediaType option:selected').text();
    objBO.DeptId = $('#ddlDepartment option:selected').val();
    objBO.TagName = 'MEDIA';
    objBO.fileUpload = '-';
    objBO.Description = CKEDITOR.instances['txtMediaTagDesc'].getData();
    objBO.MediaLink = $('#txtMediaLink').val();
    objBO.PhyPath = '-';
    objBO.LinkName = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "InsertFeatures";
    var UploadDocumentInfo = new XMLHttpRequest();
    var data = new FormData();
    data.append('obj', JSON.stringify(objBO));
    data.append('imageByte', $('input[name=MediafileUpload]')[0].files[0]);
    UploadDocumentInfo.onreadystatechange = function () {
        if (UploadDocumentInfo.status) {
            if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
                var json = JSON.parse(UploadDocumentInfo.responseText);
                if (json.Message.includes('success')) {
                    clear();
                    alert(json.Message);
                    GetDepartmentDetails();
                }
                else {
                    alert(json.Message);
                    GetDepartmentDetails();
                }
            }
        }
    }
    UploadDocumentInfo.open('POST', url, true);
    UploadDocumentInfo.send(data); 
}
function AddDepartment() {
    var url = config.baseUrl + "/api/Doctors/InsertDepartmentFeatures";
    var objBO = {};
    objBO.DeptId = $('#ddlDepartment option:selected').val();
    objBO.DeptName = $('#txtDepartmentName').val();
    objBO.DeptShortName = $('#txtDepartmentShortName').val();
    objBO.Description = CKEDITOR.instances['txtAbout'].getData();
    objBO.Logic = ($('#btnDept').text() == "Add") ? "InsertDepartment" : "UpdateDepartment";
    $.ajax({
        method:"POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('success')) {
                alert(data)
            }
            else
                alert(data)
        },
        error: function (response) {
            alert('Server Error.....!');
        }
    });
}
function SetWhatWeTreatSeq() {            
    //[{autoid:401,seqNo:1},{autoid:402,seqNo:2},{autoid:403,seqNo:3}] JSON format    
    var url = config.baseUrl + "/api/Doctors/InsertDepartmentFeatures";
    var SeqInfo =[];
    $('#tblWhatWeTreatList tbody tr').each(function () {
        var auto_id = $(this).find('td:eq(2)').find('#btndelete').data('autoid');
        var SeqNo = $(this).index() + 1;
        SeqInfo.push({
            'AutoId': auto_id,
            'SeqNo': SeqNo       
        });
    });
    var objBO = {};
    objBO.Description = JSON.stringify(SeqInfo);
    objBO.Logic = "SetSeqNo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success'))
                alert(data)
            else
                alert(data)
        },
        error: function (response) {
            alert('Server Error.....!');
        }
    });
}
function SetMediaSeq(){
    //[{autoid:401,seqNo:1},{autoid:402,seqNo:2},{autoid:403,seqNo:3}] JSON Format    
    var url = config.baseUrl + "/api/Doctors/InsertDepartmentFeatures";
    var SeqInfo = [];
    $('#tblMediaList tbody tr').each(function (){
        var auto_id = $(this).find('td:eq(3)').find('#btndelete').data('autoid');
        var SeqNo = $(this).index() + 1;
        SeqInfo.push({
            'AutoId': auto_id,
            'SeqNo': SeqNo
        });
    });
    var objBO = {};
    objBO.Description = JSON.stringify(SeqInfo);
    objBO.Logic = "SetSeqNo";
    $.ajax({
        method:"POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data)
                GetDepartmentDetails();
            }               
            else
                alert(data)
        },
        error: function (response) {
            alert('Server Error.....!');
        }
    });
}
function DeleteWhatweTreatDetail(autoid) {
    if (confirm('Are you Sure To delete this Record?')) {
        var url = config.baseUrl + "/api/Doctors/InsertDepartmentFeatures";
        var objBO = {};
        objBO.autoid = autoid;
        objBO.Logic = "DeleteWhatWeTreatDetail";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                AddHeadingDesc(_AutoId,_DeptId);              
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function AddHeadingDesc(linkId,DeptId) {
    _AutoId = linkId;
    _DeptId = DeptId;
    $('#tblTreat tbody').empty();
    var url = config.baseUrl + "/api/Doctors/Web_DepartmentQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.DeptId = DeptId;
    objBO.Prm1 = linkId;
    objBO.login_id = Active.userId;   
    objBO.Logic = "GetHeadAndTreatDesc";
    $.ajax({
        method:"POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {           
            var tbodyMedia = '';     
            if (Object.keys(data.ResultSet.Table).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#txtDepartment').val(val.dept_name);
                    $('#txtDeptHeading').val(val.MediaLink);                   
                });
                $.each(data.ResultSet.Table1, function (key, val) {
                    tbodyMedia += '<tr>';
                    tbodyMedia += "<td><button class='btn-danger btn-tbl' id='btndelete' onclick=DeleteWhatweTreatDetail('" + val.autoId+"')  data-autoid=" + val.autoId + "><span class='fa fa-remove'></button></td >";
                    tbodyMedia += '<td>' + val.Description + '</td>';
                    tbodyMedia += '</tr>';
                });
                $('#tblTreat tbody').append(tbodyMedia);              
            }            
        },
        complete: function () {         
            $('#modalDepartmentInfo').modal('show');
        }
    })
}
function UpdateHeading() {
    var url = config.baseUrl + "/api/Doctors/InsertDepartmentFeatures";
    var objBO = {};
    objBO.AutoId = _AutoId;
    objBO.DeptShortName = $('#txtDeptHeading').val();
    objBO.Logic ="UpdateDepartmentHeading";
    $.ajax({
        method:"POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {        
            if (data.includes('success')) {
                alert(data)
            }
            else
                alert(data)
        },
        error: function (response) {
            alert('Server Error.....!');
        }
    });

}
function AddWhatWeTreatDetail() {
    var url = config.baseUrl + "/api/Doctors/InsertTreatDoc";
    var objBO = {};
    objBO.autoid = _AutoId;
    objBO.DeptId = _DeptId;
    objBO.ImgPostion = $('#ddlPostion option:selected').text();
    objBO.Description = CKEDITOR.instances['txtAbout1'].getData();
    objBO.IsActive = 'Y';
    objBO.ImgPath = '-';   
    objBO.login_id = Active.userId;
    objBO.fileUpload = '-';
    objBO.Logic = "InsertWhatWeTreatDetails";
    var UploadDocumentInfo = new XMLHttpRequest();
    var data = new FormData();
    data.append('obj', JSON.stringify(objBO));
    data.append('imageByte', $('input[name=fileUpload]')[0].files[0]
    );
    UploadDocumentInfo.onreadystatechange = function () {
        if (UploadDocumentInfo.status) {
            if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
                var json = JSON.parse(UploadDocumentInfo.responseText);
                if (json.Message.includes('Success')) {
                    alert(json.Message);
                    AddHeadingDesc(_AutoId, _DeptId);                                             
                }
                else {
                    alert(json.Message);                       
                }
            }
        }
    }
    UploadDocumentInfo.open('POST', url, true);
    UploadDocumentInfo.send(data);   
}

