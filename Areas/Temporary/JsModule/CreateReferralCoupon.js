
$(document).ready(function () {
	ReferralList();
	searchTable('txtSearchReferral','tblReferral')
	$('#tblReferral').on('click', 'td', function () {
		selectRow($(this));
	});

});
function ReferralList() {
	var url = config.baseUrl + "/api/temp/Coupon_ReferralBookletQueries";
	var objBO = {};
	objBO.ref_code = '-';
	objBO.BookletNo = '-';
	objBO.CouponNo = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.prm1 = '-';
	objBO.Logic = 'ReferralList';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#tblReferral tbody").empty();
			var tbody = "";
			$.each(data.ResultSet.Table, function (key, val) {
				tbody += "<tr>";
				tbody += "<td>" + val.ref_code + "</td>";
				tbody += "<td>" + val.ref_name + "</td>";
				tbody += "<td>" + val.c_address + "</td>";
				tbody += "<td>" + val.c_city + "</td>";
				tbody += "<td><button onclick=GetCouponsOfBooklet('" + val.ref_code + "') class='btn btn-success'>>></button></td>";
				tbody += "</tr>";
			});
			$("#tblReferral tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetCouponsOfBooklet(refcode) {
	var url = config.baseUrl + "/api/temp/Coupon_ReferralBookletQueries";
	var objBO = {};
	objBO.ref_code = refcode;
	objBO.BookletNo = '-';
	objBO.CouponNo = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.prm1 = '-';
	objBO.Logic = 'GetCouponsOfBooklet';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#tblCoupon tbody").empty();
			var tbody = "";
			var temp = "";
			$.each(data.ResultSet.Table, function (key, val) {
				if (temp != val.BookletNo) {
					tbody += "<tr style='background:#ddd'>";
					tbody += "<td colspan='6'>" + val.BookletNo + "</td>";
					tbody += "</tr>";
					temp = val.BookletNo;
				}
				tbody += "<tr>";
				tbody += "<td>" + val.BookletNo + "</td>";
				tbody += "<td>" + val.CouponNo + "</td>";
				tbody += "<td>" + val.availBy + "</td>";
				tbody += "<td>" + val.availDate + "</td>";
				tbody += "<td>" + val.UHID + "</td>";
				tbody += "<td>" + val.cr_date + "</td>";			
				tbody += "</tr>";
			});
			$("#tblCoupon tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GenCoupon() {
	var url = config.baseUrl + "/api/temp/Coupon_ReferralBookletInsertUpdate";	
	var objBO = {};
	objBO.ref_code = $('#tblReferral tbody').find('tr.select-row').find('td:eq(0)').text();
	objBO.BookletNo = $('#txtBookletNo').val();
	objBO.CouponNo = '-';
	objBO.UHID = '-';
	objBO.login_id = Active.userId;
	objBO.prm1 = '-';	
	objBO.Logic = 'Gen-Coupon';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				GetCouponsOfBooklet(objBO.ref_code);
			}
			else {
				alert("Error");
			};
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function AvailCoupon() {
	var url = config.baseUrl + "/api/temp/Insert_CouponReferralBooklet";
	var objBO = {};
	objBO.ref_code = '-';
	objBO.BookletNo = '-';
	objBO.CouponNo = '-';
	objBO.UHID = '-';
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

			}
			else {
				alert("Error");
			};
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}






