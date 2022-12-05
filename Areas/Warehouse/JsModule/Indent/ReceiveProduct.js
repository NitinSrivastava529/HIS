$(document).ready(function () {
    GetCartListByLoginId();
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
                    $("#ddlCartList").append($("<option></option>").val(value.CartId).html(value.CartName));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function GetPendingTransaction() {
    var cartId = $("#ddlCartList option:selected").val();
    if (cartId == "0") {
        alert("Please select Cart Id");
        return false;
    }
    var TransBo = {};
    TransBo.CartId = cartId;
    TransBo.login_id = Active.userId;
    TransBo.warehouseCartId = Active.warehouseId;
    TransBo.Logic = "GetPendingTransaction";
    var url = config.baseUrl + "/api/warehouse/wh_PendingTransaction";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(TransBo),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            var ctname = "";
            $('#tblPendingTransaction').show();
            $('#tblPendingTransaction tbody').empty();
            if (data.ResultSet.Table.length > 0) {
                
                $.each(data.ResultSet.Table, function (key, val) {
                    if (ctname != val.fromCart) {
                        htmldata += '<tr>';
                        htmldata += '<td colspan="4" style="font-weight:bold">' + val.fromCart + '</td>';
                        htmldata += '</tr>';
                        ctname = val.fromCart;
                    }
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.tran_id + '</td>';
                    htmldata += '<td>' + val.date + '</td>';
                    htmldata += '<td><a id="btnPrint' + key + '" href="javascript:void(0)" onclick=GetTransactionDetails(' + "'" + val.tran_id + "'" + ')><i class="fa fa-arrow-circle-o-right fa-lg text-red"></i></a></td>';
                    htmldata += '</tr>';
                });
                $('#tblPendingTransaction tbody').append(htmldata);
            }
            else {
                $('#tblPendingTransaction').show();
                $('#tblPendingTransaction tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblPendingTransaction tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}

function GetTransactionDetails(transId) {
    
    var TransDetailsBo = {};
    TransDetailsBo.lot_no = transId;
    TransDetailsBo.login_id = Active.userId;
    TransDetailsBo.warehouseCartId = Active.warehouseId;
    TransDetailsBo.Logic = "GetDetailByTransactionId";
    var url = config.baseUrl + "/api/warehouse/wh_TransactionDetails";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(TransDetailsBo),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $("#txtTransId").val(transId);
                $('#tblTransactionDetails').show();
                $('#tblTransactionDetails tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.master_key_id + '</td>';
                    htmldata += '<td>' + val.item_name + '</td>';
                    htmldata += '<td>' + val.batch_no + '</td>';
                    htmldata += '<td>' + val.exp_date + '</td>';
                    htmldata += '<td>' + val.pack_type + '</td>';
                    htmldata += '<td>' + val.pack_qty + '</td>';
                    htmldata += '<td>' + val.qty + '</td>';
                    htmldata += '</tr>';
                });
                $('#tblTransactionDetails tbody').append(htmldata);
            }
            else {
                $('#tblTransactionDetails').show();
                $('#tblTransactionDetails tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblTransactionDetails tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function ReceiveProduct() {
    var transId = $("#txtTransId").val();
    if (transId != "") {
        var ReceiveBo = {};
        ReceiveBo.lot_no = transId;
        ReceiveBo.login_id = Active.userId;
        ReceiveBo.Logic = "Receive";
        var url = config.baseUrl + "/api/warehouse/wh_ReceiveProduct";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(ReceiveBo),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                alert(data);
                window.location.reload();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}




