$(document).ready(function () {
    OnLoadQueries();
    ReceiptInfo();
     $('#tblPaymentDetails tbody').on('keyup', 'input[type=text]', function () {
        var netAmount = parseFloat($('#txtNetAmount').val());
        var cash = parseFloat($('#tblPaymentDetails tbody').find('tr:eq(0)').find('td:eq(1)').find('input[type=text]').val());
        var cheque = parseFloat($('#tblPaymentDetails tbody').find('tr:eq(1)').find('td:eq(1)').find('input[type=text]').val());
        var cc = parseFloat($('#tblPaymentDetails tbody').find('tr:eq(2)').find('td:eq(1)').find('input[type=text]').val());
        var ntfs = parseFloat($('#tblPaymentDetails tbody').find('tr:eq(3)').find('td:eq(1)').find('input[type=text]').val());
        var total = cash + cheque + cc + ntfs;
        if (total > netAmount) {
            $(this).css('border-color', 'red');
            $('#txtError').text('Paid Amount can not be more than Net Amount...!').css({ 'color': 'red', 'font-size': '11px' });
        }
        else if (total < netAmount) {
            $(this).css('border-color', 'red');
            $('#txtError').text('Paid Amount can not be less than Net Amount...!').css({ 'color': '#bb8202', 'font-size': '11px' });
        }
        else {
            $('#tblPaymentDetails tbody').find('tr:eq(0),tr:eq(1),tr:eq(2),tr:eq(3)').find('td:eq(1)').find('input[type=text]').removeAttr('style');
            $('#txtError').text('').removeAttr('style');
        }
    });
    $('input[type=checkbox]').on('change', function () {
        isCheck = $(this).is(':checked');
        var val = $(this).val();
        var len = $('input[name=PaymentMode]:checked').length;
        var pay = $('#txtPayable').val();

        var tbody = "";
        if (isCheck) {
            $('#tblPaymentDetails tbody tr').each(function () {
                if ($(this).find('td:eq(0)').text().toLowerCase() == val.toLowerCase()) {
                    $(this).show();
                    $(this).addClass('pay');
                }
            });
            $('#tblPaymentDetails tbody').find('input[type=text]').val(0);
            $('#tblPaymentDetails tbody').find('tr').filter('.pay').first().find('td:eq(1)').find('input[type=text]').val(pay);
        }
        else {
            $('#tblPaymentDetails tbody tr').each(function () {
                if ($(this).find('td:eq(0)').text().toLowerCase() == val.toLowerCase()) {
                    $(this).hide();
                    $(this).removeClass('pay');
                }
            });
            $('#tblPaymentDetails tbody').find('input[type=text]').val(0);
            $('#tblPaymentDetails tbody').find('tr').filter('.pay').first().find('td:eq(1)').find('input[type=text]').val(pay);
        }
    });
});
function ReceiptInfo() {
    $('#tblPaymentInfo tbody').empty();    
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
    objBO.Logic = 'fin_ReceiptInfo';
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
                        $('.advnc-amount-section #txtNetAmt').val(val.NetAmount.toFixed(2));
                        $('.advnc-amount-section #txtAdvanceAmt').val(val.AdvanceAmount.toFixed(2));
                        $('.advnc-amount-section #txtBalanceAmt').val(val.BalanceAmount.toFixed(2));
                        $('.advnc-amount-section #txtApprovalAmt').val(val.ApprovalAmount.toFixed(2));
                    });
                }
            }  
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbody = '';
                    var count = 0;
                    var temp = "";
                    $.each(data.ResultSet.Table1, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.receiptDate + "</td>";
                        tbody += "<td>" + val.ReceiptNo + "</td>";
                        tbody += "<td class='text-right'>" + val.Amount + "</td>";
                        tbody += "<td>" + val.PayMode + "</td>";
                        tbody += "<td>" + val.remark + "</td>";
                        tbody += "<td><button class='btn btn-warning btn-xs'><i class='fa fa-print'></i></buton></td>";
                        tbody += "</tr>";
                    });
                    $('#tblPaymentInfo tbody').append(tbody);
                }
            }           
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function OnLoadQueries() {
    var url = config.baseUrl + "/api/IPDNursing/IPD_RegistrationQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = '';
    objBO.DoctorId = '';
    objBO.Prm1 = '';
    objBO.Prm2 = '';
    objBO.login_id = '';
    objBO.Logic = 'All';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {         
                if (Object.keys(data.ResultSet.Table3).length) {
                    $('#tblPaymentDetails tbody .BankName').empty().append($('<option></option>')).change();
                    $.each(data.ResultSet.Table3, function (key, val) {
                        $('#tblPaymentDetails tbody .BankName').append($('<option></option>').val(val.BankId).html(val.BankName));
                    });
                }
                if (Object.keys(data.ResultSet.Table4).length) {
                    $('#tblPaymentDetails tbody .MachineName').empty().append($('<option></option>')).change();
                    $.each(data.ResultSet.Table4, function (key, val) {
                        $('#tblPaymentDetails tbody .MachineName').append($('<option></option>').val(val.machineId).html(val.machineName));
                    });
                }                
            }
            else {
                alert('No Record Found..');
            }
        },       
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PatientAdvance() {
    if (confirm('Are you sure?')) {
        if (_IPDNo == '') {
            alert('IPD No Not Found.');
            return
        }
        var url = config.baseUrl + "/api/IPDNursing/IPD_TakeAdvance";
        var objBooking = {};
        var objPayment = [];
        var totalAmount = 0;

        $('#tblPaymentDetails tbody tr.pay').each(function () {
            var Amount = parseFloat($(this).find('td:eq(1)').find('input[type=text]').val());
            totalAmount += parseFloat($(this).find('td:eq(1)').find('input[type=text]').val());

            if ($('input[name=Advance-type]:checked').data('adv') =='AdvanceReturn')
                Amount = -Amount;
            
            objPayment.push({
                'ReceiptNo': '-',
                'PayMode': $(this).find('td:eq(0)').text(),
                'CardNo': '-',
                'BankName': $(this).find('td:eq(3)').find('select option:selected').text(),
                'RefNo': $(this).find('td:eq(4)').find('input[type=text]').val(),
                'MachineId': $(this).find('td:eq(5)').find('select option:selected').val(),
                'MachineName': $(this).find('td:eq(5)').find('select option:selected').text(),
                'Amount':Amount,
                'OnlPaymentId': '',
                'OnlPayStatus': '',
                'OnlPayResponse': '',
                'OnlPaymentDate': new Date(),
                'login_id': Active.userId
            });
        });
        if ($('input[name=Advance-type]:checked').data('adv') == 'AdvanceReturn') {
            if (totalAmount >parseFloat($('.advnc-amount-section #txtAdvanceAmt').val())) {
                alert('Advance Return Amount Shound not be greater than Advance Amount.');
                return;
            }
        }
        if ($('input[name=Advance-type]:checked').data('adv') == 'FinalSettlement') {
            if (totalAmount != Math.abs(parseFloat($('.advnc-amount-section #txtBalanceAmt').val()))) {
                alert('Final Settlement Amount Shound be Equal to Balance Amount.');                
                return;
            }
        }
       
        objBooking.IPDNo = _IPDNo;
        objBooking.hosp_id = Active.unitId;     
        objBooking.IPOPType = 'IPD';
        objBooking.ReceiptType = $('input[name=Advance-type]:checked').val();
        objBooking.Prm1 = '-';
        objBooking.Prm2 = '-';
        objBooking.Remark = '-';
        objBooking.login_id = Active.userId;
        objBooking.Logic = 'IPD-PatientAdvance';
        var MasterObject = {};
        MasterObject.objBooking = objBooking;
        MasterObject.objPayment = objPayment;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(MasterObject),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    alert('Successfully Saved..!');
                    ReceiptInfo();
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
function removeMinus(elem) {
    $(elem).val().replace('-');
}