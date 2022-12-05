var _BillNo = "";
$(document).ready(function () {
    SummarisedBilling();
    $('#dash-dynamic-section').find('label.title').text('Billing Finalization').show();
    $('select').select2();
});
function SummarisedBilling() {
    $('#tblPaymentInfo tbody').empty();
    $('#tblGenerateBillInfo tbody').empty();
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingQuerries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.DoctorId = '';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'SummarisedBillWithAdvances';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtGrossAmt').val(val.GrossAmount.toFixed(2));
                        $('#txtPDiscount').val(val.panel_discount.toFixed(2));
                        $('#txtAdlDiscount').val(val.adl_discount.toFixed(2));
                        $('#txtDiscount').val(val.Discount.toFixed(2));
                        $('#txtNetAmt').val(val.NetAmount.toFixed(2));
                        $('#txtAdvanceAmt').val(val.AdvanceAmount.toFixed(2));
                        $('#txtBalanceAmt').val(val.BalanceAmount.toFixed(2));
                        $('#txtApprovalAmt').val(val.ApprovalAmount.toFixed(2));
                    });
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbody1 = '';
                    var count = 0;
                    var temp = "";
                    $.each(data.ResultSet.Table1, function (key, val) {
                        count++;
                        _BillNo = val.BillNo;
                        if (val.IsBillClosed=='Y')
                            $('#btnSaveApproval,#btnCloseBill').prop('disabled', true);
                        else
                            $('#btnSaveApproval,#btnCloseBill').prop('disabled', false);

                        $('#txtPanelApprovalAmount').val(val.PanelApprovedAmount);
                        $('#txtCoPayment').val(val.CoPayAmount);
                        if (val.IsBillClosed == 'Y')
                            tbody1 += "<tr class='bg-success'>";
                        else
                            tbody1 += "<tr>";

                        tbody1 += "<td>" + val.BillingType + "</td>";
                        tbody1 += "<td>" + val.BillNo + "</td>";
                        tbody1 += "<td class='text-right'>" + val.TotalAmount + "</td>";
                        tbody1 += "<td class='text-right'>" + val.PanelDiscount + "</td>";
                        tbody1 += "<td class='text-right'>" + val.AdlDiscount + "</td>";
                        tbody1 += "<td class='text-right'>" + val.TotalDiscount + "</td>";
                        tbody1 += "<td class='text-right'>" + val.NetAmount + "</td>";
                        tbody1 += "<td class='text-right'>" + val.roundoff + "</td>";
                        tbody1 += "<td class='text-right'>" + val.NetPayable + "</td>";
                        tbody1 += "</tr>";
                    });
                    $('#tblGenerateBillInfo tbody').append(tbody1);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Receipt_IPDBillSummary() {
    var url = "../Print/IPDBillSummary?_BillNo=" + _BillNo +"&_IPDNo="+_IPDNo;
    window.open(url, '_blank');
}
function Receipt_IPDDischargeReport() {
    var url = "../Print/IPDDischargeReport?_IPDNo=" + _IPDNo;
    window.open(url, '_blank');
}
function GenerateBill() {
    if (confirm('Are you sure to Submit?')) {
        var url = config.baseUrl + "/api/IPDNursingService/IPD_GenerateBill";
        var objBO = {};
        objBO.IPDNo = _IPDNo;
        objBO.BillingType = $('input[name=billing-type]:checked').val();
        objBO.Remark = $('#txtRemark').val();
        objBO.login_id = Active.userId;
        objBO.Logic = "Generate-Bill";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    SummarisedBilling();
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
function SaveCloseApproval(logic) {
    if (confirm('Are you sure?')) {
        var url = config.baseUrl + "/api/IPDNursingService/IPD_GenerateBill";
        var objBO = {};
        objBO.BillNo = _BillNo;
        objBO.IPDNo = _IPDNo;
        objBO.BillingType = '-';
        objBO.ApprAmount = $('#txtPanelApprovalAmount').val();
        objBO.CoPayAmount = $('#txtCoPayment').val();
        objBO.DiscountAmount = 0;
        objBO.Remark = '-';
        objBO.login_id = Active.userId;
        objBO.Logic = logic;
        var NetPayable = $('#tblGenerateBillInfo tbody').find('tr:eq(0)').find('td:last').text();
        if (parseFloat(objBO.ApprAmount) + parseFloat(objBO.CoPayAmount) > parseFloat(NetPayable)) {
            alert('Not Allowed.');
            return
        }
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    SummarisedBilling();
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