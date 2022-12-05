var _AuditNo = "";
$(document).ready(function () {
    CloseSidebar();
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
    $('input[name=Product]').on('change', function () {
        if ($(this).val() == 'Pending') {
            $('input[type=date]').prop("disabled", true);
            GetPendingReport('GetUnProcessedAudit');
        }
        else {
            $('input[type=date]').prop("disabled", false);
        }
    });
    CloseSidebar();
    GetAllCart();
    $('#ddlCart').on('change', function () {
        var cartId = $('#ddlCart option:selected').val();
        AuditNobyCartId(cartId);
    });
});


function DownloadExcel() {
    var cartId = $('#ddlCart option:selected').val();
    var auditno = $('#ddlAuditNo option:selected').val();
    var url = config.baseUrl + "/api/warehouse/DownloadAuditReport";
    if (cartId == "0") {
        alert("Please select Cart");
        return false;
    }
    if (auditno == "0") {
        alert("Please select item");
        return false;
    }
    var objBO = {};
    objBO.CartId = cartId;
    objBO.AuditNo = _AuditNo;
    objBO.login_id = Active.userId;
    objBO.Logic = "GetAuditInfo";
    Global_DownloadExcel(url, objBO, "AuditReport.xlsx");
}
//--
function GetPendingReport(logic) {
    $('#tblDetails tbody').empty();
    var url = config.baseUrl + "/api/warehouse/wh_AuditQueries";
    var objBO = {};
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (data.ResultSet.Table.length > 0) {
                var htmldata = "";
                var CartName = "";

                $.each(data.ResultSet.Table, function (key, val) {
                    if (CartName != val.CartName) {
                        htmldata += "<tr class='cart-group'>";
                        htmldata += "<td colspan='3'>" + val.CartName + "</td>";
                        htmldata += "</tr>";
                        CartName = val.CartName;
                    }
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.audit_no + '</td>';
                    htmldata += '<td>' + val.audit_date.split('T')[0] + '</td>';
                    htmldata += "<td><button class='btn-success'  style='border:none; padding:1px 9px;' onclick=GetAllInfoById('" + val.audit_no + "')><span class='fa fa-sign-in'></button></td >";
                    htmldata += '</tr>';
                });
                $('#tblDetails tbody').append(htmldata);
            }
        },
        error: function (err) {
            alert(err.responseText);
        }
    });

}
function GetAllInfoById(auditno) {
    _AuditNo = auditno;
    var url = config.baseUrl + "/api/warehouse/wh_AuditQueries";
    var objBO = {};
    objBO.AuditNo = auditno;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Logic = "GetAuditInfo";
    objBO.login_id = Active.userId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (data.ResultSet.Table.length > 0) {
                var htmldata = "";
                var auditnos = "";
                $('#tblAuditReport tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    
                    if (auditnos != val.auditType) {
                        htmldata += '<tr>';
                        htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb;color:#000">' + val.auditType + '</td>';
                        htmldata += '</tr>';
                        auditnos = val.auditType;
                    }
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.item_name + '</td>';
                    htmldata += '<td>' + val.mfd_name + '</td>';
                    htmldata += '<td>' + val.batch_no + '</td>';
                    htmldata += '<td>' + val.exp_date + '</td>';
                    htmldata += '<td>' + val.pack_type + '</td>';
                    htmldata += '<td>' + val.pack_qty + '</td>';
                    htmldata += '<td>' + val.qty + '</td>';
                    htmldata += '<td>' + val.mrp + '</td>';
                    htmldata += '<td>' + val.amount + '</td>';
                    htmldata += '<td>' + val.upr + '</td>';
                    htmldata += '</tr>';
                });
                $('#tblAuditReport tbody').append(htmldata);
            }
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}
function InsertAuditComplete() {
    var url = config.baseUrl + "/api/warehouse/wh_AuditCompletion";
    var objBO = {};
    objBO.HospId = Active.HospId;
    objBO.AuditNo = _AuditNo;
    objBO.login_id = Active.userId;
    objBO.Logic = "PostAuditedStock";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
        
        }
    });

}