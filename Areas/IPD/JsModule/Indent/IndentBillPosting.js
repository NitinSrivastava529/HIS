var _inv_no = '';
var selectedRow;
$(document).ready(function () {

});
function IndentBills() {
    $('#tblIndentBills tbody').empty();
    var url = config.PharmacyWebAPI_baseUrl + "/api/hospital/ipopqueries";
    var objBO = {};
    objBO.unit_id = 'MS-H0048';
    objBO.card_no = '-';
    objBO.uhid = '-';
    objBO.IPOPNo = $('#txtIPOPNo').val();;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.prm_1 = '-';
    objBO.Logic = 'Indent-Bills';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            $.each(data.result.Table, function (key, val) {
                if (val.ProcType == 'Completed')
                    tbody += "<tr style='background:#ffb5b5'>";
                else
                    tbody += "<tr>";

                tbody += "<td>" + val.sale_inv_no + "</td>";
                tbody += "<td>" + val.order_no + "</td>";
                tbody += "<td style='display:none'>" + val.info + "</td>";
                tbody += "<td class='text-right'>" + val.net + "</td>";
                tbody += "<td><button class='btn btn-warning btn-xs' onclick=selectRow(this);SetSelectedRow(this)><i class='fa fa-sign-in'></i></button></td>";
                tbody += "</tr>";
            });
            $('#tblIndentBills tbody').append(tbody);
            Clear();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SetSelectedRow(elem) {
    selectedRow = elem
    SalesInvoiceInfo();
}
function SalesInvoiceInfo() {
    
    $('#tblItemInfo tbody').empty();
    var url = config.PharmacyWebAPI_baseUrl + "/api/sales/GetSalesInvoice_Info";
    var objBO = {};
    objBO.unit_id = 'MS-H0048';
    objBO.Sales_Inv_No = $(selectedRow).closest('tr').find('td:eq(0)').text();
    objBO.order_no = $(selectedRow).closest('tr').find('td:eq(1)').text()
    objBO.logic = 'SalesInvoice';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            var tbody = "";
            var info = $(selectedRow).closest('tr').find('td:eq(2)').text().split('|');
            $('#txtUnitName').text(info[0]);
            $('#txtSaleInvNo').text(objBO.Sales_Inv_No);
            $('#txtOrderNo').text(objBO.order_no);
            $('#txtPatientName').text(info[1]);
            $('#txtAge').text(0);
            $('#txtIPOP').text(info[2]);
            $('#txtUHID').text(info[3]);
            $('#txtRefName').text(info[4]);
            $('#txtHealthCardNo').text(info[5]);
            $('#txtPanelName').text(info[6]);
            if (info[6].includes('CRPF-CREDIT')) {
                $('input[name=payMode]:eq(0)').prop('checked', true);
                $('input[name=payMode]:eq(1)').prop('disabled', true);
                $('input[name=payMode]:eq(2)').prop('disabled', true);
            } else {
                $('input[name=payMode]:eq(0)').prop('checked', false);
                $('input[name=payMode]:eq(0)').prop('disabled', true);
                $('input[name=payMode]:eq(1)').prop('checked', true);
                $('input[name=payMode]:eq(1)').prop('disabled', false);
                $('input[name=payMode]:eq(2)').prop('disabled', false);
            }

            $.each(data.result.Table, function (key, val) {
                $('#txtTotal').text(val.total);
                $('#txtDiscount').text(val.discount);
                $('#txtRoundOff').text(val.roundoff);
                $('#txtPayable').text(val.net);
            });
            $.each(data.result.Table1, function (key, val) {
                tbody += "<tr>";
                tbody += "<td>" + val.item_name + "</td>";
                tbody += "<td>" + val.master_key_id + "</td>";
                tbody += "<td>" + val.batch_no + "</td>";
                tbody += "<td>" + val.exp_date.split('T')[0] + "</td>";
                tbody += "<td class='text-right'>" + val.pack_type + "</td>";
                tbody += "<td class='text-right'>" + val.pack_qty + "</td>";
                tbody += "<td class='text-right'>" + val.mrp + "</td>";
                tbody += "<td class='text-right'>" + val.sv + "</td>";
                tbody += "<td class='text-right'>" + val.sale_qty + "</td>";
                tbody += "<td class='text-right'>" + val.usr.toFixed(2) + "</td>";
                tbody += "</tr>";
            });

            $.each(data.result.Table2, function (key, val) {
                if (val.ipd_rec_time != null) {
                    $("#btnPostBill").removeAttr('disabled');
                    $("#btnReceive").prop("disabled", true);
                }
                else {
                    $("#btnPostBill").prop("disabled", true); 
                    $("#btnReceive").removeAttr('disabled');
                 }
            });

            $('#tblItemInfo tbody').append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function MarkIndentReceived() {
    var url = config.PharmacyWebAPI_baseUrl + "/api/sales/GetSalesInvoice_Info";
    var objBO = {};
    objBO.unit_id = Active.userId;
    objBO.Sales_Inv_No = $('#txtSaleInvNo').text();
    objBO.order_no = $('#txtOrderNo').text();
    objBO.logic = 'MarkIndentReceived';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {

            SalesInvoiceInfo();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ViewBill() {
    if (_inv_no == '') {
        alert('Invoice No not Found.');
        return
    }
    var link = "../Print/SalesBill?InvoiceNo=" + _inv_no;
    window.open(link, '_blank');
}
function PostBill() {
    var unitName = $('#txtUnitName').text();
    if (unitName == '') {
        alert('Unit Name Not Found.');
        return
    }
    if ($('input[name=payMode]:eq(2)').is(':checked')) {
        var refNo = $('#txtRefNo').val();
        if (refNo == '') {
            alert('Please Provide Payment Ref. No.');
            $('#txtRefNo').css('border-color', 'red').focus();
            return
        }
        else {
            $('#txtRefNo').removeAttr('style');
        }
    }
    var url = config.PharmacyWebAPI_baseUrl + "/api/sales/SaleInvoiceFinalization";
    var objBO = {};
    objBO.unit_id = $('#txtUnitName').text();
    objBO.Sale_Inv_No = $('#txtSaleInvNo').text();
    objBO.gstn_no = '-';
    objBO.HealthCardNo = $('#txtHealthCardNo').text();
    objBO.Hosp_Cr_No = $('#txtUHID').text();
    objBO.Hosp_IPOP_No = $('#txtIPOP').text();
    objBO.rcmOrderNo = $('#txtOrderNo').text();
    objBO.hd_flag = 'N';
    objBO.refBy = '-';
    objBO.ref_name = $('#txtRefName').text();
    objBO.sale_type = 'Indent';
    objBO.payMode = $('input[name=payMode]:checked').val();
    objBO.payDetail = $('#txtRefNo').val();
    objBO.pt_name = $('#txtPatientName').text();
    objBO.counter_id = '-';
    objBO.computerName = '-';
    objBO.login_id = Active.userId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var prm = data.message.split(':')[1];
            _inv_no = prm;
            //alert('Success | ' + prm);
            alert(data.message);
            IndentBills();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Clear() {
    $('#txtTotal').text(0.00);
    $('#txtDiscount').text(0.00);
    $('#txtRoundOff').text(0.00);
    $('#txtPayable').text(0.00);

    $('#txtUnitName').text('');
    $('#txtSaleInvNo').text('');
    $('#txtOrderNo').text('');
    $('#txtPatientName').text('XXXXXXXXXXXX');
    $('#txtPanelName').text('XXXXXXXXXXXX');
    $('#txtIPOP').text('XXXXXXXXXXXX');
    $('#txtUHID').text('XXXXXXXXXXXX');
    $('#txtRefName').text('XXXXXXXXXXXX');
    $('#txtHealthCardNo').text('');
    $('#txtRefNo').val('');

    $('#tblItemInfo tbody').empty();
}