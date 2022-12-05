var _CartId = '';
$(document).ready(function () {
    FillCarts();
    $('#txtQty').on('change', function () {
        var qty = $(this).val();
        var stock = $('#txtStock').val();
        if (eval(qty) > eval(stock)) {
            alert('Qty should be less than Stock.');
            $(this).val(0);
            return;
        }
    });
    $('#btnAdd').on('click', function () {
        var qty = $('#txtQty').val();
        var stock = $('#txtStock').val();
        if (qty > 0) {
            Dispatch();
        }
        else {
            alert('Qty should be greater than 0.');
        }
    });
});

function FillCarts() {
    $("#ddlCartList").empty();
    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.CartId = '';
    objBO.ItemId = '-';
    objBO.Logic = "GetPendingIndentCarts";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#ddlCartList').empty().append($('<option selected="selected"></option>').val("Select").html("Select")).select2();
            $('#ddlCartList').append($('<option></option>').val("ALL").html("ALL"));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlCartList').append($('<option></option>').val(val.CartId).html(val.CartName));
            })
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}
function GetIndentInfo() {
    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.CartId = $('#ddlCartList option:selected').val();
    objBO.ItemId = '-';
    objBO.Logic = "GetIndentInfoByCart";

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            $('#tblIemStocks tbody').empty();
            var tbody = "";
            var indentNo = "";
            var Cart = "";
            $.each(data.ResultSet.Table, function (key, val) {
                _CartId = val.CartId;
                if (Cart != val.CartId) {
                    tbody += "<tr style='background:#fbc7c7'>";
                    tbody += "<td colspan='5'>" + val.CartName + "</td>";
                    tbody += "</tr>";
                    Cart = val.CartId;
                }
                if (indentNo != val.IndentNo) {
                    tbody += "<tr style='background:#e4e4e4'>";
                    tbody += "<td colspan='5'>" + val.IndentNo + ' [' + val.IndentDate + ']' + "</td>";
                    tbody += "</tr>";
                    indentNo = val.IndentNo;
                }
                if (val.IsRejected == 'Y')
                    tbody += "<tr style='background:#f7a4a4'>";
                else
                    tbody += "<tr>";

                tbody += "<td style='display:none'>" + val.IndentNo + "</td>";

                if (val.ReqQty == val.PendQty && val.IsRejected == 'N')
                    tbody += "<td><button class='btn-danger btn-tbl' onclick=CancelOrder('" + val.IndentNo + "','" + val.item_id + "')><i class='fa fa-close'></i></button></td>";
                else
                    tbody += "<td></td>";

                tbody += "<td>" + val.item_name + "</td>";
                tbody += "<td class='text-right'>" + val.ReqQty + "</td>";
                tbody += "<td class='text-right'>" + val.PendQty + "</td>";
                if (objBO.CartId == 'ALL') {
                    tbody += '<td>-</td>';
                } else {
                    tbody += "<td><button class='btn-warning btn-tbl' onclick=selectRow(this);StoreStocks('" + val.item_id + "','" + val.PendQty + "')><i class='fa fa-sign-in'></i></button></td>";
                }
                tbody += "</tr>";
            });
            $('#tblIemStocks tbody').append(tbody);
            if (objBO.CartId == 'ALL') {
                $('#txtStock').val('');
                $('#txtQty').val('');
                $('#txtLotNo').val('New');
                $('#tblItemByLot tbody').empty();
            }
            else {
                GetItemsByCartId();
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Dispatch() {
    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferStock";
    var objBO = {};
    var stqty = $('#txtStock').val();
    var qty = $('#txtQty').val();
    var ItemId = $('#txtItemId').text();
    if ($('#ddlCartList option:selected').text() == "Select") {
        alert('Transfer from Cart not selected');
        return;
    }
    if (ItemId == "") {
        alert('Item Not Selected.');
        return;
    }
    objBO.lot_no = $('#txtLotNo').val();
    objBO.ItemId = $('#txtItemId').text();
    objBO.qty = $('#txtQty').val();
    objBO.damage_qty = 0;
    objBO.trf_from = Active.LinenStoreCartId;
    objBO.trf_to = $('#ddlCartList option:selected').val();
    objBO.trf_remark = '';
    objBO.login_id = Active.userId;
    objBO.IndentNo = $('#tblIemStocks tbody tr.select-row').find('td:eq(0)').text();
    objBO.AutoId = "0";
    objBO.Logic = "DispatchByIndent";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes("Success")) {
                var lotNo = data.split('|')[1];
                $('#txtStock').val('');
                $('#txtQty').val('');
                GetItemsByCartId();
                GetIndentInfo();
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        },
    });
}
function GetItemsByCartId() {
    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
    var objBO = {};
    objBO.TranId = $('#txtLotNo').val();
    objBO.login_id = Active.userId;
    objBO.trf_from = Active.LinenStoreCartId;
    objBO.CartId = _CartId;
    objBO.Logic = "UnCompleted:TransferToCart";

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            $("#tblItemByLot tbody").empty();
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.item_id + '</td>';
                    htmldata += '<td>' + val.item_name + '</td>';
                    htmldata += '<td class="text-right">' + val.qty + '</td>';
                    htmldata += '<td><button class="btn-danger btn-tbl" onclick=selectRow(this);DispatchDelete(' + val.Rec_Id + ')><i class="fa fa-trash"></i></button></td>';
                    $('#txtLotNo').val(val.lot_no);
                });
                $("#tblItemByLot tbody").append(htmldata);
            }
            else {
                $('#txtLotNo').val("New");
            }
            $('#ddlProductList').focus();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function StoreStocks(ItemId, qty) {
    if (qty == 0)
        $('#btnAdd').prop('disabled', true);
    else
        $('#btnAdd').prop('disabled', false);

    $('#txtItemId').text(ItemId);
    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
    var objBO = {};
    objBO.TranId = '-';
    objBO.ItemId = ItemId;
    objBO.CartId = Active.LinenStoreCartId;
    objBO.Logic = "LL_StoreStocks";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#txtStock').val(val.stocks);
                    $('#txtQty').val(qty);


                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DispatchComplete() {
    if (confirm('Are you sure to Complete Dispatch..!')) {
        var url = config.baseUrl + "/api/LinenLaundry/LL_TransferComplete";
        var objBO = {};
        objBO.lot_no = $('#txtLotNo').val();
        objBO.login_id = Active.userId;
        objBO.Logic = "Dispatch";
        if ($('#tblItemByLot tbody tr').length < 1) {
            alert('Please Add Items Qty..');
            return;
        }
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes("Success")) {
                    alert(data);
                    GetItemsByCartId();
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
}
function DispatchDelete(autoid) {
    if (confirm('Are you sure to Delete..!')) {
        var url = config.baseUrl + "/api/LinenLaundry/LL_TransferStock";
        var objBO = {};
        objBO.lot_no = '-';
        objBO.AutoId = autoid;
        objBO.Logic = "DeleteByIndentNo";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                $('#txtStock').val('');
                $('#txtQty').val('');
                $('#txtItemId').text('');
                GetItemsByCartId();
                GetIndentInfo();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function CancelOrder(IndentNo, ItemId) {
    if (confirm('Are you sure to Cancel..!')) {
        var url = config.baseUrl + "/api/LinenLaundry/LL_TransferStock";
        var objBO = {};
        objBO.lot_no = '-';
        objBO.AutoId = 0;
        objBO.IndentNo = IndentNo;
        objBO.ItemId = ItemId;
        objBO.login_id = Active.userId;
        objBO.Logic = "CancelByIndentNo";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                GetIndentInfo();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}