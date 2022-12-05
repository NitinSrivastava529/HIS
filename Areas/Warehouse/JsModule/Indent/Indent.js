$(document).ready(function () {
    GetCartListByLoginId();
    $("#txtOrder").prop('disabled', true);
    $("#txtOrder").val("New");

    $('input[id="txtQty"]').keyup(function (e) {
        if (/\D/g.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
    });

    $("#ddlCartList").change(function () {
        var cid = $('#ddlCartList :selected').val();
        GetIndentOrderList(cid);
    });

    $(document).on('click', '.searchitems', function () {
        var itemid = $(this).data('itemid');
        $("#spnitemid").text(itemid);
        var itemidtext = $(this).text().trim();
        $('#txtItemName').val(itemidtext);
        $('#txtQty').focus();
        $('#ItemList').hide();
    });

    $('#txtItemName').keydown(function (e) {
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
                $('input[id=txtQty]').focus();
                var itemid = $("#tblnavigate tbody").find('tr.selected').data('itemid');
                $("#spnitemid").text(itemid);
                var itemidtext = $("#tblnavigate tbody").find('tr.selected').text().trim();
                $('#txtItemName').val(itemidtext);
                $('#ItemList').hide();
                break;
            case (KeyCode = 9):
                $('#ItemList').hide();
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

    $('#txtQty').on('keydown', function (e) {
        if (e.which == 13) {
            $("#btnAddItem").focus();
        }
    });
});

function ItemSelection() {
    
    var url = config.baseUrl + "/api/warehouse/wh_IndentCartQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.prm_1 = $('#txtItemName').val();
    objBO.Logic = "ItemSelection";   
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
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

function InsertUpdateItem() {        
    var objInsertBO = {};
    var CartId = $('#ddlCartList :selected').val();
    var itemid = $("#spnitemid").text();
    var qty = $('#txtQty').val();
    var ord = $('#txtOrder').val();

    if (CartId == "0") {
        alert("Please select cart");
        return false;
    }
    if (itemid == "") {
        alert("Please select item");
        return false;
    }
    if (qty == "") {
        alert("Please enter quantity");
        return false;
    }

    if (ord == "New") {
        objInsertBO.indent_no = "New";
    }
    else {
        objInsertBO.indent_no = ord;
    }
    objInsertBO.hosp_id = Active.unitId;
    objInsertBO.CartId = CartId;
    objInsertBO.item_id = itemid;
    objInsertBO.order_qty = qty;
    objInsertBO.verifyqty = qty;
    objInsertBO.order_by = Active.userId;
    objInsertBO.Logic = "Insert";
    objInsertBO.user_remark = $("#txtUserRemark").text(); //for direct order processing without verify processing
    objInsertBO.Logic = "Insert";
    
    var url = config.baseUrl + "/api/warehouse/wh_InsertUpdateIndent";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objInsertBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {            
            if (data == "success") {
                //alert('Successfully Saved');
                $("#txtItemName").val("").focus();
                $("#spnitemid").text("");
                $('#txtQty').val("");
                GetIndentOrderList(CartId);
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

function GetIndentOrderList(CartId) {
    var url = config.baseUrl + "/api/warehouse/wh_IndentCartQueries";
    var objPendiningIndentBO = {};
    objPendiningIndentBO.CartId = CartId;
    objPendiningIndentBO.Logic = "UnCompletedIndent";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objPendiningIndentBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblIndentOrrderList').show();
                $('#tblIndentOrrderList tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#txtOrder").val(val.Indent_no);
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.Indent_no + '</td>';
                    htmldata += '<td>' + val.item_id + '</td>';
                    htmldata += '<td>' + val.item_Name + '</td>';
                    htmldata += '<td>' + val.order_qty + '</td>';
                    htmldata += '<td><a href="javascript:void(0)" onclick=DeletePendingIndent(' + "'" + val.Indent_no + "'" + ',' + "'" + val.item_id + "'" +')><i class="fa fa-trash fa-2x text-red" style="font-size:11px"></i></a></td>';
                    htmldata += '</tr>';
                });
                $('#tblIndentOrrderList tbody').append(htmldata);
            }
            else {
                $('#tblIndentOrrderList').show();
                $('#tblIndentOrrderList tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $("#txtOrder").val("New");
                $('#tblIndentOrrderList tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function DeletePendingIndent(Indentno, itemid) {
    var objdeleteBO = {};    
    objdeleteBO.hosp_id = Active.unitId; 
    objdeleteBO.indent_no = Indentno;
    objdeleteBO.item_id = itemid;    
    objdeleteBO.Logic = "Delete";
    //var url = config.baseUrl + "/api/Indent/DeleteIndent";  
    var url = config.baseUrl + "/api/warehouse/wh_InsertUpdateIndent";
    if (confirm("Are you sure to delete?")) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objdeleteBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == "success") {
                    alert('Successfully Deleted');
                    GetIndentOrderList($('#ddlCartList :selected').val());
                }
                else {
                    alert('Not Saved');
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }


}

function CompleteOrder() {
    var indentno = $("#txtOrder").val();
    var cartid = $('#ddlCartList :selected').val();
    if (indentno == "") {
        alert('please enter order no');
        return false;
    }
    if (cartid == "0") {
        alert('please select cart id');
        return false;
    }
    var objCompleteBO = {};
    objCompleteBO.hosp_id = Active.unitId;
    objCompleteBO.indent_no = indentno;    
    objCompleteBO.Logic = "Complete";
    //var url = config.baseUrl + "/api/warehouse/CompleteOrder";
    var url = config.baseUrl + "/api/warehouse/wh_InsertUpdateIndent";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objCompleteBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == "success") {
                alert('Order Completed successully');
                GetIndentOrderList($('#ddlCartList :selected').val());
            }
            else {
                alert('Not Saved');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}


