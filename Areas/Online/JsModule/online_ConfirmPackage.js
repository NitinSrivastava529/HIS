var counterP = 90;
$(document).ready(function () {
    $('#btnNewReqList').on('click', function () {
        BookingList('PendingList');
    });
    $('#btnPayedList').on('click', function () {
        BookingList('PaymentDoneList');
    });
    $('#btnCancelled').on('click', function () {
        BookingList('CancelledList');
    });
    $('#btnAll').on('click', function () {
        BookingList('AllList');
    });
    FillCurrentDate("txtFrom");
    FillCurrentDate("txtTo");
    FillCurrentDate("dtolddate");
    FillCurrentDate("dtAppDatetime");
    var d = GetPreviousDate();
    document.getElementById("dtAppDatetime").min = d + 'T10:38'
    DoctorList();
    AutoRefreshStatus();
    StartCountDown();
});
function StartCountDown() {
    var counter = counterP;
    var interval = setInterval(function () {
        counter--;
        // Display 'counter' wherever you want to display it.
        if (counter <= 0) {
            clearInterval(interval);
            AutoRefreshStatus();
            StartCountDown();
            return;
        } else {
            // $('#txtRefDuration').val(counter);

        }
    }, 1000);
}
function AutoRefreshStatus() {
    var url = config.baseUrl + "/api/Online/PackageQueries";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    $('#spnNew').html(Loading.small_gear)
    $('#spnPay').html(Loading.small_gear)

    setTimeout(function () {
        var obj = {};
        obj.unit_id = "CH01";
        obj.PatientId = "-";       
        obj.prm_1 = "-";
        obj.login_id = "-"
        obj.Logic = "CuurentStatus";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(obj),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data != '') {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#spnNew').html(val.New)
                        $('#spnPay').html(val.Paid)
                    });
                }
            },
            error: function (response) {
            }
        });
    }, 3000);


}
function DoctorList() {
    var url = config.baseUrl + "/api/Online/PackageQueries";   
    var obj = {};
    obj.unit_id = "CH01";
    obj.PatientId = "-";
    obj.prm_1 = "-";
    obj.login_id = "-"
    obj.Logic = "DoctorList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlDoctorName').empty().append($('<option>Select Doctor</option>'));
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlDoctorName').append($('<option></option>').val(val.DoctorId).html(val.DoctorName)).select2();
                });

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
function getdate() {
    if ($("#dtAppDatetime").val() == "") {
        alert("Appointment date time is not selected");
        return;
    }
    $("#txtAppointmentdate").val($("#dtAppDatetime").val());
    $('#myModal').modal('hide');
}
function BookingList(ReportType) {
    
    var url = config.baseUrl + "/api/Online/PackageQueries";  
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    //var ReportType = $('#ddlReportType').val();
    var obj = {};
    obj.DoctorId = "CH01";
    obj.PatientId = "-";   
    obj.fromdate = from;
    obj.todate = to;
    obj.prm_1 = "-";
    obj.login_id = "-"
    obj.Logic = ReportType;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            $('#tblBooking tbody').empty();
            if (data != '') {
                
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.booking_date + '</td><td>' + val.PatientId + '</td><td>' + val.patient_name + '</td><td>' + val.gender + '</td><td>' + val.age + '</td><td>' + val.mobile_no + '</td><td>' + val.IsConfirmed + '</td><td><input id=' + val.PatientId + ' type="button" class="btn btn-warning" value="V" onclick="BookingDetail(this.id)" /></td></tr>').appendTo($('#tblBooking tbody'));
                });
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function BookingDetail(PatientId) {

    $("#txtPatientId").val(PatientId);
    var url = config.baseUrl + "/api/Online/PackageQueries";  
    var obj = {};
    obj.unit_id = "CH01";
    obj.PatientId = PatientId;  
    obj.prm_1 = "-";
    obj.login_id = "-";
    obj.Logic = 'BookingDetail';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            if (data != '') {
                
                
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#idBookingReason').html(val.appointment_reason)
                    $('#idAddress').html(val.pt_address)
                    $('#idConfirmRemark').html(val.Confirm_remark)
                    $('#idEmail').html(val.email_id)
                    $('#idAllotedDoctor').html(val.doctor_name)
                    $('#idFee').html(val.doctor_fee)
                    $('#idAppDateTime').html(val.app_date)
                    $('#idPayStatus').html(val.payStatus)
                    $('#txtMobile1').val(val.mobile_no)
                    $('#idUHID').html(val.UHID)
                    
                    
                    if (val.IsConfirmed == "Y") {
                        $("#btnConfirm").prop("disabled", true);
                    }
                    else {
                        $("#btnConfirm").prop("disabled", false);
                    }
                    if (val.payStatus == "Already Paid") {
                        $("#btnSendAppLink").prop("disabled", false);
                        $("#btnCancel").prop("disabled", true);
                    }
                    else {
                        $("#btnSendAppLink").prop("disabled", true);
                        $("#btnCancel").prop("disabled", false);
                    }
                    if (val.IsConfirmed == "Y" && val.payStatus == "Pending") {
                        $("#btnResendLink").prop("disabled", false);
                    }
                    else {
                        $("#btnResendLink").prop("disabled", true);
                    }
                    if (val.meeting_status == "Pending") {
                        $("#btnCompleteMeeting").prop("disabled", false);
                    }
                    else {
                        $("#btnCompleteMeeting").prop("disabled", true);
                    }
                    if (val.UHID == "Not Assigned") {
                        $("#btnUpdateUHID").prop("disabled", false);
                    }
                    else {
                        $("#btnUpdateUHID").prop("disabled", true);
                    }
                });
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function BookingConfirmation() {

    var r = confirm("Are You sure to Confirm");
    if (r == false) {
        return
    }

    var obj = {};
    if ($("#ddlDoctorName").text() == "Select Doctor") {
        alert("Doctor is not selected");
        return;
    }
    obj.PatientId = $("#txtPatientId").val();
    obj.DoctorId = $("#ddlDoctorName").val();  
    obj.Confirm_remark = $("#txtRemark").val();
    obj.payment_link = "-";
    obj.meeting_link = "-";
    obj.login_id = Active.userId;
    obj.unit_id = Active.unitId;
    obj.Logic = "TakeConfirmation";
    var url = config.baseUrl + "/api/Online/PackageConfirmation";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                alert(data.Msg);
                BookingDetail($("#txtAppointmentId").val());
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CancelBooking() {
    var r = confirm("Are You sure to cancel");
    if (r == false) {
        return
    }


    if ($("#txtRemark").val() == "") {
        alert("Remark is mandatory");
        return;
    }
    var obj = {};
    obj.PatientId = $("#txtPatientId").val();
    obj.Confirm_remark = $("#txtRemark").val();
    obj.payment_link = "-";
    obj.login_id = Active.userId;
    obj.unit_id = Active.unitId;
    obj.Logic = "CancelBooking";
    var url = config.baseUrl + "/api/Online/PackageConfirmation";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
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
function Online_BookingNotification(cmd) {

    //var logic;
    if (cmd == "btnSendPayLink") {
        logic = "SendPaymentLink";
    }
    if (cmd == "btnSendAppLink") {
        logic = "SendAppLoginLink";
    }

    var url = config.baseUrl + "/api/Online/OnlinePackageNotification";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    var obj = {};
    obj.unit_id = "CH01";
    obj.PatientId = $("#txtPatientId").val();
    obj.fromdate = from;
    obj.todate = to;
    obj.prm_1 = $("#txtMeetingLink").val();
    obj.login_id = Active.userId;
    obj.Logic = logic;

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                alert(data);
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPaymentStatus() {

    $('#myModal2').modal('show');
    var obj = {};
    obj.merchantKey = "E3Ghpv8l";
    obj.merchantTransactionIds = $("#txtPatientId").val();
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
                    $.each(data.ResultSet.Table1, function (key, val) {
                        var btn = val.cmdType
                        if(val.cmdType == 'Update' || val.cmdType == 'Refund')
                        btn = "<input type='button' class='btn-success' id='" + val.paymentId + '|' + val.status + '|' + val.amount + "'  onclick='UpdatePaymentStatus(this.value,this.id)' value='" + val.cmdType + "' />"

                        $('<tr><td>' + val.AppointmentId + '</td><td>' + val.paymentId + '</td><td>' + val.mode + '</td><td>' + val.status + '</td><td>' + val.amount + '</td><td>' + val.addedon + '</td><td>' + btn + '</td></tr>').appendTo($('#tblPayments tbody'));
                    });
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
function UpdatePaymentStatus(cmd, content) {

    var obj = {};
    obj.command = cmd;
    obj.AppointmentId = $("#txtPatientId").val();
    obj.StrValues = content;
    obj.loginId = Active.userId;
    obj.Logic = "updatePaymentPackage";
    var url = config.baseUrl + "/api/Online/UpdatePaymentStatus";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#tblPayments tbody').empty();
            if (data != '') {
                alert(data);
            }
            else {
                alert(data.Msg);
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function showSmsDialog() {
    var t = $('#txtMobile1').val();
    if (t.length > 2) {
        $('#txtMobileLog').val(t);
        GetSmsLog();
    }

    $('#myModal3').modal('show');
}
function showUHIDDialog() {
    var t = $('#txtMobile1').val();
    if (t.length > 2) {
        HISCustomerList();
        $('#myModal4').modal('show');
    }
}
function GetSmsLog() {
    
    var url = config.baseUrl + "/api/Online/PackageQueries";  
    var obj = {};
    obj.unit_id = "CH01";
    obj.PatientId = "-";   
    obj.prm_1 = $("#txtMobileLog").val();
    obj.login_id = "-"
    obj.Logic = "SMSLog";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            $('#tblSmsLog tbody').empty();
            if (data != '') {
                
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.cr_date + '</td><td>' + val.sms + '</td><td>' + val.response_message + '</td></tr>').appendTo($('#tblSmsLog tbody'));
                });
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function HISCustomerList() {
    
    var url = config.baseUrl + "/api/Online/HISCustomerList";
    var obj = {};
    obj.unit_id = "CH01";
    obj.PatientId = "-";
    obj.prm_1 = $('#txtMobile1').val();
    obj.login_id = "-"
    obj.Logic = "SMSLog";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            $('#tplPatientList tbody').empty();
            if (data != '') {
                
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.Patient_ID + '</td><td>' + val.PName + '</td><td><button id="' + val.Patient_ID+'" type="button" class="btn btn-success btn-block" onclick="UpdateUHID(this.id)">Update</button></td></tr>').appendTo($('#tplPatientList tbody'));
                });
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function UpdateUHID(UHID) {
    
    var obj = {};
    obj.command = "Update";
    obj.AppointmentId = $("#txtPatientId").val();
    obj.StrValues = UHID+'|-|0|';
    obj.loginId = Active.userId;
    obj.Logic = "updateUHID";
    var url = config.baseUrl + "/api/Online/UpdatePaymentStatus";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#tblPayments tbody').empty();
            if (data != '') {
                alert(data);
            }
            else {
                alert(data.Msg);
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}