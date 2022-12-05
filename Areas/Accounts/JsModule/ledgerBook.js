$(document).ready(function () {
    FillCurrentDate("txtFrom");
    FillCurrentDate("txtTo");
});
function BindLederNames() {
    var url = config.baseUrl + "/api/Account/SearchLedger";
    var objBO = {};
    var searchKey = $('#txtSearchLedger').val();
    objBO.UnitId = Active.unitId;
    objBO.Logic = "SearchLedger";
    objBO.LoginId = Active.userId;
    objBO.prm1 = searchKey;
    objBO.Division = "-";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            $("#ddlLedgerName").empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#ddlLedgerName").append("<option value='" + val.ledgerID + "'>" + val.ledgerName + "</option>");
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
function GetLedgerBook(ReportType) {
    var url = config.baseUrl + "/api/Account/AC_ViewLedgerInfo";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.ledgerId = $('#ddlLedgerName').val();
    objBO.Logic = "GetBooks";
    objBO.VoucherNo = "-";
    objBO.LoginId = Active.userId;
    objBO.ReportType = ReportType;
    if (ReportType == "Excel") {
    Global_DownloadExcel(url, objBO, "LedgerBook.xlsx");
    }
    else {
    $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                var t = data.split('#')
                $("#ShowInfo").html(t[0]);
                $("#tdDebitOpening").html(t[1]);
                $("#tdCreditOpening").html(t[2]);
                $("#tdTotDebit").html(t[3]);
                $("#tdTotCredit").html(t[4]);
                $("#tdClosingDebit").html(t[5]);
                $("#tdClosingCredit").html(t[6]);
            }
        });
    }
}
function showVoucherDetail(voucherNo) {
    
    if (voucherNo.length > 2) {
        $('#elVoucherNo').html(voucherNo);
        VoucherDetail(voucherNo);
    }
    $('#myModal').modal('show');
}
function VoucherDetail(voucherNo) {
    var url = config.baseUrl + "/api/Account/AC_VoucherDetail";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.ledgerId = $('#ddlLedgerName').val();
    objBO.Logic = "VoucherFullDetail";
    objBO.VoucherNo = voucherNo;
    objBO.LoginId = Active.userId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $("#elVoucherDetail").html(data);
        }
    });
}
