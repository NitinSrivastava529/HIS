$(document).ready(function () {
    $('#btnPatientInfo').on('click', function () {
        var searchBy = $('input[name=PatientInfo]:checked').val();
        if (searchBy == 'UHID') {
            GetPatientDetailByUHID();
        }
        else if (searchBy == 'IPD') {
            GetPatientDetailByIPDNo();
        }
        else {
            return
        }
    });
});
function GetPatientDetailByIPDNo() {
    var url = config.baseUrl + "/api/commission/GetPatientDetailByIPDNo";
    var IPDNo = $('#txtFind').val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(IPDNo),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            $('#tblPatient tbody').empty();
            var tbody = "";
            $.each(data.ResultSet.Table, function (key, val) {
                tbody += "<tr>";
                tbody += "<td>" + IPDNo + "</td>";
                tbody += "<td>" + val.PNAME + "</td>";
                tbody += "<td>" + val.Gender + "</td>";
                tbody += "<td>" + val.Consultant_Name + "</td>";
                tbody += "<td>" + val.Company_name + "</td>";
                tbody += "<td>" + ddmmyyToyymmdd(val.DateOfAdmit.split('T')[0], '-') + "</td>";
                tbody += "<td>" + ddmmyyToyymmdd(val.DateOfDischarge.split('T')[0], '-') + "</td>";
                tbody += "</tr>";
            });
            $('#tblPatient tbody').append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPatientDetailByUHID() {
    var url = config.baseUrl + "/api/commission/GetPatientDetailByUHID";
    var uhid = $('#txtFind').val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(uhid),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.Msg.includes('Success')) {
                //CH/18/000001
                $('#tblPatient tbody').empty();
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + uhid + "</td>";
                    tbody += "<td>" + val.PNAME + "</td>";
                    tbody += "<td>" + val.Gender + "</td>";
                    tbody += "<td>-</td>";
                    tbody += "<td>-</td>";
                    tbody += "<td>-</td>";
                    tbody += "<td>-</td>";
                    tbody += "</tr>";
                });
                $('#tblPatient tbody').append(tbody);
            }
            else {
                alert('Data Not Found..');
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AvailCoupon() {
    if ($('#tblPatient tbody tr').length == 0) {
        alert('Please Very Info By UHID Or IPD..');
        return;
    }
    if ($('#txtCouponNo').val() == '' || $('#txtUHID').val() == '') {
        alert('Please Provide Coupon No And UHID..!');
        return
    }
    var url = config.baseUrl + "/api/temp/Coupon_ReferralBookletInsertUpdate";
    var objBO = {};
    objBO.ref_code = '-';
    objBO.BookletNo = '-';
    objBO.CouponNo = $('#txtCouponNo').val();
    objBO.UHID = $('#txtUHID').val();
    objBO.login_id = Active.userId;
    objBO.prm1 = '-';
    objBO.Logic = 'Avail-Coupon';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data)
                $('#btnAvail').prop('disabled', true);
                $('input:text').val('');
                $('.Msg').empty();
                $('.Msg').hide();
            }
            else {
                alert(data);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Validate() {
    if ($('#txtCouponNo').val() == '') {
        alert('Please Provide Coupon No..!');
        return
    }
    $('.Msg').empty();
    var url = config.baseUrl + "/api/temp/Coupon_ReferralBookletQueries";
    var objBO = {};
    objBO.ref_code = '';
    objBO.BookletNo = '-';
    objBO.CouponNo = $('#txtCouponNo').val();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.prm1 = '-';
    objBO.Logic = 'ValidateCoupon';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $.each(data.ResultSet.Table, function (key, val) {
                $('.Msg').append('<span>' + val.Message + '</span>');
                $('.Msg').show();
                if (val.IsAvailed == 0) {
                    $('#btnAvail').prop('disabled', false);
                    $('.Msg').css('background', '');
                    $('.Msg').css('background', '#bd9502');
                }
                else {
                    $('#btnAvail').prop('disabled', true);
                    $('.Msg').css('background', 'green');
                }
            })
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
