var tcs = 0;
var billAmount = 0;
$(document).ready(function () {
    CloseSidebar();
    UnCompletePurchases();
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblUnCompPurchase tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblUnCompPurchase tbody').on('click', '.getUnCompPurchase', function () {
        var purchaseId = $(this).data('pid');
        $('#tblUnCompPurchase tbody tr').removeClass('select-row');
        $(this).closest('tr').addClass('select-row');
        ViewUnCompletePurchase(purchaseId);
    });
    $('#chkTCS').on('change', function () {
        var IsCheck = $(this).is(':checked');
        var pId = $('#tblUnCompPurchase tbody').find('tr.select-row').find('td:eq(0)').text().trim();
        if (IsCheck) {
            CalculateTCS(pId)
        }
        else {
            $('#txtTCS').val(0);
            $('#tblPaymentDetails tbody tr').find('td:eq(8)').find('span').text(billAmount.toFixed(3));
        }
    });
});

function UnCompletePurchases() {
    var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
    var objBO = {};
    objBO.Logic = 'UnCompletePurchases';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                var str = "";
                var vendor = "";
                $('#tblUnCompPurchase tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    if (vendor != val.vendor_name) {
                        str += '<tr style="background:#d9eeff">';
                        str += '<td colspan="3"> ' + val.vendor_name + '</td>';
                        str += '</tr>';
                        vendor = val.vendor_name;
                    }
                    str += '<tr>';
                    str += '<td> ' + val.Purch_id + '</td>';
                    str += '<td> ' + val.Inv_No + '</td>';
                    str += '<td> ' + val.Inv_Date + '</td>';
                    str += '<td class="btn btn-success getUnCompPurchase" data-pId=' + val.Purch_id + '><i class="fa fa-check"></i></td>';
                    str += '</tr>';
                });
                $('#tblUnCompPurchase tbody').append(str);
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CalculateTCS(pId) {
    var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
    var objBO = {};
    objBO.purchId = pId;
    objBO.Logic = 'CalculateTCS';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $.each(data.ResultSet.Table, function (key, val) {
                tcs = val.TCSAmount;
                billAmount = val.bill_amount;
                $('#txtTCS').val(val.TCSAmount);
                $('#tblPaymentDetails tbody tr').find('td:eq(8)').find('span').text(eval(val.bill_amount) + eval(val.TCSAmount));
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ViewUnCompletePurchase(pId) {
    var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
    var objBO = {};
    objBO.purchId = pId;
    objBO.Logic = 'CurrentPurchaseRecords';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $('#txtTCS').val(0);
                $('input[id=chkTCS]').prop('checked', false);
                var str = "";
                $('#tblPurchaseEntry tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#txtPurchaseId').val(val.Purch_id);
                    str += "<tr>";
                    str += "<td>" + val.item_Name + "</td>";
                    str += "<td>" + val.tax_rate + "</td>";
                    str += "<td>" + val.Batch_No + "</td>";
                    str += "<td>" + val.Exp_Date + "</td>";
                    str += "<td>" + val.MRP + "</td>";
                    str += "<td>" + val.trade + "</td>";
                    str += "<td>" + val.npr + "</td>";
                    str += "<td>" + val.pack_type + "</td>";
                    str += "<td>" + val.Quantity + "</td>";
                    str += "<td>" + val.It_Free + "</td>";
                    str += "<td>" + val.DisPer + "</td>";
                    str += "<td>" + val.DisAmount + "</td>";
                    str += "<td>" + val.tax_amount + "</td>";
                    str += "<td>" + val.amount + "</td>";
                    str += "<td>" + val.mfd_name + "</td>";
                    str += "<td>" + val.HSN + "</td>";
                    str += "</tr>";
                });
                $('#tblPurchaseEntry tbody').append(str);
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('span[data-purchaseid]').text(pId);
                    $('.iname').text(val.pur_type);
                    $('span[data-invoice]').text(val.inv_no + '|' + val.inv_date);
                    $('span[data-ewaybillno]').text(val.eWayBillNo);
                    $('span[data-ewaybilldate]').text(val.eWayBillDate);
                    $('span[data-grntype]').text(val.pur_type);
                    $('span[data-supplier]').text(val.vendor_id);
                    $('span[data-igst]').text(val.IGST_AMT);
                    $('span[data-sgst]').text(val.SGST_AMT);
                    $('span[data-cgst]').text(val.CGST_AMT);
                    $('span[data-roundoff]').text(val.roundoff);
                    $('span[data-netamount]').text(val.netamount);
                    $('span[data-discount]').text(val.inv_discount);
                    $('span[data-tax]').text(val.inv_tax);
                    $('span[data-total]').text(val.inv_total);
                    var ba = parseFloat(val.inv_total) + parseFloat(val.inv_tax);
                    $('span[data-billamount]').text(ba);
                });
                $.each(data.ResultSet.Table2, function (key, val) {
                    $('#chkTCS').data('tcs', val.tcs);
                });
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function PurchasePosting() {
    pid = $('span[data-purchaseid]').text();
    if (pid != '') {
        if (confirm('Are you sure want to Post this Purchase...')) {
            var url = config.baseUrl + "/api/Warehouse/PurchasePosting";
            var objBO = {};
            objBO.Purch_id = $('span[data-purchaseid]').text();
            objBO.adj_amt = $('#txtTCS').val();
            objBO.plusminus = $('#chkTCS').data('tcs');
            objBO.credit_cash = '';
            objBO.login_id = Active.userId;
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(objBO),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data == 'Successfully Posted') {
                        alert(data);
                        $('#tblPurchaseEntry tbody').empty();
                        $('#tblPaymentDetails span').text('');
                        $('#BasicInfo span').text('');
                        UnCompletePurchases();
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
    else {
        alert('Please Choose Any Purchase...');
    }
}