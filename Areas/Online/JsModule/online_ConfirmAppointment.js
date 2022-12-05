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
    document.getElementById("dtAppDatetime").min = d+'T10:38'
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
    var url = config.baseUrl + "/api/Online/DoctorAppQueries";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    $('#spnNew').html(Loading.small_gear)
    $('#spnPay').html(Loading.small_gear)

    setTimeout(function () {
        var obj = {};
        obj.unit_id = "CH01";
        obj.appointment_id = "-";
        obj.fromdate = from;
        obj.todate = to;
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
    var url = config.baseUrl + "/api/Online/DoctorAppQueries";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    var obj = {};
    obj.unit_id = "CH01";
    obj.appointment_id = "-";
    obj.fromdate = from;
    obj.todate = to;
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
                    $('#ddlDoctorName').append($('<option></option>').val(val.DoctorId).html(val.DoctorName));
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
function showDialog() {
    $('#myModal').modal('show');
    DoctorScheduledList();
}
function DoctorScheduledList() {

    if ($("#ddlDoctorName").text() == "Select Doctor") {
        alert("Doctor is not selected");
        return;
    }
    
    var DoctorId = $("#ddlDoctorName").val();
    var url = config.baseUrl + "/api/Online/DoctorAppQueries";
    var from = Properdate($("#dtolddate").val(), '-')
    var to = "1900-01-01"
    var obj = {};
    obj.unit_id = "CH01";
    obj.appointment_id = "-";
    obj.fromdate = from;
    obj.todate = to;
    obj.prm_1 = DoctorId;
    obj.login_id = "-"
    obj.Logic = "ScheduledList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            $('#tblScheduledList tbody').empty();
            if (data != '') {
                
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.AppointmentId + '</td><td>' + val.patient_name + '</td><td>' + val.app_date + '</td></tr>').appendTo($('#tblScheduledList tbody'));
                    $('#elDoctorName').html(val.DoctorName);
                    
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
function getdate() {
    if($("#dtAppDatetime").val() == "") {
        alert("Appointment date time is not selected");
        return;
    }
    $("#txtAppointmentdate").val($("#dtAppDatetime").val());
    $('#myModal').modal('hide');
}
function BookingList(ReportType) {
    
    var url = config.baseUrl + "/api/Online/DoctorAppQueries";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    //var ReportType = $('#ddlReportType').val();
    var obj = {};
    obj.unit_id = "CH01";
    obj.appointment_id = "-";
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
                
                var color='black'
                $.each(data.ResultSet.Table, function (key, val) {
                    
                    if (val.IsPrescriptionAttached == "1")
                        color = "blue";
                    else
                        color = 'black'
                    $('<tr style="color:' + color+'"><td>' + val.booking_date + '</td><td>' + val.AppointmentId + '</td><td>' + val.patient_name + '</td><td>' + val.gender + '</td><td>' + val.age + '</td><td>' + val.mobile_no + '</td><td>' + val.IsConfirmed + '</td><td><input id=' + val.AppointmentId + ' type="button" class="btn btn-warning" value="V" onclick="BookingDetail(this.id)" /></td></tr>').appendTo($('#tblBooking tbody'));
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
function BookingDetail(appointment_id) {

    $("#txtAppointmentId").val(appointment_id);
    var url = config.baseUrl + "/api/Online/DoctorAppQueries";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    //var ReportType = $('#ddlReportType').val();
    var obj = {};
    obj.unit_id = "CH01";
    obj.appointment_id = appointment_id;
    obj.fromdate = from;
    obj.todate = to;
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
                    
                    if (val.IsConfirmed == "Y") {
                        $("#btnConfirm").prop("disabled", true);
                    }
                    else
                    {
                        $("#btnConfirm").prop("disabled", false);
                    }
                    if (val.payStatus == "Already Paid") {
                        $("#btnSendMeetLink").prop("disabled", false);
                        $("#btnCancel").prop("disabled", true);
                    }
                    else {
                        $("#btnSendMeetLink").prop("disabled", true);
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
                    if (val.PrescriptionPath == "") {
                        $("#btnView").attr("disabled", true);
                        $("#btnView").prop("href", "");
                        $("#btnView").text("PENDING");
                        $("#btnSendPrescription").val("-");
                        $("#btnSendPrescription").prop("disabled", true);
                    }
                    else {
                        $("#btnView").attr("disabled", false);
                        $("#btnView").prop("href", val.PrescriptionPath);
                        $("#btnView").text("VIEW");
                        $("#btnSendPrescription").text("SEND");
                        $("#btnSendPrescription").prop("disabled", false);
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
    if ($("#dtAppDatetime").val()=="") {
        alert("Appointment date time is not selected");
        return;
    }
    obj.appointment_id = $("#txtAppointmentId").val();
    obj.DoctorId = $("#ddlDoctorName").val();
    obj.appointment_datetime = $("#dtAppDatetime").val();
    obj.Confirm_remark = $("#txtRemark").val();
    obj.payment_link = "-";
    obj.meeting_link = "-";
    obj.AppType = $("#ddlVisitType").val()
    obj.login_id = Active.userId;
    obj.unit_id = Active.unitId;
    obj.Logic ="TakeConfirmation";
    var url = config.baseUrl + "/api/Online/AppointmentConfirmation";
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
    obj.appointment_id = $("#txtAppointmentId").val();
    obj.Confirm_remark = $("#txtRemark").val();
    obj.payment_link = "-";
    obj.login_id = Active.userId;
    obj.unit_id = Active.unitId;
    obj.Logic = "CancelBooking";
    var url = config.baseUrl + "/api/Online/AppointmentConfirmation";
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
function CompleteMeeting() {
    var r = confirm("Are You sure to Complete");
    if (r == false) {
        return
    }
    var obj = {};
    obj.appointment_id = $("#txtAppointmentId").val();
    obj.Confirm_remark = $("#txtRemark").val();
    obj.payment_link = "-";
    obj.login_id = Active.userId;
    obj.unit_id = Active.unitId;
    obj.Logic = "CompleteMeeting";
    var url = config.baseUrl + "/api/Online/AppointmentConfirmation";
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
    if(cmd=="btnSendMeetLink") {
        var meetingtext = $("#txtMeetingLink").val();
        if (meetingtext.length<20) {
            alert("Meeting Link is not copied here");
            return;
        }

        var r = confirm("Are You want to send Meeting link");
        if (r == false) {
            return
        } 
        logic = "SendMeetingLink";
    }
    else if (cmd == "btnSendPrescription") {
        var meetingtext = "-";
        var r = confirm("Are You to send Prescription link");
        if (r == false) {
            return
        }
        logic = "SendPrescription";
    }
    else {
        var r = confirm("Are You want to Re-send payment link");
        if (r == false) {
            return
        } 
        logic = "SendPaymentLink";
    }

    var url = config.baseUrl + "/api/Online/BookingNotification";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    var obj = {};
    obj.unit_id = "CH01";
    obj.appointment_id = $("#txtAppointmentId").val();
    obj.fromdate = from;
    obj.todate = to;
    obj.prm_1 = $("#txtMeetingLink").val();
    obj.login_id = "-"
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
    obj.merchantTransactionIds = $("#txtAppointmentId").val();
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
                            btn = "<input type='button' class='btn-success' id='" + val.paymentId + '|' + val.status+ '|' + val.amount+ "'  onclick='UpdatePaymentStatus(this.value,this.id)' value='" + val.cmdType + "' />"

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
function UpdatePaymentStatus(cmd,content) {

    var obj = {};
    obj.command = cmd;
    obj.AppointmentId = $("#txtAppointmentId").val();
    obj.StrValues = content;
    obj.loginId = Active.userId;
    obj.Logic = "UpdateAppointmentPayment";
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
function GetSmsLog() {
    
    var url = config.baseUrl + "/api/Online/DoctorAppQueries";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    //var ReportType = $('#ddlReportType').val();
    var obj = {};
    obj.unit_id = "CH01";
    obj.appointment_id = "-";
    obj.fromdate = from;
    obj.todate = to;
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
function PreparePrescription() {
    var fileInput = document.getElementById("myfileinput");
    var file = fileInput.files[0];
    var url = config.baseUrl + "/api/Utility/SetHeaderandFooter";
    var Appointmentid = $("#txtAppointmentId").val();
    var formData = new FormData();
    formData.append('FileName', Appointmentid);
    formData.append('FileContent', file);
    var ajax = new XMLHttpRequest();
    ajax.open("Post", url, true);
    type: 'POST',
    ajax.responseType = "text";
    ajax.onreadystatechange = function () {
        
        alert(this.response);
        if (this.readyState == 4) {
         
            var t = this.response;
            if (t.includes("Success"))
                BookingDetail(Appointmentid);
            else
                alert(this.response );
        }
    };
    ajax.send(formData);
  
}
