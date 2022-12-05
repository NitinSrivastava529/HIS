$(document).ready(function () {
    CloseSidebar();
    $("#txtlotno").val('New');
    $("#txtpendqty").prop('disabled', true);
    $("#txtlotno").prop('disabled', true);
    $("#divDispListByLot").hide();
    $("#divUserRemark").hide();
    FillCurrentDate('txtFromDate');
    FillCurrentDate('txttoDate');
    GetCartList();
    $("#ddlCart").change(function () {
        $("#txtlotno").val('New');
    });
    $("#btnIndentList").click(function () {
        var cid = $('#ddlCart :selected').val();
        var from = $('#txtFromDate').val();
        var to = $('#txttoDate').val();
        if (cid == "0") {
            alert('Please select cart id');
            return false;
        }
        if (from == "") {
            alert('Please select from date');
            return false;
        }
        if (to == "") {
            alert('Please select to date');
            return false;
        }
        GetIndentRequest(cid, from, to);
        //GetIndentOrderList(cid);
    });
    $("#btnComplete").click(function () {
        var lotno = $('#txtlotno').val();
        CompleteDispatched(lotno);
    });

    $(window).keydown(function (e) {
        if (e.keyCode == 13) {
            $("#tblWarehouseStock tbody > tr:next()").find("input");
            event.preventDefault();
        }
    });
});

function GetCartList() {
    $("ddlCart").empty();
    var url = config.baseUrl + "/api/warehouse/wh_IndentProcessQueries";
    var objIdentPendingBO = {};
    objIdentPendingBO.Logic = "Verified-OrderUnit";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objIdentPendingBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("#ddlCart").append($("<option></option>").val("0").html("Please Select"));
                $("#ddlCart").append($("<option selected></option>").val("ALL").html("ALL"));
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

function GetIndentRequest(cid, from, to) {
    $("#hidShowtab").val("0");
    from = Properdate(from, '-');
    to = Properdate(to, '-');
    $('#tblIndentRequest tbody').empty();
    var url = config.baseUrl + "/api/warehouse/wh_IndentProcessQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.login_id;
    objBO.CartId = cid;
    objBO.from = from;
    objBO.to = to;
    objBO.Logic = "IndentRequests";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            var cname = "";
            $('#tblIndentRequest tbody').empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (cname != val.CartName) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="7" style="font-weight:bold;background-color:#d1ebfb">' + val.CartName + '</td>';
                            htmldata += '</tr>';
                            cname = val.CartName;
                        }
                        htmldata += '<tr>';
                        htmldata += '<td>' + val.Indent_no + '</td>';
                        htmldata += '<td>' + val.order_date + '</td>';
                        htmldata += '<td class="text-right">' + val.TotIndentQty + '</td>';
                        htmldata += '<td class="text-right">' + val.TotTrfQty + '</td>';
                        if (val.Indentstatus == "Partial") {
                            htmldata += '<td><a class="btn btn-warning btn-block btn-xs" href="javascript:void(0)" id="btnRequestDetails' + key + '" onclick=GetRequestDetailsAndCartPendingLot(' + '"' + val.Indent_no + '"' + ',' + '"' + val.CartId + '"' + ')>' + val.Indentstatus + '</a></td>';
                        }
                        else if (val.Indentstatus == "Complete") {
                            htmldata += '<td><a class="btn btn-success btn-block btn-xs" href="javascript:void(0)" id="btnRequestDetails' + key + '" onclick=GetRequestDetailsAndCartPendingLot(' + '"' + val.Indent_no + '"' + ',' + '"' + val.CartId + '"' + ')>' + val.Indentstatus + '</a></td>';
                        }
                        else if (val.Indentstatus == "Cancelled") {
                            htmldata += '<td><a class="btn btn-danger btn-block btn-xs" href="javascript:void(0)" id="btnRequestDetails' + key + '" onclick=GetRequestDetailsAndCartPendingLot(' + '"' + val.Indent_no + '"' + ',' + '"' + val.CartId + '"' + ')>' + val.Indentstatus + '</a></td>';
                        }
                        else {
                            htmldata += '<td><a style="background: #999a9a;color:#fff;" class="btn btn-xs btn-block" href="javascript:void(0)" id="btnRequestDetails' + key + '" onclick=GetRequestDetailsAndCartPendingLot(' + '"' + val.Indent_no + '"' + ',' + '"' + val.CartId + '"' + ')>' + val.Indentstatus + '</a></td>';
                        }
                        htmldata += '</tr>';
                    });
                    $('#tblIndentRequest tbody').append(htmldata);
                }
            }
            else {
                MsgBox('Data not found....');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function GetRequestDetailsAndCartPendingLot(indentno, cartid) {
    
    $("#txtlotno").val('New');
    $('#tblIndentRequestDetails tbody').empty();
    $('#tblDisplistByCart tbody').empty();
    var url = config.baseUrl + "/api/warehouse/wh_IndentProcessQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.login_id;
    objBO.indent_no = indentno;
    objBO.CartId = cartid;
    objBO.warehouseCartId = Active.warehouseId;
    objBO.Logic = "IndentItems";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata, htmldata1, identno;
            htmldata = htmldata1 = identno = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#hidCartIdForAllUse").val(cartid);
                    $("#hidIndentno").val(indentno);
                    if ($("#hidShowtab").val() == "0") {
                        $('.nav a[href="#2b"]').tab('show');
                    }
                    else {
                        $('.nav a[href="#1b"]').tab('show');
                    }
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (identno != val.indent_no) {
                            htmldata += '<tr id=' + key + '>';
                            htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb">' + val.indent_no + '</td>';
                            htmldata += '</tr>';
                            identno = val.indent_no;
                        }
                        key = key + 1;
                        htmldata += '<tr id=' + key + '>';
                        htmldata += '<td style="display:none">' + val.indent_no + '</td>';
                        htmldata += '<td>' + val.order_date + '</td>';
                        htmldata += '<td>' + val.item_id + '</td>';
                        htmldata += '<td>' + val.item_Name + '</td>';
                        htmldata += '<td class="text-right">' + val.wh_stock + '</td>';
                        htmldata += '<td class="text-right">' + val.cart_stocks + '</td>';
                        htmldata += '<td class="text-right">' + val.order_qty + '</td>';
                        htmldata += '<td class="text-right">' + val.verify_qty + '</td>';
                        htmldata += '<td class="text-right">' + val.pend_qty + '</td>';
                        htmldata += '<td><a href="javascript:void(0)" id="btnReplace' + key + '" onclick="OpenToReplace(' + "'" + val.item_id + "'" + ',' + "'" + val.indent_no + "'" + ',' + "'" + val.item_Name.replace('"', '') + "'" + ',' + "'CurrentTable'" + ',' + "this.id" + ')"><i class="fa fa-edit fa-lg  text-red"></i></a>' +
                            ' || <a href="javascript:void(0)" id="btnwhStock' + key + '" onclick="GetWarehouseStock(' + "'" + key + "'" + ',' + "'" + val.item_id + "'" + ',' + "'" + val.pend_qty + "'" + ',' + "'" + val.auto_id + "'" + ',' + "'" + val.indent_no + "'" + ',' + "this.id" + ',' + "'" + val.CartId + "'" + ',' + "'" + val.item_Name.replace('"', '') + "'" + ',' + "'CurrentIndent'" + ')"><i class="fa fa-arrow-circle-o-right fa-lg text-green"></i></a></td>';
                        htmldata += '</tr>';

                    });
                    $('#tblIndentRequestDetails tbody').append(htmldata);
                }
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#divDispListByCart").show();
                    $("#divDispListByLot").hide();
                    console.log(data.ResultSet.Table1);
                    $.each(data.ResultSet.Table1, function (key, val) {
                        $("#txtlotno").val(val.lot_no);
                        htmldata1 += '<tr>';
                        htmldata1 += '<td>' + val.item_name + '</td>';
                        htmldata1 += '<td>' + val.batch_no + '</td>';
                        htmldata1 += '<td>' + val.exp_date + '</td>';
                        htmldata1 += '<td>' + val.pack_type + '</td>';
                        htmldata1 += '<td class="text-right">' + val.pack_qty + '</td>';
                        htmldata1 += '<td class="text-right">' + val.qty + '</td>';
                        htmldata1 += '<td><a id="btndispatch' + key + '" href="javascript:void(0)" onclick=DeleteDispatchedQuantity(' + "'" + val.Rec_Id + "'" + ',' + "'" + val.item_id + "'" + ',' + "'" + val.Indent_no + "'" + ')><i style="font-size:12px" class="fa fa-trash text-red"></i></a></td>';
                        htmldata1 += '</tr>';
                    });
                    $('#tblDisplistByCart tbody').append(htmldata1);
                }
                else {
                    $("#txtlotno").val('New');
                }
            }
            else {
                MsgBox('Data not found....');
            }
        },
        complete: function (data) {
            $.each(data.responseJSON.ResultSet.Table, function (key, val) {
                key = key + 1;
                if (val.IsRejected == 'Y') {
                    $('#tblIndentRequestDetails tbody').find('tr:eq(' + key + ')').addClass('redrowcolor'); //.css('background-color', '#ff00003d');
                    $('#tblIndentRequestDetails tbody').find('tr:eq(' + key + ')').find('td:eq(9)').find('a').addClass('disabled');

                }
            });
        },
        error: function (response) {
            alert('Server Error...!');
            $('.nav a[href="#1b"]').tab('show');
        }
    });

}

function GetPreviousPendingLot(cartid, itemid, indentno, item_Name) {

    $('#tblPreviousPending tbody').empty();
    var url = config.baseUrl + "/api/warehouse/wh_IndentProcessQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.item_id = itemid;
    objBO.indent_no = indentno;
    objBO.CartId = cartid;
    objBO.Logic = "PreviousPending";
    objBO.login_id = Active.userId;
    objBO.warehouseCartId = Active.warehouseId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = ""; var identno = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#divPreviousPending").show();
                    $('#tblPreviousPending').show();
                    $("#seletedItem").text(item_Name);
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (identno != val.indent_no) {
                            htmldata += '<tr id=' + key + '>';
                            htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb">' + val.indent_no + '</td>';
                            htmldata += '</tr>';
                            identno = val.indent_no;
                        }
                        key = key + 1;
                        htmldata += '<tr id=' + key + '>';
                        htmldata += '<td style="display:none">' + val.indent_no + '</td>';
                        htmldata += '<td>' + val.order_date + '</td>';
                        htmldata += '<td>' + val.item_id + '</td>';
                        htmldata += '<td>' + val.item_Name + '</td>';
                        htmldata += '<td class="text-right">' + val.wh_stock + '</td>';
                        htmldata += '<td class="text-right">' + val.cart_stocks + '</td>';
                        htmldata += '<td class="text-right">' + val.order_qty + '</td>';
                        htmldata += '<td class="text-right">' + val.verify_qty + '</td>';
                        htmldata += '<td class="text-right">' + val.pend_qty + '</td>';
                        htmldata += '<td><a href="javascript:void(0)" id="btnReplacePrePend' + key + '" onclick="OpenToReplace(' + "'" + val.item_id + "'" + ',' + "'" + val.indent_no + "'" + ',' + "'" + val.item_Name.replace('"', '') + "'" + ',' + "'PendingTable'" + ',' + "this.id" + ')"><i class="fa fa-edit fa-lg  text-red"></i></a>' +
                            ' || <a href="javascript:void(0)" id="btnPreviousPending' + key + '" onclick="GetWarehouseStock(' + "'" + key + "'" + ',' + "'" + val.item_id + "'" + ',' + "'" + val.pend_qty + "'" + ',' + "'" + val.auto_id + "'" + ',' + "'" + val.indent_no + "'" + ',' + "this.id" + ',' + "'" + val.CartId + "'" + ',' + "'" + val.item_Name.replace('"', '') + "'" + ',' + "'PreviousIndent'" + ')"><i class="fa fa-arrow-circle-o-right fa-lg text-green"></i></a></td>';

                        htmldata += '</tr>';
                    });
                    $('#tblPreviousPending tbody').append(htmldata);
                }
                else {
                    $("#seletedItem").text('');
                }
            }
            else {
                MsgBox('Data not found....');
            }
        },
        complete: function (data) {
            $.each(data.responseJSON.ResultSet.Table, function (key, val) {
                key = key + 1;
                if (val.IsRejected == 'Y') {
                    $('#tblPreviousPending tbody').find('tr:eq(' + key + ')').addClass('redrowcolor'); //.css('background-color', '#ff00003d');
                    $('#tblPreviousPending tbody').find('tr:eq(' + key + ')').find('td:eq(9)').find('a').addClass('disabled');

                }
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}

function GetWarehouseStock(key, itemid, Pend_qty, autoid, indentono, btnid, cartid, item_Name, logic) {
    $('#tblWarehouseStock tbody').empty();
    $('#hidIndentnolog').val(indentono);
    $('#hiditemlog').val(itemid);
    if (itemid != "" && typeof itemid != 'undefined') {

        var url = config.baseUrl + "/api/warehouse/wh_IndentStockQueries";
        var WhStockByItemIddBo = {};
        WhStockByItemIddBo.hosp_id = Active.unitId;
        WhStockByItemIddBo.item_id = itemid;
        WhStockByItemIddBo.warehouseCartId = Active.warehouseId;
        WhStockByItemIddBo.prm_1 = indentono;
        WhStockByItemIddBo.Logic = "WareHouseStock";
        WhStockByItemIddBo.login_id = Active.userId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(WhStockByItemIddBo),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                var htmldata = "";
                $("#btnlotTransfer").show();
                if (Object.keys(data.ResultSet).length > 0) {
                    $("#hidautoIdIndent").val(autoid);
                    $("#txtpendqty").val('');
                    var Pending_Qty = $('table tbody').find('tr.selected').find('td:eq(8)').text();
                    $("#txtpendqty").val(Pending_Qty);
                    if (Object.keys(data.ResultSet.Table).length > 0) {
                        $.each(data.ResultSet.Table, function (key, val) {
                            htmldata += '<tr>';
                            htmldata += '<td>' + val.mfd_name + '</td>';
                            htmldata += '<td>' + val.batch_no + '</td>';
                            htmldata += '<td>' + val.exp_date + '</td>';
                            htmldata += '<td>' + val.pack_type + '</td>';
                            htmldata += '<td class="text-right">' + val.qty + '</td>';
                            htmldata += '<td><input style="height:20px;width:50px;padding:2px" type="text" id="txteditqty" class="form-control" autocomplete="off" /></td>';
                            htmldata += '<td><a id="btndispatch' + key + '" href="javascript:void(0)" onclick=DispatchQuantity(' + "'" + val.item_id + "'" + ',' + "'" + val.master_key_id + "'" + ',' + "'" + autoid + "'" + ',' + "'" + indentono + "'" + ',' + "this.id" + ')><i class="fa fa-arrow-circle-o-left fa-lg text-green"></i></a></td>';
                            htmldata += '</tr>';
                        });
                        $('#tblWarehouseStock tbody').append(htmldata);
                    }
                    if (Object.keys(data.ResultSet.Table1).length > 0) {
                        var userremark = data.ResultSet.Table1[0].user_remark;
                        if (userremark != "" && typeof userremark != 'undefined') {
                            $("#divUserRemark").show();
                            $("#spnUserRemark").html(data.ResultSet.Table1[0].user_remark)
                        }
                        else {
                            $("#divUserRemark").hide();
                            $("#spnUserRemark").text('');
                        }
                    }
                    else {
                        $("#divUserRemark").hide();
                        $("#spnUserRemark").text('');
                    }
                }
                else {
                    MsgBox('Data not found....');
                }

            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }

    if (logic == "CurrentIndent") {
        var ino = $("#" + btnid).closest('tr').attr('id');
        $("#tblIndentRequestDetails tbody tr").each(function () {
            var classname = $(this).attr('class');
            if (classname != 'redrowcolor') {
                $('#tblIndentRequestDetails tbody tr').removeClass('selected');
            }
        });
        $('#tblIndentRequestDetails tbody').find('tr:eq(' + ino + ')').addClass('selected');
        $("#hidrowid").val(ino);
        $("#tblIndentRequestDetails").val(indentono);
        GetPreviousPendingLot(cartid, itemid, indentono, item_Name)
        $("#hidUpdatecellflag").val("Currentflag");
    }
    else {
        var ino = $("#" + btnid).closest('tr').attr('id');
        $("#tblPreviousPending tbody tr").each(function () {
            var classname = $(this).attr('class');
            if (classname != 'redrowcolor') {
                $('#tblPreviousPending tbody tr').removeClass('selected');
            }
        });
        $('#tblIndentRequestDetails tbody tr').removeClass('selected');
        $('#tblPreviousPending tbody').find('tr:eq(' + ino + ')').addClass('selected');
        $("#hidrowid").val(ino);
        $("#tblPreviousPending").val(indentono);
        $("#hidUpdatecellflag").val("Previousflag");
    }
}

function DispatchQuantity(itemid, masterkeyid, autoid, indentno, btnid) {
    
    flag = 1;
    var trfqty = "0";
    var WhDispatchOrderBo = {};
    var txtpenqty = $("#txtpendqty").val();
    $('#' + btnid).closest('tr').attr("style", "background-color:#eeeeea;color:#000000;font-weight:500;");
    var txteditqty = $("#" + btnid).closest('tr').find('input').val();
    var stcokqty = $("#" + btnid).closest('tr').find('td:nth-child(5)').text();

    if (parseInt(txteditqty) > parseInt(stcokqty)) {
        alert("Edit quantity can not be more than stock quantity");
        return false;
    }
    if (parseInt(stcokqty) > parseInt(txtpenqty)) {
        trfqty = parseInt(txtpenqty);
    }
    if (parseInt(stcokqty) <= parseInt(txtpenqty)) {
        trfqty = parseInt(stcokqty);
    }
    if (txteditqty != "" && parseInt(txteditqty) <= parseInt(stcokqty) && parseInt(txteditqty) < parseInt(txtpenqty)) {
        trfqty = parseInt(txteditqty);
    }
    if (parseInt(trfqty) <= 0) {
        alert("Zero or negative entry not allowed");
        return false;
    }

    var url = config.baseUrl + "/api/warehouse/wh_DispatchStock";
    WhDispatchOrderBo.lot_no = $("#txtlotno").val();
    WhDispatchOrderBo.master_key_id = masterkeyid;
    WhDispatchOrderBo.qty = trfqty;
    WhDispatchOrderBo.trf_to = $("#hidCartIdForAllUse").val(); //$('#ddlCart :selected').val();
    WhDispatchOrderBo.mfd_id = "-";
    WhDispatchOrderBo.comp_code = "";
    WhDispatchOrderBo.trf_from = Active.warehouseId;
    WhDispatchOrderBo.indent_no = indentno;
    WhDispatchOrderBo.indent_autoId = autoid;
    WhDispatchOrderBo.login_id = Active.userId;
    WhDispatchOrderBo.Logic = "Dispatch";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(WhDispatchOrderBo),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                $("#txtlotno").val('');
                var splitdata = data.split('|');
                $("#txtlotno").val(splitdata[1]);
                //var cid = $('#ddlCart :selected').val();
                ShowTransferQuantity($("#txtlotno").val(), itemid, autoid, indentno);
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

function ShowTransferQuantity(lotno, itemid, autoid, indentno) {
    $('#tblDisplistByCart tbody').empty();
    var WhTrasQtyBo = {};
    WhTrasQtyBo.lot_no = lotno;
    WhTrasQtyBo.item_id = itemid;
    WhTrasQtyBo.indent_no = indentno;
    WhTrasQtyBo.Logic = "GetDispatchedQuantity";
    WhTrasQtyBo.warehouseCartId = Active.warehouseId;
    var url = config.baseUrl + "/api/warehouse/wh_DispatchedQuery";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(WhTrasQtyBo),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            var htmldata1 = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#divDispListByCart").show();
                    $.each(data.ResultSet.Table, function (key, val) {
                        htmldata += '<tr>';
                        htmldata += '<td>' + val.item_name + '</td>';
                        htmldata += '<td>' + val.batch_no + '</td>';
                        htmldata += '<td>' + val.exp_date + '</td>';
                        htmldata += '<td>' + val.pack_type + '</td>';
                        htmldata += '<td class="text-right">' + val.pack_qty + '</td>';
                        htmldata += '<td class="text-right">' + val.qty + '</td>';
                        htmldata += '<td><a id="btndispatch' + key + '" href="javascript:void(0)" onclick=DeleteDispatchedQuantity(' + "'" + val.Rec_Id + "'" + ',' + "'" + val.item_id + "'" + ',' + "'" + val.indent_no + "'" + ')><i style="font-size:12px" class="fa fa-trash text-red"></i></a></td>';
                        htmldata += '</tr>';
                    });
                    $('#tblDisplistByCart tbody').append(htmldata);
                }
                else {
                    $('#tblDisplistByCart').show();
                    $('#tblDisplistByCart tbody').empty();
                }

                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $('#tblWarehouseStock').show();
                    $('#tblWarehouseStock tbody').empty();
                    $.each(data.ResultSet.Table1, function (key, val) {
                        htmldata1 += '<tr>';
                        htmldata1 += '<td>' + val.mfd_name + '</td>';
                        htmldata1 += '<td>' + val.batch_no + '</td>';
                        htmldata1 += '<td>' + val.exp_date + '</td>';
                        htmldata1 += '<td>' + val.pack_type + '</td>';
                        htmldata1 += '<td class="text-right">' + val.qty + '</td>';
                        htmldata1 += '<td><input style="height:20px;width:50px;padding:2px" type="text" id="txteditqty" class="form-control" autocomplete="off" /></td>';
                        htmldata1 += '<td><a id="btndispatch' + key + '" href="javascript:void(0)" onclick=DispatchQuantity(' + "'" + val.item_id + "'" + ',' + "'" + val.master_key_id + "'" + ',' + "'" + autoid + "'" + ',' + "'" + indentno + "'" + ',' + "this.id" + ')><i class="fa fa-arrow-circle-o-left fa-lg text-green"></i></a></td>';
                        htmldata1 += '</tr>';
                    });
                    $('#tblWarehouseStock tbody').append(htmldata1);
                }
                else {
                    $('#tblWarehouseStock').show();
                    $('#tblWarehouseStock tbody').empty();
                }

                if (Object.keys(data.ResultSet.Table3).length > 0) {
                    $("#txtpendqty").val(data.ResultSet.Table3[0].pend_qty);
                }

                if ($("#hidUpdatecellflag").val() == "Currentflag") {
                    
                    if (Object.keys(data.ResultSet.Table3).length > 0) {
                        var rowId = $("#hidrowid").val();
                        $('#tblIndentRequestDetails tbody').find('tr:eq(' + rowId + ')').find('td:eq(8)').text(data.ResultSet.Table3[0].pend_qty);
                    }
                    if (Object.keys(data.ResultSet.Table4).length > 0) {
                        var rowId = $("#hidrowid").val();
                        $('#tblIndentRequestDetails tbody').find('tr:eq(' + rowId + ')').find('td:eq(4)').text(data.ResultSet.Table4[0].wh_stock);
                    }

                }
                else {
                    
                    if (Object.keys(data.ResultSet.Table3).length > 0) {
                        var rowId = $("#hidrowid").val();
                        $('#tblPreviousPending tbody').find('tr:eq(' + rowId + ')').find('td:eq(8)').text(data.ResultSet.Table3[0].pend_qty);
                    }
                    if (Object.keys(data.ResultSet.Table4).length > 0) {
                        var rowId = $("#hidrowid").val();
                        $('#tblPreviousPending tbody').find('tr:eq(' + rowId + ')').find('td:eq(4)').text(data.ResultSet.Table4[0].wh_stock);
                    }
                }
            }
            else {
                MsgBox('Data not found....');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function DeleteDispatchedQuantity(autoId, itemid, indentno) {
    var DeleteDispatchBo = {};
    var htmldata = ""; var htmldata1 = "";
    $('#tblWarehouseStock tbody').empty();
    $('#tblDisplistByCart tbody').empty();
    if (autoId != "" && autoId > 0 && typeof autoId != 'undefined') {
        var hidautoIdIndent = $("#hidautoIdIndent").val();
        var url = config.baseUrl + "/api/warehouse/wh_DeleteDispatch";
        DeleteDispatchBo.auto_id = autoId;
        DeleteDispatchBo.item_id = itemid;
        DeleteDispatchBo.indent_no = indentno;
        DeleteDispatchBo.fromIndent = "Y";
        DeleteDispatchBo.CartId = $("#hidCartIdForAllUse").val(); //$("#ddlCart option:selected").val();
        DeleteDispatchBo.warehouseCartId = Active.warehouseId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(DeleteDispatchBo),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (Object.keys(data.ResultSet).length > 0) {
                    if (Object.keys(data.ResultSet.Table).length > 0) {
                        alert(data.ResultSet.Table[0].Msg);
                    }

                    if (Object.keys(data.ResultSet.Table1).length > 0) {
                        $.each(data.ResultSet.Table1, function (key, val) {
                            htmldata1 += '<tr>';
                            htmldata1 += '<td>' + val.mfd_name + '</td>';
                            htmldata1 += '<td>' + val.batch_no + '</td>';
                            htmldata1 += '<td>' + val.exp_date + '</td>';
                            htmldata1 += '<td>' + val.pack_type + '</td>';
                            htmldata1 += '<td class="text-right">' + val.qty + '</td>';
                            htmldata1 += '<td><input style="height:20px;width:50px;padding:2px" type="text" id="txteditqty" class="form-control" autocomplete="off" /></td>';
                            htmldata1 += '<td><a id="btndispatch' + key + '" href="javascript:void(0)" onclick=DispatchQuantity(' + "'" + val.item_id + "'" + ',' + "'" + val.master_key_id + "'" + ',' + "'" + hidautoIdIndent + "'" + ',' + "'" + indentno + "'" + ',' + "this.id" + ')><i class="fa fa-arrow-circle-o-left fa-lg text-green"></i></a></td>';
                            htmldata1 += '</tr>';
                        });
                        $('#tblWarehouseStock tbody').append(htmldata1);
                    }

                    if (Object.keys(data.ResultSet.Table3).length > 0 > 0) {
                        $('#tblIndentRequestDetails tbody tr').each(function () {
                            if ($(this).find('td:eq(2)').text() == itemid && $(this).find('td:eq(0)').text() == indentno) {
                                $(this).closest('tr').find('td:eq(8)').text(data.ResultSet.Table3[0].pend_qty);
                            }
                        });
                        $('#tblPreviousPending tbody tr').each(function () {
                            if ($(this).find('td:eq(2)').text() == itemid && $(this).find('td:eq(0)').text() == indentno) {
                                $(this).closest('tr').find('td:eq(8)').text(data.ResultSet.Table3[0].pend_qty);
                            }
                        });
                        $("#txtpendqty").val(data.ResultSet.Table3[0].pend_qty);
                    }

                    if (Object.keys(data.ResultSet.Table4).length > 0) {
                        $.each(data.ResultSet.Table4, function (key, val) {
                            $("#txtlotno").val(val.lot_no);
                            htmldata += '<tr>';
                            htmldata += '<td>' + val.item_name + '</td>';
                            htmldata += '<td>' + val.batch_no + '</td>';
                            htmldata += '<td>' + val.exp_date + '</td>';
                            htmldata += '<td>' + val.pack_type + '</td>';
                            htmldata += '<td class="text-right">' + val.pack_qty + '</td>';
                            htmldata += '<td class="text-right">' + val.qty + '</td>';
                            htmldata += '<td><a id="btndispatch' + key + '" href="javascript:void(0)" onclick=DeleteDispatchedQuantity(' + "'" + val.Rec_Id + "'" + ',' + "'" + val.item_id + "'" + ',' + "'" + val.Indent_no + "'" + ')><i style="font-size:12px" class="fa fa-trash text-red"></i></a></td>';
                            htmldata += '</tr>';
                        });
                        $('#tblDisplistByCart tbody').append(htmldata);
                    }
                    if (Object.keys(data.ResultSet.Table5).length > 0) {
                        $('#tblIndentRequestDetails tbody tr').each(function () {
                            if ($(this).find('td:eq(2)').text() == itemid && $(this).find('td:eq(0)').text() == indentno) {
                                $(this).closest('tr').find('td:eq(4)').text(data.ResultSet.Table5[0].wh_stock);
                            }
                        });

                        $('#tblPreviousPending tbody tr').each(function () {
                            if ($(this).find('td:eq(2)').text() == itemid && $(this).find('td:eq(0)').text() == indentno) {
                                $(this).closest('tr').find('td:eq(4)').text(data.ResultSet.Table5[0].wh_stock);
                            }
                        });
                    }
                }
                else {
                    MsgBox('Data not found....');
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}

function CompleteDispatched(lotno) {

    var CompDispatchBo = {};
    if (lotno != "" && typeof lotno != 'undefined') {
        var url = config.baseUrl + "/api/warehouse/wh_CompleteDispatch";
        CompDispatchBo.lot_no = $("#txtlotno").val();
        CompDispatchBo.login_id = Active.userId;
        CompDispatchBo.Logic = "Dispatch";
        if (confirm("Are you sure to complete Dispatch?")) {
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(CompDispatchBo),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    $("#txtlotno").val('New');
                    var Indentno = $('#hidIndentno').val();
                    var cid = $('#hidCartIdForAllUse').val();
                    $("#hidShowtab").val("1");
                    GetRequestDetailsAndCartPendingLot(Indentno, cid);
                },
                error: function (response) {
                    alert('Server Error...!');
                }
            });
        }
    }
}

function OpenToReplace(ItemId, indentNo, ItemName, tableSource, btnid) {
    $("#hidoldItemId").val('');
    $("#hidoldIndentno").val('');
    $("#hidTablename").val('');
    _IndentNo = indentNo;
    _ItemId = ItemId;
    _tableSource = tableSource;
    _ButtonSourceId = btnid;
    var ino = $("#" + btnid).closest('tr').attr('id');
    $('#tblIndentRequestDetails tbody tr').removeClass('selected');
    $('#tblIndentRequestDetails tbody').find('tr:eq(' + ino + ')').addClass('selected');
    $("#hidrowid").val(ino);
    $('#myModal').modal('show');
    $("#elProductName").html(ItemName + '[' + ItemId + ']');
    $("#hidoldItemId").val(ItemId);
    $("#hidoldIndentno").val(indentNo);
    $("#hidTablename").val(tableSource);
}

function UpdateVerifyQuantity() {
    var objBO = {};
    var VerifyQty = $("#txtVqty").val();
    var VerifyRemark = $("#txtVRemark").val();
    var selectecitemid = $("#ddlProduct option:selected").val();

    if (VerifyQty == "") {
        alert('Please enter verify quantity');
        return false;
    }
    if (VerifyRemark == "") {
        alert('Please enter verify remark');
        return false;
    }

    if (typeof selectecitemid == 'undefined') {
        objBO.NewItemId = "-";
    }
    else {
        objBO.NewItemId = selectecitemid;
    }
    var url = config.baseUrl + "/api/warehouse/wh_IndentReplaceAndUpdateQty";
    objBO.Indent_no = $("#hidoldIndentno").val();
    objBO.Item_id = $("#hidoldItemId").val();
    objBO.verifyQty = VerifyQty;
    objBO.remark = VerifyRemark;
    objBO.loginid = Active.userId;
    objBO.Logic = "UpdateVerifyQty";
    objBO.warehouseCartId = Active.warehouseId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                $("#txtpendqty").val(VerifyQty);
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    if (data.ResultSet.Table[0].Code == "1") {
                        alert(data.ResultSet.Table[0].Msg)
                        if ($("#hidTablename").val() == "CurrentTable") {
                            $('#tblIndentRequestDetails tbody tr').each(function () {
                                if ($(this).find('td:eq(2)').text() == objBO.Item_id && $(this).find('td:eq(0)').text() == objBO.Indent_no) {
                                    $(this).closest('tr').find('td:eq(7)').text(data.ResultSet.Table[0].verify_qty);
                                    $(this).closest('tr').find('td:eq(8)').text(data.ResultSet.Table[0].pend_qty);
                                }
                            });
                        }
                        else {
                            $('#tblPreviousPending tbody tr').each(function () {
                                if ($(this).find('td:eq(2)').text() == objBO.Item_id && $(this).find('td:eq(0)').text() == objBO.Indent_no) {
                                    $(this).closest('tr').find('td:eq(7)').text(data.ResultSet.Table[0].verify_qty);
                                    $(this).closest('tr').find('td:eq(8)').text(data.ResultSet.Table[0].pend_qty);
                                }
                            });
                        }
                        $("#hidoldItemId").val('');
                        $("#hidoldIndentno").val('');
                        $("#txtVqty").val('');
                        $("#txtVRemark").val('');
                        $('#myModal').modal('hide');
                    }
                    else {
                        alert(data.ResultSet.Table[0].Msg);
                        return false;
                    }
                }
                else {
                    alert('Failed: Verify quantity not updated');
                    return false;
                }
            }
            else {
                MsgBox('Data not found....');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function SearchProduct() {
    var objBO = {};
    var productname = $("#txtSearchProduct").val();
    if (productname == "") {
        alert("Please enter product name");
        return false;
    }
    var url = config.baseUrl + "/api/warehouse/wh_IndentProcessQueries";
    objBO.Logic = "LoadProduct";
    objBO.prm_1 = productname;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlProduct").empty();
                    $("#ddlProduct").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlProduct").append($("<option></option>").val(value.item_id).html(value.item_name));
                    });
                }
            }
            else {
                //bind data
            }


        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function UpdateAndReplaceIndent() {
    var objBO = {};
    var VerifyQty = "0";
    var VerifyRemark = "-";
    var newItemId = $("#ddlProduct option:selected").val();
    if (newItemId == "0" || typeof newItemId == 'undefined') {
        alert('Please select product name');
        return false;
    }
    
    var url = config.baseUrl + "/api/warehouse/wh_IndentReplaceAndUpdateQty";
    objBO.NewItemId = newItemId;
    objBO.Indent_no = $("#hidoldIndentno").val();
    objBO.Item_id = $("#hidoldItemId").val();
    objBO.verifyQty = VerifyQty;
    objBO.remark = VerifyRemark;
    objBO.loginid = Active.userId;
    objBO.Logic = "ReplaceItem";
    objBO.warehouseCartId = Active.warehouseId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    if (data.ResultSet.Table[0].Code == "1") {
                        alert(data.ResultSet.Table[0].Msg);
                        if ($("#hidTablename").val() == "CurrentTable") {
                            $('#tblIndentRequestDetails tbody tr').each(function () {
                                if ($(this).find('td:eq(2)').text() == objBO.Item_id && $(this).find('td:eq(0)').text() == objBO.Indent_no) {
                                    $(this).closest('tr').find('td:eq(0)').text(objBO.Indent_no);
                                    $(this).closest('tr').find('td:eq(2)').text(data.ResultSet.Table[0].item_id);
                                    $(this).closest('tr').find('td:eq(3)').text(data.ResultSet.Table[0].item_Name);
                                    $(this).closest('tr').find('td:eq(4)').text(data.ResultSet.Table[0].wh_stock);
                                    $(this).closest('tr').find('td:eq(5)').text(data.ResultSet.Table[0].cart_stocks);
                                }
                            });
                        }
                        else {
                            $('#tblPreviousPending tbody tr').each(function () {
                                if ($(this).find('td:eq(2)').text() == objBO.Item_id && $(this).find('td:eq(0)').text() == objBO.Indent_no) {
                                    $(this).closest('tr').find('td:eq(0)').text(objBO.Indent_no);
                                    $(this).closest('tr').find('td:eq(2)').text(data.ResultSet.Table[0].item_id);
                                    $(this).closest('tr').find('td:eq(3)').text(data.ResultSet.Table[0].item_Name);
                                    $(this).closest('tr').find('td:eq(4)').text(data.ResultSet.Table[0].wh_stock);
                                    $(this).closest('tr').find('td:eq(5)').text(data.ResultSet.Table[0].cart_stocks);
                                }
                            });
                        }
                        $("#hidoldItemId").val('');
                        $("#hidoldIndentno").val('');
                        $("#txtSearchProduct").val('');
                        $("#ddlProduct").prop('selectedIndex', '0');
                        $('#myModal').modal('hide');
                    }
                    else {
                        alert(data.ResultSet.Table[0].Msg);
                        return false;
                    }
                }
                else {
                    alert('Product not replaced successfully');
                    return false;
                }
            }
            else {
                MsgBox('Data not found....');
            }


        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function RejectQuantity() {

    var objBO = {};
    var url = config.baseUrl + "/api/warehouse/wh_IndentReplaceAndUpdateQty";
    var remark = $("#txtRejectRemark").val();
    if (remark == "") {
        alert('Please enter rejected remark');
        return false;
    }
    objBO.NewItemId = '-';
    objBO.Indent_no = $("#hidoldIndentno").val();
    objBO.Item_id = $("#hidoldItemId").val();
    objBO.verifyQty = "0";
    objBO.remark = remark;
    objBO.loginid = Active.userId;
    objBO.Logic = "Reject";
    objBO.warehouseCartId = Active.warehouseId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    if (data.ResultSet.Table[0].Code == "1") {
                        alert(data.ResultSet.Table[0].Msg);
                        $("#hidoldItemId").val('');
                        $("#hidoldIndentno").val('');
                        $("#txtRejectRemark").val('');
                        $('#myModal').modal('hide');
                    }
                    else {
                        alert(data.ResultSet.Table[0].Msg);
                        return false;
                    }
                }
                else {
                    alert('Quantity not rejected');
                    return false;
                }
            }
            else {
                MsgBox('Data not found....');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function ShowDisptachIndentLog() {
    var objBO = {};
    $("#tblDispatchLogIndent tbody").empty();
    $("#pIndentItem").text('');
    var url = config.baseUrl + "/api/warehouse/wh_IndentProcessQueries";
    objBO.item_id = $("#hiditemlog").val();
    objBO.indent_no = $("#hidIndentnolog").val();
    objBO.Logic = "DispatchLogOfIndent";
    objBO.warehouseCartId = Active.warehouseId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#pIndentItem").text("Indent No: " + data.ResultSet.Table[0].indent_no + " Item Id: " + data.ResultSet.Table[0].item_id);
                    $.each(data.ResultSet.Table, function (key, val) {
                        htmldata += '<tr>';
                        htmldata += '<td>' + val.lot_date + '</td>';
                        htmldata += '<td>' + val.lot_no + '</td>';
                        htmldata += '<td>' + val.qty + '</td>';
                        htmldata += '</tr>';
                    });
                    $('#tblDispatchLogIndent tbody').append(htmldata);
                }
            }
            else {
                MsgBox('Data not found....');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}




