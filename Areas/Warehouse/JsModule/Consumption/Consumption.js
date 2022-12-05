$(document).ready(function () {
    var loginUser = Active.userName + '[ ' + Active.userId + ']';
    $("#ddlEmployee").empty().append($("<option></option>").val(Active.userId).html(loginUser));
    bindCart();
    GetStockTransaction();
    $("#txtInStock").prop("disabled", true);
    //$("#txtQty").on("keypress", function (e) {		
    //	if (e.which ==13) {
    //		AddStock();
    //	}
    //});
    $("#ddlCartList").on('change', function () {
        var val = $(this).find('option:selected').val();       
        GetStockTransaction(val);
    })
    $('#txtItemName').on('keyup', function (e) {
        var tbody = $('#tblnavigate').find('tbody');
        var selected = tbody.find('.selected');
        var KeyCode = e.keyCode;
        switch (KeyCode) {
            case (KeyCode = 40):
                tbody.find('.selected').removeClass('selected');
                if (selected.next().length == 0) {
                    tbody.find('tr:first').addClass('selected');
                }
                else {
                    tbody.find('.selected').removeClass('selected');
                    selected.next().addClass('selected');
                }
                break;
            case (KeyCode = 38):
                tbody.find('.selected').removeClass('selected');
                if (selected.prev().length == 0) {
                    tbody.find('tr:last').addClass('selected');
                }
                else {
                    selected.prev().addClass('selected');
                }
                break;
            case (KeyCode = 13):
                var itemid = $("#tblnavigate tbody").find('tr.selected').data('itemid');
                $("#hiditemId").val(itemid);
                var itemidtext = $("#tblnavigate tbody").find('tr.selected').text();
                $('#txtItemName').val(itemidtext);
                $('#ItemList').hide();
                GetStockByItemIdandCartId($("#ddlCartList option:selected").val(), $("#hiditemId").val());
                break;
            default:
                var val = $('#txtItemName').val();
                if (val == '') {
                    $('#ItemList').hide();
                }
                else {
                    $('#ItemList').show();
                    ItemSelection();
                }
                break;
        }
    });
    $('#tblnavigate tbody').on('click', 'tr', function () {
        itemid = $(this).data('itemid');
        cart = $("#ddlCartList option:selected").val();
        itemidtext = $(this).text();
        $("#hiditemId").val(itemid);

        $('#txtItemName').val(itemidtext);
        $('#ItemList').hide();
        $('#tblnavigate tbody').empty();
        GetStockByItemIdandCartId(cart, itemid);
    });
    $('#tblStock tbody').on('click', 'tr', function () {
        var inStock = $(this).find('td:nth-child(6)').text();
        var packType = $(this).find('td:nth-child(2)').text();
        var packqty = $(this).find('td:nth-child(4)').text();
        var mstkey = $(this).find('td:nth-child(1)').text();
        $('#divpopup').hide();
        $('#txtInStock').val(inStock);
        $('#txtPackType').val(packType);
        $('#txtPackQty').val(packqty);
        $('#hidmasterkey').val(mstkey);
        $('input[id=txtQty]').focus();
    });
    $(document).on('keydown', function (e) {
        var popup = $('#divpopup').css('display') == 'block';
        //var btnsaveorder = $('#btnSaveOrder').hasClass('focus1');
        var KeyCode = e.keyCode;
        if (popup) {
            var tbody = $('#tblStock').find('tbody');
            var selected = tbody.find('.selected');
            switch (KeyCode) {
                case (KeyCode = 40):
                    tbody.find('.selected').removeClass('selected');
                    if (selected.next().length == 0) {
                        tbody.find('tr:first').addClass('selected');
                    }
                    else {
                        tbody.find('.selected').removeClass('selected');
                        selected.next().addClass('selected');
                    }
                    break;
                case (KeyCode = 38):
                    tbody.find('.selected').removeClass('selected');
                    if (selected.prev().length == 0) {
                        tbody.find('tr:last').addClass('selected');
                    }
                    else {
                        selected.prev().addClass('selected');
                    }
                    break;
                case (KeyCode = 13):
                    var inStock = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(6)').text();
                    var packType = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(2)').text();
                    var packqty = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(4)').text();
                    var mstkey = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(1)').text();
                    $('#divpopup').hide();
                    $('#txtInStock').val(inStock);
                    $('#txtPackType').val(packType);
                    $('#txtPackQty').val(packqty);
                    $('#hidmasterkey').val(mstkey);
                    $('input[id=txtQty]').focus();
                    break;
            }
        }

    });
    $('#btnGetEmp').on('click', function () {
        var name = $('#txtEmpName').val();
        GetEmployeeList(name);
    });
});
function GetEmployeeList(name) {
    var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
    var objConsumpBO = {};
    objConsumpBO.prm_1 = name;
    objConsumpBO.Logic = "GetEmployeeList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("#ddlEmployee").empty().append($("<option></option>").val(0).html('Select Employee'));
                $('#txtEmpName').val('');
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlEmployee").append($("<option></option>").val(value.emp_code).html(value.emp_name)).select2();
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function bindCart() {
    var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
    var objConsumpBO = {};
    objConsumpBO.login_id = Active.userId;
    objConsumpBO.Logic = "GetCartListByLogin";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("#ddlCartList").empty();
                $("#ddlCartList").append($("<option></option>").val("0").html("Please Select"));
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlCartList").append($("<option data-type='" + value.CartType + "'></option>").val(value.CartId).html(value.CartName)).select2();
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function ItemSelection() {
    var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
    var objConsumpBO = {};
    objConsumpBO.hosp_id = Active.unitId;
    objConsumpBO.CartId = $('#ddlCartList option:selected').val();
    objConsumpBO.prm_1 = $('#txtItemName').val();
    objConsumpBO.Logic = "ItemSelection";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ItemList tbody').empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ItemList').show();
                    $('<tr class="searchitems" data-itemid=' + val.item_id + '><td>' + val.item_name + "</td></tr>").appendTo($('#ItemList tbody'));
                });
            }
            else {
                $('#ItemList').hide();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function GetStockByItemIdandCartId(cartId, itemid) {
    var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
    var objConsumpBO = {};
    objConsumpBO.hosp_id = Active.unitId;
    objConsumpBO.CartId = cartId;
    objConsumpBO.item_id = itemid;
    objConsumpBO.Logic = "GetStockByItemIdAndCartId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {

            $('#tblStock tbody').empty();
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.master_key_id + '</td>';
                    htmldata += '<td>' + val.pack_type + '</td>';
                    htmldata += '<td>' + val.batch_no + '</td>';
                    htmldata += '<td>' + val.pack_qty + '</td>';
                    htmldata += '<td>' + val.exp_date + '</td>';
                    htmldata += '<td>' + val.qty + '</td>';
                    htmldata += '</tr>';
                });
                $('#tblStock tbody').append(htmldata);
                $("#divpopup").show();
            }
            else {
                $('#ItemList').hide();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function AddStock() {
    var url = config.baseUrl + "/api/warehouse/wh_InsertUpdateConsumption";
    var objConsumpBO = {};
    var type = $('#ddlCartList option:selected').data('type');
    if (type == 'Non-Consumable') {
        alert('Consuming Stock is not allowed by Non-Consumable Cart.');
        return
    }
    var stqty = $('#txtInStock').val();
    var qty = $('#txtQty').val();
    if (qty > stqty) {
        alert('supply qunatity can not be geater than stock qty');
        return false;
    }
    objConsumpBO.hosp_id = Active.unitId;
    objConsumpBO.compid = "CHL";
    objConsumpBO.transid = '-';
    objConsumpBO.transtype = 'Consumed';
    objConsumpBO.frmcart = $("#ddlCartList option:selected").val();
    objConsumpBO.tocart = $("#ddlCartList option:selected").val();
    objConsumpBO.item_id = $("#hiditemId").val();
    objConsumpBO.IssueTo = $("#ddlEmployee option:selected").val();
    objConsumpBO.masterkeyid = $("#hidmasterkey").val();
    objConsumpBO.qty = $("#txtQty").val();
    objConsumpBO.login_id = Active.userId;
    objConsumpBO.Logic = "Insert";

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == "success") {
                GetStockTransaction(objConsumpBO.frmcart);
                $("#txtInStock").val('');
                $("#txtQty").val('');
                $("#txtPackType").val('');
                $("#txtPackQty").val('');
                $("#txtItemName").val('');
                $("#hiditemId").val('');
                $("#hidmasterkey").val('');
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

function GetStockTransaction(CartId) {
    var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
    var objConsumpBO = {};
    objConsumpBO.CartId = CartId;
    objConsumpBO.Logic = "GetStockTransaction";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            $("#tblStockTransaction tbody").empty();
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.FromCart + '</td>';
                    htmldata += '<td>' + val.master_key_id + '</td>';
                    htmldata += '<td>' + val.item_name + '</td>';
                    htmldata += '<td>' + val.pack_type + '</td>';
                    htmldata += '<td>' + val.pack_qty + '</td>';
                    htmldata += '<td>' + val.batch_no + '</td>';
                    htmldata += '<td>' + val.exp_date + '</td>';
                    htmldata += '<td>' + val.qty + '</td>';
                });
                $("#tblStockTransaction tbody").append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

