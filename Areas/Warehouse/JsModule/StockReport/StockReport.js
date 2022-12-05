$(document).ready(function () {
    CloseSidebar();
    GetCartDepartment();
    GetItem();

    $('#txtSearchItem').on('keyup', function () {
        
        var val = $(this).val().toLowerCase();
        $('#tblSock tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
});


function GetCartDepartment() {
    var url = config.baseUrl + "/api/warehouse/wh_IndentStockQueries";
    var objBOCartDept = {};
    objBOCartDept.hosp_id = Active.unitId;
    objBOCartDept.login_id = Active.userId;
    objBOCartDept.Logic = "GetCartAndDepartment";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBOCartDept),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("ddlCart").empty();
                $("#ddlCart").append($("<option></option>").val("0").html("Please Select"));
                $("#ddlCart").append($("<option></option>").val("ALL").html("ALL"));
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlCart").append($("<option></option>").val(value.CartId).html(value.CartName)).select2();
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetItem() {
    var url = config.baseUrl + "/api/warehouse/wh_IndentStockQueries";
    var objItemBO = {};
    objItemBO.hosp_id = Active.unitId;
    objItemBO.login_id = Active.userId;
    objItemBO.Logic = "GetItem";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objItemBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("ddlItem").empty();
                $("#ddlItem").append($("<option></option>").val("0").html("Please Select"));
                $("#ddlItem").append($("<option></option>").val("ALL").html("ALL"));
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlItem").append($("<option></option>").val(value.item_id).html(value.item_name)).select2();;
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetStock() {
    var url = config.baseUrl + "/api/warehouse/wh_IndentStockQueries";
    var objStockReportBO = {};
    var cartId = $('#ddlCart option:selected').val();
    var itemid = $('#ddlItem option:selected').val();
    if (cartId == "0") {
        alert("Please select Cart");
        return false;
    }
    if (itemid == "0") {
        alert("Please select item");
        return false;
    }
    objStockReportBO.CartId = cartId;
    objStockReportBO.item_id = itemid;
    objStockReportBO.hosp_id = Active.unitId;
    objStockReportBO.login_id = Active.userId;
    objStockReportBO.Logic = "StockReport";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objStockReportBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblSock').show();
                $('#tblSock tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.CartName + '</td>';
                    htmldata += '<td>' + val.item_name + '</td>';
                    htmldata += '<td>' + val.mfd_name + '</td>';
                    htmldata += '<td>' + val.batch_no + '</td>';
                    htmldata += '<td>' + val.exp_date + '</td>';
                    htmldata += '<td>' + val.pack_type + '</td>';
                    htmldata += '<td class="text-right">' + val.pack_qty + '</td>';
                    htmldata += '<td class="text-right">' + val.qty + '</td>';
                    htmldata += '<td class="text-right">' + val.amount + '</td>';
                    htmldata += '</tr>';
                });
                $('#tblSock tbody').append(htmldata);
            }
            else {
                $('#tblSock').show();
                $('#tblSock tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblSock tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ExcelToDataTable() {
    var url = config.baseUrl + "/api/Admin/UploadPanelRates";
    var objStockReportBO = {};
    objStockReportBO.Logic = "StockReport";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objStockReportBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DownloadExcel() {
    
    var url = config.baseUrl + "/api/warehouse/DownloadStockReport";
    var objStockReportBO = {};
    var cartId = $('#ddlCart option:selected').val();
    var itemid = $('#ddlItem option:selected').val();
    if (cartId == "0") {
        alert("Please select Cart");
        return false;
    }
    if (itemid == "0") {
        alert("Please select item");
        return false;
    }
    objStockReportBO.CartId = cartId;
    objStockReportBO.item_id = itemid;
    objStockReportBO.hosp_id = Active.unitId;
    objStockReportBO.login_id = Active.userId;
    objStockReportBO.Logic = "StockReport";
    Global_DownloadExcel(url, objStockReportBO, "StockReport.xlsx");
}