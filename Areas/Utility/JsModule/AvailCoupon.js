$(document).ready(function () {
    $('#btnSearch').on('click', function () {
        var Prm1 = $('#txtSearch').val();
        GetCoupon(Prm1);
    });
});
function SendCoupon() {
    if (validate()) {
        var url = config.baseUrl + "/api/Utility/SendCoupon";
        var objBO = {};
        objBO.CouponType = 'SendOTP';
        objBO.mobileNo = $('#txtSearch').val();
        objBO.LabCode = Active.unitId;
        objBO.login_id = Active.userId;
        objBO.Logic = "AvailMobileCoupon";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                alert(data);
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function GetCoupon(Prm1) {
    if (validate()) {
        var url = config.baseUrl + "/api/Utility/CouponQueries";
        var objBO = {};
        objBO.prm_1 = Prm1;
        objBO.Logic = "AvailMobileCoupon";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                
                $("#tblCoupon tbody").empty();
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr style='background:" + val.status + "'>";
                    tbody += "<td>" + val.mobileNo + "</td>";
                    tbody += "<td>" + val.cust_name + "</td>";
                    tbody += "<td>" + val.couponCode + "</td>";
                    tbody += "<td><button class='btn-flat btn-warning' onclick='selectRow(this);InsertCoupons()'>Avail</button></td>";
                    tbody += "</tr>";
                });
                $("#tblCoupon tbody").append(tbody);
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function InsertCoupons() {
    var url = config.baseUrl + "/api/Utility/InsertMobileAppCoupons";
    var objBO = {};
    objBO.Mobile = $('.select-row').find('td:eq(0)').text();
    objBO.PatientName = $('.select-row').find('td:eq(1)').text();
    objBO.CouponCode = $('.select-row').find('td:eq(2)').text();
    objBO.labcode = Active.unitId;
    objBO.Logic = "InsertCoupon";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                alert('Coupon Availed Successfully..!');
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
function validate() {
    var mobile = $('#txtSearch').val();
    if (mobile.length > 10 || mobile.length<10) {
        alert('Please Provide Correct Mobile No..!');
        return false;
    }
    return true;
}
