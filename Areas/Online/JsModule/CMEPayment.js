$(document).ready(function () {
    $('#payResponse').hide();
});
function launchBOLT() {
    bolt.launch(
        {
            key: $('#hidkey').val(),
            txnid: $('#txtBookingId').val(),
            hash: $('#hidHash').val(),
            amount: $('#txtAmount').val(),
            firstname: $('#txtParticepantName').val(),
            email: $('#txtEmail').val(),
            phone: $('#txtMobile').val(),
            productinfo: $('#txtReason').val(),
            //enforce_paymethod: "UPI",
            udf5: $('#udf5').val(),
            surl: '-',
            furl: '-'
        }, {
            responseHandler: function (BOLT) {
                console.log(BOLT.response.txnStatus);
                if (BOLT.response.txnStatus != 'CANCEL') {

                    console.log(BOLT.response);

                    var objpayRespnse = {};
                    objpayRespnse.BookingId = $('#txtBookingId').val();
                    objpayRespnse.pay_responseTnxId = BOLT.response.txnid;
                    objpayRespnse.pay_responseKey = BOLT.response.key;
                    objpayRespnse.paymentId = BOLT.response.mihpayid;
                    objpayRespnse.payStatus = BOLT.response.status;
                    objpayRespnse.payAmount = $('#txtAmount').val();
                    objpayRespnse.Logic = "UpdateCMEPayment";

                    $('#payResponse').show();
                    $('#txtRefNo').val(BOLT.response.mihpayid);
                    $('#txtStatus').val(BOLT.response.status);
                    $('#txtRamount').val($('#txtAmount').val());

                    if (BOLT.response.status == "success") {
                        $("#btnPay").prop("disabled", true);
                    }
                    //marking payment in system
                    MarkPaymentInSystem(objpayRespnse.BookingId, objpayRespnse.paymentId, objpayRespnse.payStatus);
                }
            },
            catchException: function (BOLT) {
                alert(BOLT.message);
            }
        });
}

function MarkPaymentInSystem(BookingId, paymentId, payStatus) {
    var url = config.baseUrl + "/api/Online/InsertCovidServices";
    var objBO = {};
    objBO.patient_id = paymentId;
    objBO.item_id = BookingId;
    objBO.proc_date = '1900/01/01';
    objBO.service_status = payStatus;  
    objBO.Logic = 'UpdateCMEPayment';  
    $.ajax({
        url: url,
        data: JSON.stringify(objBO),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}