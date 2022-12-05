$(document).ready(function () {
    //GetCMERegInfo();
});
function SaveInfo() {
    if (validation()) {
        var url = config.baseUrl + "/api/Online/InsertCovidServices";
        var objBO = {};
        objBO.patient_id = $('#txtMobileNo').val();
        objBO.item_id = '-';
        objBO.proc_date = $('#txtCMEDate').val();
        objBO.proc_by = $('#txtAmount').val();
        objBO.remark = $('#txtCMEInfo').val();
        objBO.service_status = $('#txtParticepantName').val();
        objBO.Logic = 'InsertCMERegistration';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    GetCMERegInfo();
                    $('input:text').val('');
                    $('#txtCMEInfo').val(objBO.remark);
                }
                else {
                    alert(data)
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function GetCMERegInfo() {
    $('#tblCMERegistration tbody').empty();
    var url = config.baseUrl + "/api/Online/PackageQueries";
    var objBO = {};
    objBO.prm_1 = '-';
    objBO.fromdate = $('#txtCMEDate').val();
    objBO.todate = '1900/01/01';
    objBO.Logic = 'GetCMERegInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;

                        if (val.PaymentId != null)
                            tbody += "<tr style='background:#b0edc0'>";
                        else
                            tbody += "<tr>";

                        tbody += "<td>" + val.AutoId + "</td>";
                        tbody += "<td>" + val.CMEDate + "</td>";
                        tbody += "<td>" + val.CMEInfo + "</td>";
                        tbody += "<td>" + val.ParticepantName + "</td>";
                        tbody += "<td>" + val.MobileNo + "</td>";
                        tbody += "<td>" + val.Amount + "</td>";
                        if (val.PaymentId == null)
                            tbody += "<td><button class='btn btn btn-warning btn-xs' onclick=SendLink(" + val.AutoId + ")><i class='fa fa-send'>&nbsp;</i>Send Payment Link</button></td>";

                        else
                            tbody += "<td>-</td>";
                        tbody += "<td>" + val.PaymentId + "</td>";
                        if (val.PaymentStatus == 'success')
                            tbody += "<td><button class='btn btn btn-warning btn-xs' onclick=GetPaymentStatus(" + val.AutoId + ")><i class='fa fa-eye'>&nbsp;</i>" + val.PaymentStatus + "</button></td>";
                        else
                            tbody += "<td><button class='btn btn btn-warning btn-xs' onclick=GetPaymentStatus(" + val.AutoId + ")><i class='fa fa-eye'>&nbsp;</i>Status</button></td>";
                        tbody += "<td>" + val.PaymentDate + "</td>";
                        tbody += "<td>"
                        tbody += "<label style='display:none' id='SMSCopy'>Dear " + val.ParticepantName + ", Kindly pay Registration Fee of Rs. " + val.Amount + "for Module 1 of " + val.CMEInfo + ".Click on Link https://exprohelp.com/his/Online/Online/CMEPayment?pid=" + val.AutoId + " -Team Chandan</label>"
                        tbody += "<button id='btnCopyLink' class='btn btn btn-success btn-xs' onclick=copyToClipboard(this)><i class='fa fa-copy'>&nbsp;</i>Copy Link</button>";
                        tbody += "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblCMERegistration tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function copyToClipboard(element) {
    var elem = $("<input>");
    $("body").append(elem);
    elem.val($(element).closest('tr').find('#SMSCopy').text()).select();
    document.execCommand("copy");
    elem.remove();
    alert('Link Copied Successfully.');
}
function SendLink(particepantId) {
    //var url = "CMEPayment?ParticepantId=" + particepantId;
    //window.open(url, '_blank', false);   

    var url = config.baseUrl + "/api/Online/PackageQueries";
    var objBO = {};
    objBO.PatientId = particepantId;
    objBO.fromdate = '1900/01/01';
    objBO.todate = '1900/01/01';
    objBO.Logic = 'SendCMEPaymentLink';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (data != '') {
                alert('Payment Link Successfully Sent.');
            }
            else {
                alert(data)
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPaymentStatus(Autoid) {   
    var obj = {};
    obj.merchantKey = "E3Ghpv8l";
    obj.merchantTransactionIds = Autoid;
    var url = config.baseUrl + "/api/Online/getPaymentResponse";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#tblPayments tbody').empty();
            if (data != '') {
                if (data.Msg == "Found") {
                    var tbody = "";
                    $.each(data.ResultSet.Table1, function (key, val) {
                        var btn = val.cmdType
                        if (val.cmdType == 'Update' || val.cmdType == 'Refund')
                            btn = "<input type='button' class='btn-success' id='" + val.paymentId + '|' + val.status + '|' + val.amount + "'  onclick='UpdatePaymentStatus(this.value,this.id)' value='" + val.cmdType + "' />"
                        tbody += "<tr>";
                        tbody += "<td>" + val.AppointmentId+"</td>";
                        tbody += "<td>" + val.paymentId+"</td>";
                        tbody += "<td>" + val.mode+"</td>";
                        tbody += "<td>" + val.status+"</td>";
                        tbody += "<td>" + val.amount+"</td>";
                        tbody += "<td>" + val.addedon + "</td>";
                        if (val.cmdType == 'Update' || val.cmdType == 'Refund')
                            tbody += "<td><button class='btn btn-warning btn-xs' onclick='UpdatePaymentStatus(this)'>" + val.cmdType + "</button></td>";
                        else
                            tbody += "<td>-</td>";

                        tbody += "</tr>";                       
                    });
                    $('#tblPayments tbody').append(tbody);
                    $('#myModal2').modal('show');
                }
                else {
                    alert(data.Msg);
                }
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function UpdatePaymentStatus(elem) {
    var url = config.baseUrl + "/api/Online/InsertCovidServices";
    var objBO = {};
    objBO.patient_id = $(elem).closest('tr').find('td:eq(1)').text();
    objBO.item_id = $(elem).closest('tr').find('td:eq(0)').text();;
    objBO.proc_date = $(elem).closest('tr').find('td:eq(5)').text();;
    objBO.proc_by = '-';
    objBO.remark = '-';
    objBO.service_status = $(elem).closest('tr').find('td:eq(3)').text();;
    objBO.Logic = 'UpdateCMEPayment';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data)
                GetPaymentStatus(AutoId);
            }
            else {
                alert(data)
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function validation() {
    var mobile_no = $('#txtMobileNo').val();
    var CMEDate = $('#txtCMEDate').val();
    var CMEInfo = $('#txtCMEInfo').val();
    var Amount = $('#txtAmount').val();
    var ParticepantName = $('#txtParticepantName').val();

    if (CMEDate == '') {
        $('#txtCMEDate').css('border-color', 'red').focus();
        alert('Please Provide CME Date.');
        return false;
    }
    else {
        $('#txtCMEDate').removeAttr('style');
    }
    if (CMEInfo == '') {
        $('#txtCMEInfo').css('border-color', 'red').focus();
        alert('Please Provide CME Info.');
        return false;
    }
    else {
        $('#txtCMEInfo').removeAttr('style');
    }

    if (mobile_no == '') {
        $('#txtMobileNo').css('border-color', 'red').focus();
        alert('Please Provide Mobile No.');
        return false;
    }
    else if ($('#txtMobileNo').val().length < 10) {
        $('#txtMobileNo').css('border-color', 'red').focus();
        alert('Mobile No should be 10 digit.');
        return false;
    }
    else if ($('#txtMobileNo').val().length > 10) {
        $('#txtMobileNo').css('border-color', 'red').focus();
        alert('Mobile No should be 10 digit.');
        return false;
    }
    else {
        $('#txtMobileNo').removeAttr('style');
    }
    if (ParticepantName == '') {
        $('#txtParticepantName').css('border-color', 'red').focus();
        alert('Please Provide Particepant Name.');
        return false;
    }
    else {
        $('#txtParticepantName').removeAttr('style');
    }
    if (Amount == '') {
        $('#txtAmount').css('border-color', 'red').focus();
        alert('Please Provide Amount.');
        return false;
    }
    else {
        $('#txtAmount').removeAttr('style');
    }
    return true;
} 