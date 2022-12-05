$(document).ready(function () {
    $("#tblShowdispatchedlist").hide();
    GetCartListByLoginId();
    $("#btnDispDetails").click(function () {
        SearchDispatchedItem();
    });
    $("#btnPrint").click(function () {
        var hidlot = $("#hidlotno").val();
        if (hidlot != "" && typeof hidlot != 'undefined') {
            PrintDispatch(hidlot);
        }
    });

    FillCurrentDate("txtFromDate");
    FillCurrentDate("txtToDate");
});

function GetCartListByLoginId() {
    var url = config.baseUrl + "/api/warehouse/wh_IndentQueries";
    var objIdentBO = {};
    objIdentBO.login_id = Active.userId;
    objIdentBO.indent_no = '-';
    objIdentBO.from = '1900/01/01';
    objIdentBO.to = '1900/01/01';
    objIdentBO.Logic = "GetAllCartList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objIdentBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("ddlCartList").empty();
                $("#ddlCartList").append($("<option></option>").val("ALL").html("ALL"));
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

function SearchDispatchedItem() {
    var FrDate = Properdate($("#txtFromDate").val(), '-');
    var ToDate = Properdate($("#txtToDate").val(), '-');
    var CartId = $('#ddlCartList :selected').val();
    if (FrDate == "") {
        alert('Please select from date');
        return false;
    }
    if (ToDate == "") {
        alert('Please select to date');
        return false;
    }
    if (CartId == "0") {
        alert('Please select cart Id');
        return false;
    }
    var DispatchedBo = {};
    DispatchedBo.FromDate = FrDate;
    DispatchedBo.ToDate = ToDate;
    DispatchedBo.CartId = CartId;
    DispatchedBo.Logic = "DispatchedDetailsForPrint";

    var url = config.baseUrl + "/api/warehouse/wh_PrintDispatchedDetails";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(DispatchedBo),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            var ctname = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblDisptchedLot').show();
                $('#tblDisptchedLot tbody').empty();
                $('#tblShowdispatchedlist tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    if (ctname != val.CartName) {
                        htmldata += '<tr style="background:#cbe9ff">';
                        htmldata += '<td colspan="2" style="font-weight:bold">' + val.CartName + '</td>';
                        htmldata += '</tr>';
                        ctname = val.CartName;
                    }
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.lot_no + '</td>';
                    htmldata += '<td>' + val.lot_date + '</td>';
                    htmldata += '<td>' + val.no_of_item + '</td>';
                    htmldata += '<td><button class="btn-success btn-flat" id="btnPrint' + key + '" onclick=selectRow(this);ShowDispatch(' + "'" + val.lot_no + "'" + ')>View</button></td>';
                    //htmldata += '<td><a id="btnPrint' + key + '" href="javascript:void(0)" onclick=ShowDispatch(' + "'" + val.lot_no + "'" + ')><i style="font-size:12px" class="fa fa-eye fa-lg text-orange"></i></a></td>';
                    htmldata += '</tr>';
                });
                $('#tblDisptchedLot tbody').append(htmldata);
            }
            else {
                $('#tblDisptchedLot').show();
                $('#tblDisptchedLot tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblDisptchedLot tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function ShowDispatch(lot_no) {
    
    if (lot_no != "" && typeof lot_no != 'undefined') {
        var DiaptchBO = {};
        var url = config.baseUrl + "/api/warehouse/wh_PrintDispatchedByLotNo";
        DiaptchBO.lot_no = lot_no;
        DiaptchBO.Logic = "PrintDispatchedByLotNo";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(DiaptchBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                
                $("#tblShowdispatchedlist").show();
                $("#tblShowdispatchedlist tbody").empty();
                var htmldata = "";
                if (data.ResultSet.Table.length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#hidlotno").val('');
                        $("#hidlotno").val(val.lot_no);
                        htmldata += '<tr>';
                        htmldata += '<td>' + val.item_name + '</td>';
                        htmldata += '<td>' + val.hsn + '</td>';
                        //htmldata += '<td>' + val.lot_no + '</td>';
                        htmldata += '<td>' + val.master_key_id + '</td>';
                        htmldata += '<td>' + val.qty + '</td>';
                        htmldata += '</tr>';
                    });
                    $('#tblShowdispatchedlist tbody').append(htmldata);
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });

    }
}
function PrintDispatch(lotno) {
    var url = "../Print/PrintDispatch?LotNo=" + lotno;
    window.open(url, '_blank');
}
function PrintDispatchedByLotNo(lotno) {
    var DiaptchBO = {};
    var url = config.baseUrl + "/api/warehouse/wh_PrintDispatchedByLotNo";
    DiaptchBO.lot_no = lotno;
    DiaptchBO.Logic = "PrintDispatchedByLotNo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(DiaptchBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("tblprintdispatchedlist").empty();
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.item_name + '</td>';
                    htmldata += '<td>' + val.hsn + '</td>';
                    htmldata += '<td>' + val.lot_no + '</td>';
                    htmldata += '<td>' + val.master_key_id + '</td>';
                    htmldata += '<td>' + val.qty + '</td>';
                    htmldata += '</tr>';
                });
                $('#tblprintdispatchedlist tbody').append(htmldata);

                $("#lblfromCart").html(data.ResultSet.Table1[0].FromCart);
                $("#lblToCart").html(data.ResultSet.Table1[0].ToCart);
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}



