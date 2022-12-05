$(document).ready(function () {
    CloseSidebar();
    FillCurrentDate('txtFrom');
    FillCurrentDate15('txtTo');
    $('#btnBookNewOT').on('click', function () {
        $('#myModal').modal('show');
    });
    $('#btnOtView').on('click', function () {
        OTSchedulePivot();
        $('#myModal2').modal('show');
    });
    DoctorList();

})
function OTSchedule() {
    var url = config.baseUrl + "/api/OT/OTScheduleQueries";
    var objBO = {};
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Logic = "OTSchedule";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblOTDetails tbody').empty();
            var tbody = '';
            var count = 0;
            var otName = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (otName != val.OTName) {
                            tbody += "<tr class='name-group'>";
                            tbody += "<td colspan='11'>" + val.OTName + "</td>";
                            tbody += "</tr>";
                            otName = val.OTName;
                        }
                        count++;
                        if (val.IsConfirmed == 'Y')
                            tbody += "<tr style='background:#d4f3d4'>";
                        else if (val.IsConfirmed == 'X')
                            tbody += "<tr style='background:#ff252573'>";
                        else
                            tbody += "<tr>";

                        tbody += "<td style='display:none'>" + val.auto_id + "</td>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.DoctorName + "</td>";
                        tbody += "<td>" + val.UHID + "</td>";
                        tbody += "<td>" + val.patientName + "</td>";
                        tbody += "<td>" + val.patientMobile + "</td>";
                        tbody += "<td>" + val.bookingDate + "</td>";
                        tbody += "<td>" + val.bookFromTime + "</td>";
                        tbody += "<td>" + val.bookToTime + "</td>";
                        tbody += "<td>" + val.Remark + "</td>";
                        tbody += "<td>" + val.ItemRequired + "</td>";
                        tbody += "<td><button class='btn btn-warning btn-xs' onclick=selectRow(this);OTSchedulebyId('" + val.auto_id + "')><span class='fa fa-sign-in'></span></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblOTDetails tbody').append(tbody);
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function OTSchedulebyId(autoid) {
    var url = config.baseUrl + "/api/OT/OTScheduleQueries";
    var objBO = {};
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = autoid;
    objBO.Logic = "OTSchedulebyId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (val.IsConfirmed != 'N') {
                            $('#btnConfirm').hide();
                            $('#btnCancel').hide();
                        }
                        else {
                            $('#btnConfirm').show();
                            $('#btnCancel').show();
                        }                                               
                        $('#txtUHIDNo').text(val.UHID);
                        $('#txtBookBy').text(val.OTbookedby);
                        $('#txtPatientName').text(val.patientName);
                        $('#txtMobileNo').text(val.patientMobile);
                        $('#txtConfirmRemark').text(val.Remark);
                    });
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ApproveAndCancle(prm1) {
    var url = config.baseUrl + "/api/DoctorApp/IPD_OTBookingInsertUpdate";
    var objBO = {};
    objBO.AutoId = $('#tblOTDetails tbody tr.select-row').find('td:eq(0)').text();
    objBO.Prm1 = prm1;
    objBO.Remark = $('#txtConfirmRemark').val();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.bookBy = Active.userId;
    objBO.Logic = "ApproveAndCancle";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (data.includes('Success')) {
                alert(data);
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
//OT bOOKING bLOCK

function OTSchedulePivot() {
    var url = config.baseUrl + "/api/OT/OTScheduleQueries";
    var objBO = {};
    objBO.OTId = '-';
    objBO.DoctorId = '-';
    objBO.IPDNo = "";
    objBO.from = "1900-01-01";
    objBO.to = "1900-01-01";
    objBO.Prm1 = "";
    objBO.Logic = "OTSchedulePivot";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var col = [];
            for (var i = 0; i < data.ResultSet.Table.length; i++) {
                for (var key in data.ResultSet.Table[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }
            var t = "";
            t += "<table style='width:100%' class='table-bordered tblBorder'>";
            t += "<tr>";
            for (var i = 0; i < col.length; i++) {
                t += "<th style='text-align:center;width:30%;white-space:nowrap'>" + col[i] + "</th>";
            }
            t += "</tr>";
            $.each(data.ResultSet.Table, function (key, val) {
                t += "<tr>";
                for (var i = 0; i < col.length; i++) {
                    if (val[col[i]].includes('OT'))
                        t += "<td style='text-align:center;vertical-align:middle'>" + val[col[i]] + "</td>";
                    else {
                        var str = val[col[i]];
                        console.log(str);
                        if (str.length > 5) {
                            var slots = val[col[i]].split('|');
                            var s = "";
                            for (var j = 0; j < slots.length; j++) {
                                if (slots[j].length > 5) {
                                    var str2 = slots[j];
                                    var tr = str2.split('$');
                                    s += "<span id='" + tr[0] + "' onclick='OTScheduleInfo(this.id);'  class='badge  mr-1' style='font-size:10pt;background-color:#4caed1;'>" + tr[1] + "</span> ";
                                }

                            }
                            t += "<td style='text-align:center;vertical-align:middle'>" + s + "</td>";
                        }
                        else
                            t += "<td style='text-align:center;vertical-align:middle'></td>";

                    }
                }
                t += "</tr>";
            });
            t += "</table>";
            $('#divEntryForm').empty();
            $('#divEntryForm').html(t);

        },
        complete: function (com) {

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function OTScheduleInfo(AutoId) {
    var url = config.baseUrl + "/api/OT/OTScheduleQueries";
    var objBO = {};
    objBO.OTId = '-';
    objBO.DoctorId = '-';
    objBO.IPDNo = "";
    objBO.from = "1900-01-01";
    objBO.to = "1900-01-01";
    objBO.Prm1 = AutoId;
    objBO.Logic = "OTSchedulebyId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $.each(data.ResultSet.Table, function (key, val) {
                var Pinfo = '<b>UHID : ' + val.UHID + '</b> ';
                Pinfo += '<b>Patient Name : ' + val.patientName + '</b> ';
                Pinfo += '<b>Booking Date  : ' + val.bookingDate + '</b> ';
                Pinfo += '<b>Booking By  : ' + val.OTbookedby + '</b> ';
                Pinfo += '<b>Remark  : ' + val.Remark + '</b> ';
                $('#divOTInfo').html(Pinfo);
                $('#myModal3').modal('show');
            });

        },
        complete: function (com) {

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DoctorList() {
    $("#ddlDoctor").empty();
    var url = config.baseUrl + "/api/DoctorApp/IPD_ReferenceAndDischargeQueries";
    var objBO = {};
    objBO.DoctorId = '-';
    objBO.IPDNo = "-";
    objBO.from = "1900-01-01";
    objBO.to = "1900-01-01";
    objBO.Prm1 = "-";
    objBO.Logic = "DepartmentAndDoctorList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $("#ddlDoctor").append($('<option selected="selected"></option>').val("Select").html("Select")).select2();
            $.each(data.ResultSet.Table1, function (key, val) {
                $("#ddlDoctor").append($('<option></option>').val(val.DoctorId).html(val.DoctorName));
            });
            $("#ddlOTList").append($('<option selected="selected"></option>').val("Select").html("Select"));
            $.each(data.ResultSet.Table2, function (key, val) {
                $("#ddlOTList").append($('<option></option>').val(val.CartId).html(val.CartName));
            });
        },
        complete: function (com) {
            var DoctorId = localStorage.getItem('DoctorId');
            $("#ddlDoctor option").each(function () {
                if ($(this).val() == DoctorId) {
                    $("#ddlDoctor").prop('selectedIndex', '' + $(this).index() + '').change();
                    $("#ddlDoctor").prop('disabled', true);
                }
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function OTBooking() {

    if ($('#ddlOTList option:selected').val() == "Select") {
        alert("OT Name is not selected ");
        return;
    }
    if ($('#ddlDoctor option:selected').val() == "Select") {
        alert("Doctor Name is not selected ");
        return;
    }
    var url = config.baseUrl + "/api/DoctorApp/IPD_OTBookingInsertUpdate";
    var objBO = {};
    objBO.OTCartId = $('#ddlOTList option:selected').val();
    objBO.DoctorId = $('#ddlDoctor option:selected').val();
    objBO.UHID = $('#txtUHID').val();
    objBO.patientName = $('#txtName').val();
    objBO.patientMobile = $('#txtMobile').val();
    objBO.bookingDate = $('#txtDate').val();
    objBO.bookFromTime = $('#txtFromTime option:selected').text();
    objBO.bookToTime = $('#txtToTime option:selected').text();
    objBO.Remark = $('#txtRemark').val();
    objBO.ItemRequired = $('#txtItemRequired').val();
    objBO.bookBy = Active.userId;
    objBO.Logic = "Insert";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                Clear();
                $('#myModal').modal('hide');
                alert(data);
                OTSchedulePivot();
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error...!');
            $("#elLoader").hide();
        }
    });
}
function GetPatientListByMobileOrUHID() {

    if ($('#txtUHID').val() != '') {
        var url = config.baseUrl + "/api/DoctorApp/HIS_GetPatientListByMobileOrUHID";
        var objBO = {};
        objBO.DoctorId = localStorage.getItem('HISDoctorId');
        objBO.IPDNo = "-";
        objBO.from = "1900-01-01";
        objBO.to = "1900-01-01";
        objBO.Prm1 = $('#txtUHID').val();
        objBO.Logic = "-";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                var tbody = '<table class="table table-bordered" id="ptList" >';
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td><button class='btn btn-warning' id='btnSelectPatient'>Select</button></td>";
                    tbody += "<td>" + val.Patient_ID + "</td>";
                    tbody += "<td>" + val.PName + "</td>";
                    tbody += "<td>" + val.Mobile + "</td>";
                    tbody += "</tr>";
                });
                tbody += '</table>';
                $("#tdSearchPanel").html(tbody);
            },
            complete: function (res) {

            },
            error: function (response) {
                alert('Server Error...!');
                $("#elLoader").hide();
            }
        });
    }
}
function Clear() {
    $('input:text').val('');
    $('textarea').val('');
}


