$(document).ready(function () {
    AssetListToTransfer('AssetListToTransfer');
    $('#btnMoveList').on('click', function () {
        AssetListToTransfer('AssetListToTransfer');
    });
    $('#btnRecList').on('click', function () {
        AssetListToTransfer('AssetListToReceive');
    });
    $('#btnMove').on('click', function () {
        Hospital_AssetMovement('Move');
    });
    $('#btnReceive').on('click', function () {
        Hospital_AssetMovement('Receive');
        AssetListToTransfer('AssetListToReceive');
    });
    $('#btnCancel').on('click', function () {
        Hospital_AssetMovement('Cancel');
        $("#transferBlock").show();
    });
    $('#btnDownloadMovementReport').on('click', function () {
        GetStock("MovementReport", "Excel");
    });
});
function AssetListByNo() {
   
    var url = config.baseUrl + "/api/Asset/Hosp_AssetMovementQueries";
    var objBO = {};
    objBO.unit_id = Active.unitId;
    objBO.eq_no = $("#myInput").val();;
    objBO.DeptId = "-";
    objBO.from = "1900/01/01";
    objBO.to = "1900/01/01";
    objBO.prm_1 = "-"
    objBO.login_id = Active.userId;
    objBO.Logic = 'AssetListByCode';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#tblAssetList tbody').empty();
            if (data != '') {
                var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td style="width:8%;text-align:center"><button id=' + val.eq_no + ' class="btn" onclick=AssetDetail(this.id)><i class="fa fa-home"></i></button></td><td style="width:30%;text-align:left">' + val.eq_no + '</td><td style="width:62%;text-align:left">' + val.eq_name + '</td></tr>').appendTo($('#tblAssetList tbody'));
                });

                $('#ddlDept').empty().append($('<option value="Select Department" >Select Department</option>'));
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('#ddlDept').append($('<option></option>').val(val.DeptCode).html(val.DeptName));
                });

            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SectionList() {
    
    var url = config.baseUrl + "/api/Asset/Hosp_AssetMovementQueries";
    var objBO = {};
    objBO.unit_id = Active.unitId;
    objBO.eq_no = $("#myInput").val();;
    objBO.DeptId = $("#ddlDept").val();
    objBO.from = "1900/01/01";
    objBO.to = "1900/01/01";
    objBO.prm_1 = "-"
    objBO.login_id = Active.userId;
    objBO.Logic = 'SectionList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                var temp = "";
                $('#ddlTransferTo').empty().append($('<option value="Select Section" >Select Section</option>'));
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlTransferTo').append($('<option></option>').val(val.SectionCode).html(val.SectionName));
                });

            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AssetListToTransfer(logic) {
    if (logic == 'AssetListToReceive') {
        $("#transferBlock").hide();
        $("#btnReceive").show();
        $("#btnCancel").hide();
    }
    else {
        $("#transferBlock").show();
        $("#btnReceive").hide();
        $("#btnCancel").show();
    }

    var url = config.baseUrl + "/api/Asset/Hosp_AssetMovementQueries";
    var objBO = {};
    objBO.unit_id = Active.unitId;
    objBO.eq_no = "-";
    objBO.DeptId = "-";
    objBO.from = "1900/01/01";
    objBO.to = "1900/01/01";
    objBO.prm_1 = "-"
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#tblAssetList tbody').empty();
            if (data != '') {
                var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr id="Row' + val.eq_no+'"><td style="width:8%;text-align:center"><button id=' + val.eq_no + ' class="btn" onclick=AssetDetail(this.id)><i class="fa fa-home"></i></button></td><td style="width:30%;text-align:left">' + val.eq_no + '</td><td style="width:62%;text-align:left">' + val.eq_name + '</td></tr>').appendTo($('#tblAssetList tbody'));
                });

                $('#ddlDept').empty().append($('<option value="Select Department" >Select Department</option>'));
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('#ddlDept').append($('<option></option>').val(val.DeptCode).html(val.DeptName));
                });

            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AssetDetail(eqNo) {
    var url = config.baseUrl + "/api/Asset/Hosp_AssetMovementQueries";
    var objBO = {};
    objBO.unit_id = Active.unitId;
    objBO.eq_no = eqNo;
    objBO.DeptId = "-";
    objBO.from = "1900/01/01";
    objBO.to = "1900/01/01";
    objBO.prm_1 = "-"
    objBO.login_id = Active.userId;
    objBO.Logic = "AssetDetail";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#txtAssetNo").val(eqNo);
                    $("#tdAssetName").html(val.eq_name);
                    $("#tdAssetLocation").html(val.eq_location);
                });
            
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Hospital_AssetMovement(Logic) {

    var url = config.baseUrl + "/api/Asset/Hospital_AssetMovement";
    var objBO = {};

    if ($("#ddlTransferTo").val() == 'Select Section' && Logic == 'Move') {
        alert("Section is not selected to Move")
        return;
    }

    if ($("#txtAssetNo").val()== '') {
        alert("Asset No not selected")
        return;
    }
    objBO.unit_id = Active.unitId;
    objBO.eq_no = $("#txtAssetNo").val();
    objBO.SectionCode = $("#ddlTransferTo").val();
    objBO.Remark = $("#txtRemark").val();
    objBO.login_id = Active.userId;
    objBO.Logic = Logic;

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                
                var rowid = "Row" + $("#txtAssetNo").val();
               // $('#' + rowid).remove();
                alert(data);
             
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AssetTransferLog() {
 
    var url = config.baseUrl + "/api/Asset/Hosp_AssetMovementQueries";
    var objBO = {};
    objBO.unit_id = Active.unitId;
    objBO.eq_no = $("#txtAssetNoForLog").val();
    objBO.DeptId = "-";
    objBO.from = "1900/01/01";
    objBO.to = "1900/01/01";
    objBO.prm_1 = "-"
    objBO.login_id = Active.userId;
    objBO.Logic = "AssetTransferLog";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data != '') {

                $.each(data.ResultSet.Table, function (key, val) {
                    $("#txtAsset").html(val.eq_name);
                    $("#txtLocation").html(val.existing_loc);
                    $("#txtTransferTo").html(val.Transfer_To);
                });
                $('#tblTransferLog tbody').empty();
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('<tr><td>' + val.trf_date + '</td><td>' + val.trf_fromname + '</td><td>' + val.trfBy + '</td><td>' + val.trf_toname + '</td><td>' + val.rcpt_by + '</td><td>' + val.rcpt_date + '</td></tr>').appendTo($('#tblTransferLog tbody'));
                });
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function GetStock(logic, ReportType) {
    var url = config.baseUrl + "/api/Asset/MovementReportExcel";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = "MovementReport";
    Global_DownloadExcel(url, objBO, "MovementReport.xlsx");
}



function showDialog() {
    var t = $('#txtAssetNo').val();
    if (t.length > 2) {
        $("#txtAssetNoForLog").val(t);
        AssetTransferLog();
    }
    $('#myModal').modal('show');
}