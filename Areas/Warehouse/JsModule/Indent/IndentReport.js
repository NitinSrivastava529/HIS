$(document).ready(function () {
    GetCartListByLoginId();
    FillCurrentDate("txtFrom");
    FillCurrentDate("txtTo");
});

function GetCartListByLoginId() {
    var url = config.baseUrl + "/api/warehouse/wh_IndentCartQueries";
    var objIdentBO = {};
    objIdentBO.login_id = Active.userId;
    objIdentBO.Logic = "GetCartListByLogin";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objIdentBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("ddlCartList").empty();
                $("#ddlCartList").append($("<option></option>").val("0").html("Please Select"));
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlCartList").append($("<option></option>").val(value.CartId).html(value.CartName)).select2();
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function OrderIdList() {
    var url = config.baseUrl + "/api/warehouse/wh_IndentCartQueries";
    var from = $("#txtFrom").val();
    var to = $("#txtTo").val();
    var ReportType = $('#ddlReportType').val();
    var objBO = {};
    objBO.CartId = $('#ddlCartList :selected').val();
    objBO.Logic = "AllOrdersOfUnit";
    objBO.From = from
    objBO.To = to;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#tblOrderIds tbody').empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.Indent_no + '</td><td>' + val.order_date + '</td><td><input id=' + val.Indent_no + ' type="button" class="btn btn-warning" value="V" onclick="OrderIdDetail(this.id)" /></td></tr>').appendTo($('#tblOrderIds tbody'));
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
function OrderIdDetail(indent_no) {
    var url = config.baseUrl + "/api/warehouse/wh_IndentCartQueries";
    var objBO = {};
    objBO.CartId = Active.unitId;
    objBO.indent_no = indent_no;
    objBO.Logic = "OrderDetailOfUnit";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#tblOrderDetail tbody').empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.item_Name + '</td><td>' + val.order_qty + '</td><td>' + val.verify_qty + '</td><td>' + val.stockAtUnit + '</td><td>' + val.verify_remark + '</td><td>' + val.trf_qty + '</td><td>' + val.Pend_qty + '</td></tr>').appendTo($('#tblOrderDetail tbody'));
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