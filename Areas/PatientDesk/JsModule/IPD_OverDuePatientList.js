var counterP = 300;
var _ipdNo = "";
var selectedRow;
$(document).ready(function () {
    CloseSidebar();
    OverDuePatientList();
    StartCountDown();
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblPatientList tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $(document).on("click", "#tblPatientList button ", function () {
        _ipdNo = $(this).closest("tr").find('td:eq(2)').text();
        if ($(this).text() == "Call") {
            selectedRow = $(this).closest("tr");
            var PatientName = $(this).closest("tr").find('td:eq(3)').text();
            var PanelName = $(this).closest("tr").find('td:eq(14)').text();
            var AdmitDATE = $(this).closest("tr").find('td:eq(15)').text();
            var s = '<table class="table table-bordered">';
            s += '<tr>';
            s += '<td> IPD No </td>';
            s += '<td>' + _ipdNo + '</td>';
            s += '</tr>';
            s += '<tr>';
            s += '<td> Patient Name </td>';
            s += '<td>' + PatientName + '</td>';
            s += '</tr>';
            s += '<tr>';
            s += '<td> Panel Name </td>';
            s += '<td>' + PanelName + '</td>';
            s += '</tr>';
            s += '<td> Admission Date </td>';
            s += '<td>' + AdmitDATE + '</td>';
            s += '</tr>';
            s += '</table>';

            $("#pInfo").html(s)
            $('#myModal').modal('show');
       
            CallLog();
        }
        else {
            var MinAlertAmount = $(this).closest("tr").find('input[name="MinAlertAmount"]').val();
            var RepeatCallMinute = $(this).closest("tr").find('input[name="RepeatCallMinute"]').val();
            UpdateTimeAndAmount(MinAlertAmount, RepeatCallMinute);
    
        }
        //let a =tr.find('input[name="fullname"]').val(); -- For Getting Row
    });
});
function StartCountDown() {
    var counter = counterP;
    var interval = setInterval(function () {
        counter--;
        $("#txtAutoRefresh").html(counter);
        // Display 'counter' wherever you want to display it.
        if (counter <= 0) {
            clearInterval(interval);
            OverDuePatientList();
            StartCountDown();
            return;
        } else {
            // $('#txtRefDuration').val(counter);

        }
    }, 1000);
}
function OverDuePatientList() {
    var ct = 1;
    var TransBo = {};
    TransBo.IPDNo = "";
    TransBo.LoginId = Active.userId;
    TransBo.LoginName = Active.userName;
    TransBo.Remark = "-";
    TransBo.Prm1 = "-";
    TransBo.Logic = "OverDuePatientList";
    TransBo.OutPutType = "HTML";
    var url = config.baseUrl + "/api/IPOPAudit/GetOverDuePatientList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(TransBo),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            $('#tblPatientList tbody').empty();
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr style="background-color:' + val.CallStatus + '">';
                    htmldata += '<td style="width:2%;text-align:left">' + ct + '</td>';
                    htmldata += '<td style="width:3%;text-align:center"><button type="button" class="btn btn-warning btn-block" style="height:18px;font-size:9px;padding:1px" " >Call</button></td>';
                    htmldata += '<td style="width:4%;text-align:left">' + val.IPDNo + '</td>';
                    htmldata += '<td style="width:14%;text-align:left">' + val.PatientName + '</td>';
                    htmldata += '<td style="width:5%;text-align:left">' + val.Mobile + '</td>';
                    htmldata += '<td style="width:12%;text-align:left">' + val.ConsultantName + '</td>';
                    htmldata += '<td style="width:8%;text-align:left">' + val.BedCategory + '</td>';
                    htmldata += '<td style="width:5%;text-align:right">' + val.Deposit + '</td>';
                    htmldata += '<td style="width:5%;text-align:right">' + val.BillAmt + '</td>';
                    htmldata += '<td style="width:5%;text-align:right">' + val.ExtraPayment + '</td>';
                    htmldata += "<td style='width:5%'><input type='text' name='MinAlertAmount' class='text-center' style='background-color:#d8f1f5;width:100%' value='" + val.MinAlertAmount + "'/></td>";
                    htmldata += "<td style='width:5%'><input type='text' name='RepeatCallMinute' class='text-center' style='background-color:#d8f1f5;width:100%' value='" + val.RepeatCallMinute + "'/></td>";
                    htmldata += '<td style="width:3%;text-align:center"><button  type="button" class="btn btn-info btn-block" style="height:18px;font-size:9px;padding:1px"">Save</button></td>';
                    htmldata += '<td style="width:10%;text-align:center">' + val.lastCallDate + '</td>';
                    htmldata += '<td style="width:15%;text-align:left;">' + val.Company_Name + '</td>';
                    htmldata += '<td style="width:0%;text-align:left;display:none;">' + val.DateOfAdmit + '</td>';
                    htmldata += '</tr>';
                    ct++;
                });
                $('#tblPatientList tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}
function CallOverDueInsertUpdate() {
    var ct = 1;
    var TransBo = {};
    TransBo.IPDNo = _ipdNo;
    TransBo.LoginId = Active.userId;
    TransBo.LoginName = Active.userName;
    TransBo.Remark = $("#txtRemark").val();
    TransBo.Prm1 = "-";
    TransBo.Logic = "MarkCallDone";
    TransBo.OutPutType = "HTML";
    var url = config.baseUrl + "/api/IPOPAudit/CallOverDueInsertUpdate";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(TransBo),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            selectedRow.css("background-color", "#ceee90");
            CallLog();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}
function UpdateTimeAndAmount(MinAlertAmount, RepeatCallMinute) {
    var ct = 1;
    var TransBo = {};
    TransBo.IPDNo = _ipdNo;
    TransBo.LoginId = Active.userId;
    TransBo.LoginName = Active.userName;
    TransBo.Remark = "";
    TransBo.Prm1 = "-";
    TransBo.MinAlertAmount = MinAlertAmount;
    TransBo.RepeatCallMinute = RepeatCallMinute;
    TransBo.Logic = "UpdateAmountAndTime";
    TransBo.OutPutType = "HTML";
    var url = config.baseUrl + "/api/IPOPAudit/CallOverDueInsertUpdate";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(TransBo),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}
function CallLog() {
    var ct = 1;
    var TransBo = {};
    TransBo.IPDNo = _ipdNo;
    TransBo.LoginId = Active.userId;
    TransBo.LoginName = Active.userName;
    TransBo.Remark = "-";
    TransBo.Prm1 = "-";
    TransBo.Logic = "GetCallLog";
    TransBo.OutPutType = "HTML";
    var url = config.baseUrl + "/api/IPOPAudit/GetOverDuePatientList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(TransBo),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            $('#tblCallLog tbody').empty();
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td style="width:3%;text-align:left">' + ct + '</td>';
                    htmldata += '<td style="width:5%;text-align:left">' + val.CallDate + '</td>';
                    htmldata += '<td style="width:15%;text-align:left">' + val.remark + '</td>';
                    htmldata += '<td style="width:5%;text-align:left">' + val.login_name + '</td>';
                    htmldata += '</tr>';
                    ct++;
                });
                $('#tblCallLog tbody').append(htmldata);

            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}