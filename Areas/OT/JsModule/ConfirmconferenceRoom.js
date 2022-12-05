$(document).ready(function () {
    //$('table').on('click', 'td', function () {
    //    $(this).parents('tbody').find('tr').removeAttr('style')
    //    $(this).parents('tbody').find('td').removeAttr('style')
    //    $(this).closest('tr').css('background-color', '#0076d0')
    //    $(this).closest('tr').css('color','white')
    //});
    CloseSidebar();
    FillCurrentDate('txtFrom');
    FillCurrentDate15('txtTo');    
});


function ConferneceSchedule() {
    var url = config.baseUrl + "/api/OT/OTScheduleQueries";
    var objBO = {};
    objBO.from = $('#txtFrom').val();
    objBO.from = $('#txtTo').val();  
    objBO.Logic = "ConferneceSchedule";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            $('#tblDConferenceDetails tbody').empty();
            var tbody = '';
            var count = 0;
            var ConfName = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (ConfName != val.conferenceName) {
                            tbody += "<tr class='name-group'>";
                            tbody += "<td colspan='12'>" + val.conferenceName + "</td>";
                            tbody += "</tr>";
                            ConfName = val.conferenceName;
                        }
                        count++;
                        if (val.status == 'Approve')
                            tbody += "<tr style='background:#d4f3d4'>";
                        else if (val.status == 'Cancel')
                            tbody += "<tr style='background:#ff252573'>";
                        else
                            tbody += "<tr>";
                     
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.BookingId + "</td>";
                        tbody += "<td>" + val.BookingType + "</td>";
                        tbody += "<td>" + val.bookingDate + "</td>";
                        tbody += "<td>" + val.bookFromTime + "</td>";
                        tbody += "<td>" + val.bookToTime + "</td>";
                        tbody += "<td>" + val.subject + "</td>";
                        tbody += "<td>" + val.Remark + "</td>";
                        tbody += "<td>" + val.bookBy + "</td>";
                        tbody += "<td>" + val.status + "</td>";
                        tbody += "<td><button class='btn btn-warning btn-xs' onclick=selectRow(this);ConferneceSchedulebyId('" + val.BookingId + "')><span class='fa fa-sign-in'></span></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblDConferenceDetails tbody').append(tbody);
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

function ConferneceSchedulebyId(bookingId) {
    var url = config.baseUrl + "/api/OT/OTScheduleQueries";
    var objBO = {};
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = bookingId;
    objBO.Logic = "ConferneceSchedulebyId";
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
                        if (val.status != 'Pending') {
                            $('#btnConfirm').hide();
                            $('#btnCancel').hide();
                        }
                        else {
                            $('#btnConfirm').show();
                            $('#btnCancel').show();
                        }

                        $('#txtBookingId').text(val.BookingId);
                        $('#txtBookingType').text(val.BookingType);
                        $('#txtBookBy').text(val.bookBy);
                        $('#txtSubject').text(val.subject);
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

function ApproveAndCancle(status) {
    var url = config.baseUrl + "/api/DoctorApp/Conference_BookingInsertUpdate";
    var objBO = {}; 
    objBO.ConfId = status;
    objBO.BookingType ="";
    objBO.bookingDate = "1900/01/01";
    objBO.bookFromTime = 05;
    objBO.bookToTime = 17;
    objBO.Subject = "";   
    objBO.bookBy = "";
    objBO.Remark = $('#txtConfirmRemark').val();   
    objBO.Prm1 = $('#tblDConferenceDetails tbody tr.select-row').find('td:eq(1)').text();
    objBO.bookBy = Active.userId;
    objBO.Logic = "ConferenceApproveAndCancle";
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