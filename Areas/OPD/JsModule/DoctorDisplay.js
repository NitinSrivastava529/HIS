var length = 0;
var length1 = 0;
$(document).ready(function () {
    var doctorIds = query()['DoctorIds'];
    var arrDoctorId = [];
    arrDoctorId = doctorIds.split('|');
    if (arrDoctorId.length == 1) {
        $('.DoctorDisplay:eq(1)').hide();
        $('.DoctorDisplay').css('height', '99vh');
        $('.AllPending').css('height', '90vh');
        $('#myMarquee').css('height', '60%');
        $('#myMarquee').isNan;
        DoctorDisplayScreen1(arrDoctorId[0]);
        //setInterval(function () { DoctorDisplayScreen1(arrDoctorId[0]); }, 1000)
    }
    if (arrDoctorId.length == 2) {
        $('.DoctorDisplay:eq(1)').show();
        $('.DoctorDisplay').css('height', '50vh');
        $('.AllPending').css('height', '40vh');
        $('#myMarquee').css('height', '60%');
        $('#myMarquee1').css('height', '60%');
        DoctorDisplayScreen1(arrDoctorId[0]);
        DoctorDisplayScreen2(arrDoctorId[1]);

        //setInterval(function () {
        //    DoctorDisplayScreen1(arrDoctorId[0]);
        //    DoctorDisplayScreen2(arrDoctorId[1]);
        //}, 1000)
    }
});
function DoctorDisplayScreen1(doctorId) {
    var url = config.baseUrl + "/api/Appointment/Opd_DisplayTVQueries";
    var objBO = {};
    objBO.UHID = '-';
    objBO.AppointmentId = '-';
    objBO.DoctorId = doctorId;
    objBO.Logic = 'OPD:DoctorDisplayScreen';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('.DoctorInfo:eq(0)').find('doctor-name').text(val.DoctorName);
                    $('.DoctorInfo:eq(0)').find('degree').text(val.Degree2);
                    $('.DoctorInfo:eq(0)').find('designation').text(val.Designation);
                    $('.DoctorInfo:eq(0)').find('department').text(val.DeptName);
                    $('.DoctorInfo:eq(0)').find('img').attr('src', val.VirtualPhotoPath);
                });
            }
            if (Object.keys(data.ResultSet).length > 0) {
                var tbodyConsulting = "";
                var tbody = "";
                var table = "";
                var count = 0;
                $.each(data.ResultSet.Table1, function (key, val) {
                    if (val.InFlag == 'Y') {
                        tbodyConsulting += "<tr>"
                        tbodyConsulting += "<td class='text-center'>" + val.token_no + "</td>";
                        tbodyConsulting += "<td class='text-left'>" + val.patient_name + "</td>";
                        tbodyConsulting += "<td class='text-center'>";
                        tbodyConsulting += "<span class='color-in-room'>Consulting</span>";
                        tbodyConsulting += "</span>"
                        tbodyConsulting += "</td>"
                        tbodyConsulting += "</tr>"
                    }
                    if (val.InFlag == 'N' && count < 9) {
                        count++;
                        tbody += "<tr>"
                        tbody += "<td class='text-center'>" + val.token_no + "</td>";
                        tbody += "<td class='text-left'>" + val.patient_name + "</td>";
                        if (val.uStatus == 'Waiting')
                            tbody += "<td class='text-center'><span class='color-pending'>" + val.uStatus + "</span></td>";
                        else
                            tbody += "<td class='text-center'><span class='color-absent'>" + val.uStatus + "</span></td>";

                        tbody += "</tr>"
                    }
                });


                if (count < 1) {
                    $('.DoctorDisplay:eq(0) .tblAllPendingAbsent tbody').empty();
                }
                if (count < 7) {
                    length = 0;
                    $('.DoctorDisplay:eq(0) .tblAllPendingAbsent tbody').empty();
                    $('.DoctorDisplay:eq(0) .tblAllPendingAbsent1 tbody').empty().append(tbody);
                    $('.DoctorDisplay:eq(0) .tblConsulting tbody').empty().append(tbodyConsulting);
                }
                else {
                    length++;
                    tbody += "<tr>"
                    tbody += "<td colspan='3' class='text-center'>End Of List</td>";
                    tbody += "</tr>"
                    tbody += "<tr><td colspan='3' style='background:#fff' class='text-center'><img src='" + config.rootUrl + "/Content/logo/line.png'</td></tr>"
                    $('.DoctorDisplay:eq(0) .tblAllPendingAbsent tbody').empty();
                    $('.DoctorDisplay:eq(0) .tblAllPendingAbsent tbody').empty().append(tbody + tbody + tbody + tbody + tbody);
                    $('.DoctorDisplay:eq(0) .tblConsulting tbody').empty().append(tbodyConsulting);
                    if (length == 1) {
                        document.getElementById('myMarquee').stop();
                        document.getElementById('myMarquee').start();
                    }
                }
            }
            else {
                alert('No Record Found..');
            }
        },
        complete: function () {
            var consWidth = $('.DoctorDisplay:eq(0) .tblConsulting tbody').find('td:eq(2)').width();
            $('.DoctorDisplay:eq(0) .tblAllPendingAbsent tbody').find('td:eq(2)').width(consWidth);
        },
        error: function (response) {
            alert('Server Error...!');
        },
    });
}
function DoctorDisplayScreen2(doctorId) {
    var url = config.baseUrl + "/api/Appointment/Opd_DisplayTVQueries";
    var objBO = {};
    objBO.UHID = '-';
    objBO.AppointmentId = '-';
    objBO.DoctorId = doctorId;
    objBO.Logic = 'OPD:DoctorDisplayScreen';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('.DoctorInfo:eq(1)').find('doctor-name').text(val.DoctorName);
                    $('.DoctorInfo:eq(1)').find('degree').text(val.Degree2);
                    $('.DoctorInfo:eq(1)').find('designation').text(val.Designation);
                    $('.DoctorInfo:eq(1)').find('department').text(val.DeptName);
                    $('.DoctorInfo:eq(1)').find('img').attr('src', val.VirtualPhotoPath);
                });
            }
            if (Object.keys(data.ResultSet).length > 0) {
                var tbodyConsulting = "";
                var tbody = "";
                var table = "";
                var count = 0;
                $.each(data.ResultSet.Table1, function (key, val) {
                    if (val.InFlag == 'Y') {
                        tbodyConsulting += "<tr>"
                        tbodyConsulting += "<td class='text-center'>" + val.token_no + "</td>";
                        tbodyConsulting += "<td class='text-left'>" + val.patient_name + "</td>";
                        tbodyConsulting += "<td class='text-center'>";
                        tbodyConsulting += "<span class='color-in-room'>Consulting</span>";
                        tbodyConsulting += "</span>"
                        tbodyConsulting += "</td>"
                        tbodyConsulting += "</tr>"
                    }
                    if (val.InFlag == 'N' && count < 9) {
                        count++;
                        tbody += "<tr>"
                        tbody += "<td class='text-center'>" + val.token_no + "</td>";
                        tbody += "<td class='text-left'>" + val.patient_name + "</td>";
                        if (val.uStatus == 'Waiting')
                            tbody += "<td class='text-center'><span class='color-pending'>" + val.uStatus + "</span></td>";
                        else
                            tbody += "<td class='text-center'><span class='color-absent'>" + val.uStatus + "</span></td>";

                        tbody += "</tr>"
                    }
                });
                if (count < 1) {
                    $('.DoctorDisplay:eq(1) .tblAllPendingAbsent tbody').empty();
                }
                if (count < 7) {
                    length1 = 0;
                    $('.DoctorDisplay:eq(1) .tblAllPendingAbsent tbody').empty();
                    $('.DoctorDisplay:eq(1) .tblAllPendingAbsent1 tbody').empty().append(tbody);
                    $('.DoctorDisplay:eq(1) .tblConsulting tbody').empty().append(tbodyConsulting);
                }
                else {
                    length1++;
                    tbody += "<tr>"
                    tbody += "<td colspan='3' class='text-center'>End Of List</td>";
                    tbody += "</tr>"
                    tbody += "<tr><td colspan='3' style='background:#fff' class='text-center'><img src='" + config.rootUrl + "/Content/logo/line.png'</td></tr>"
                    $('.DoctorDisplay:eq(1) .tblAllPendingAbsent1 tbody').empty();
                    $('.DoctorDisplay:eq(1) .tblAllPendingAbsent tbody').empty().append(tbody + tbody + tbody + tbody + tbody);
                    $('.DoctorDisplay:eq(1) .tblConsulting tbody').empty().append(tbodyConsulting);
                    if (length1 == 1) {
                        document.getElementById('myMarquee1').stop();
                        document.getElementById('myMarquee1').start();
                    }
                }
            }
            else {
                alert('No Record Found..');
            }
        },
        complete: function () {
            var consWidth = $('.DoctorDisplay:eq(1) .tblConsulting tbody').find('td:eq(2)').width();
            $('.DoctorDisplay:eq(1) .tblAllPendingAbsent tbody').find('td:eq(2)').width(consWidth);
        },
        error: function (response) {
            alert('Server Error...!');
        },
    });
}