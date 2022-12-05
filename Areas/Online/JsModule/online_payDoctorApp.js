$(document).ready(function () {
    sessionStorage.setItem('Username', "-");
    sessionStorage.setItem('UserID', "-");
    $('#payResponse').hide();
 });
function launchBOLT() {
      bolt.launch(
        {
            key: $('#hidkey').val(),
            txnid: $('#txtBookingId').val(),
            hash: $('#hidHash').val(),
            amount: $('#txtAmount').val(),
            firstname: $('#txtPatientName').val(),
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
                    objpayRespnse.appointment_id = $('#txtBookingId').val()
                    objpayRespnse.pay_responseTnxId = BOLT.response.txnid;
                    objpayRespnse.pay_responseKey = BOLT.response.key;
                    objpayRespnse.paymentId = BOLT.response.mihpayid;
                    objpayRespnse.payStatus = BOLT.response.status;
                    objpayRespnse.payAmount = BOLT.response.amount;
                    objpayRespnse.Logic = "UpdateAppointmentPayment";

                    $('#payResponse').show();
                    $('#txtRefNo').val(BOLT.response.mihpayid)
                    $('#txtStatus').val(BOLT.response.status)
                    $('#txtRamount').val(BOLT.response.amount)

                    if (BOLT.response.status == "success") {
                        $("#btnPay").prop("disabled", true);
                    }

                    //marking payment in system
                    MarkPaymentInSystem(objpayRespnse);

                //    //Salt is passd here for demo purpose only. For practical use keep salt at server side only.
                //    var fr = '<form action=\"' + $('#surl').val() + '\" method=\"post\">' +
                //        '<input type=\"hidden\" name=\"key\" value=\"' + BOLT.response.key + '\" />' +
                //        '<input type=\"hidden\" name=\"salt\" value=\"' + $('#salt').val() + '\" />' +
                //        '<input type=\"hidden\" name=\"txnid\" value=\"' + BOLT.response.txnid + '\" />' +
                //        '<input type=\"hidden\" name=\"amount\" value=\"' + BOLT.response.amount + '\" />' +
                //        '<input type=\"hidden\" name=\"productinfo\" value=\"' + BOLT.response.productinfo + '\" />' +
                //        '<input type=\"hidden\" name=\"firstname\" value=\"' + BOLT.response.firstname + '\" />' +
                //        '<input type=\"hidden\" name=\"email\" value=\"' + BOLT.response.email + '\" />' +
                //        '<input type=\"hidden\" name=\"udf5\" value=\"' + BOLT.response.udf5 + '\" />' +
                //        '<input type=\"hidden\" name=\"mihpayid\" value=\"' + BOLT.response.mihpayid + '\" />' +
                //        '<input type=\"hidden\" name=\"status\" value=\"' + BOLT.response.status + '\" />' +
                //        '<input type=\"hidden\" name=\"hash\" value=\"' + BOLT.response.hash + '\" />' +
                //        '</form>';
                //    var form = jQuery(fr);
                //    jQuery('body').append(form);
                //    form.submit();
               }
            },
            catchException: function (BOLT) {
                alert(BOLT.message);
            }
        });
}
function MarkPaymentInSystem(Payment) {
    var url = config.baseUrl + "/api/Online/Online_MarkPayment";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(Payment),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                alert(data.Msg);
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}