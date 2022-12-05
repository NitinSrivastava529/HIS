$(document).ready(function () {
    CloseSidebar();
    OnloadPartial();
    $('#txtSeachItems').on('keyup', function () {
        
        var val = $(this).val().toLowerCase();
        $('#tbItemDetails tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    //var url = '/Warehouse/Stock/PartialItemTransaction';
    //$("#divItemTransPartial").load(url); 
    //window.open(url, '_blank');
});

function OnloadPartial() {
    var url = config.baseUrl + "/api/warehouse/wh_IndentQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = "GetCartByLoginForItemTrans";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("#ddlCart").empty();
                $("#ddlCart").append($("<option></option>").val("0").html("Please Select"));
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlCart").append($("<option></option>").val(value.CartId).html(value.CartName));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function SearchByItemName() {
    var url = config.baseUrl + "/api/warehouse/wh_IndentStockQueries";
    //var url = config.baseUrl + "/api/master/mLabItemQueries";
    var objBO = {};
    var itemname = $('#txtItem').val();
    if (itemname == "") {
        alert("Please select item");
        return false;
    }
    objBO.prm_1 = itemname;
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    //objBO.Logic = "SearchItemByItemName";
    objBO.Logic = "GetAllItem";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tbItemDetails tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    //htmldata += '<td>' + parseInt(key+1) + '</td>';
                    htmldata += '<td>' + val.item_name + '</td>';   //'<span id="spnid" style="color:red">&nbsp;( ' + val.item_id + ' )</span>' +
                    htmldata += '<td>' + val.item_id + '</td>';   //"("  + val.item_id + " ) " +
                    if (val.status_flag == 'Y') {
                        htmldata += '<td style="color:green"> Active </td>';
                    }
                    else {
                        htmldata += '<td style="color:red"> De-Active </td>';
                    }
                    htmldata += '<td><a href="javascript:void(0)" data-itemid="' + val.item_id + '"  onclick="selectRow(this);GetItemTransactionList(this);"><i class="fa fa-arrow-circle-o-right fa-lg text-green"></i></a></td>';
                    htmldata += '</tr>';
                });
                $('#tbItemDetails tbody').append(htmldata);
            }
            else {
                $('#tbItemDetails tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tbItemDetails tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function GetItemTransactionList(element) {
    
    var curStock = 0;
    var objBO = {};
    var url = config.baseUrl + "/api/warehouse/wh_IndentStockQueries";
    var cartId = $('#ddlCart option:selected').val();
    var itemId = $(element).data('itemid');
    var itemname = $(element).closest('tr').find('td:eq(0)').text();
    if (cartId == "0") {
        alert("Please select Cart");
        return false;
    }
    if (itemId == "" && itemId == null && typeof itemId == 'undefined') {
        alert("Item Id not found");
        return false;
    }
    objBO.CartId = cartId;
    objBO.item_id = itemId;
    objBO.Logic = "ItemTransactions";
    $("#spnItemName").text('');
    $("#spnItemName").text(itemname);
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            var currentstock = 0;
            if (data.ResultSet.Table.length > 0) {
                $('#tblItemTransPartial tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.trn_type + '</td>';
                    htmldata += '<td>' + val.tran_id + '</td>';
                    htmldata += '<td>' + val.doc_date + '</td>';
                    htmldata += '<td>' + val.qty + '</td>';
                    htmldata += '<td>' + val.from_cart + '</td>';
                    htmldata += '<td>' + val.to_cart + '</td>';
                    //htmldata += '<td>' + val.item_id + '</td>';
                    htmldata += '</tr>';
                    curStock = curStock + val.qty 
                });
                $("#spncurrentStock").text(" ==> Current Stock: " + curStock);
                $('#tblItemTransPartial tbody').append(htmldata);
            }
            else {
                $('#tblItemTransPartial tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblItemTransPartial tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

