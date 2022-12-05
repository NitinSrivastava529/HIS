var _DoctorId;
$(window).on('load', function () {
	var height = $(window).height();
	var height2 = parseInt($(window).height()) - 370;
	$('#IPDPatientList').css('min-height', height + 'px');
	$('#IPDPatientList2').css('min-height', height2 + 'px');
});
$(document).ready(function () {
	GetPatientDetails();
	$('#ddlRoom').on('change', function () {
		var val = $(this).find('option:selected').text();
		$('#IPDPatientList .section').filter(function () {
			$(this).toggle($(this).data('floor').indexOf(val) > -1);
		});
	});
	$('#header-btn').on('click', function () {
		var height = $(window).height();
		var height2 = parseInt($(window).height()) - 370;
		$('#IPDPatientList').css('min-height', height + 'px');
		$('#IPDPatientList2').css('min-height', height2 + 'px');
	});
	$('#txtSearchPatient').on('keyup', function () {
		var val = $(this).val().toLowerCase();
		$('#IPDPatientList .section').filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
		});
	});
});
function takeFeedback() {
	$('.pfeedbackList').hide();
	$('.pfeedback').show();
}
function QuestForIPD(elem) {
	$('#tblQuest tbody').empty();
	var url = config.baseUrl + "/api/IPDNursing/IPD_FeedbackQuesries";
	var objBO = {};
	objBO.Prm1 = $(elem).parents('table').find('tr:nth-child(1)').find('td:nth-child(3)').text();
	objBO.Prm2 = '-';
	objBO.Logic = 'QuestForOPD';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var tbody = "";
			var count = 0;
			var ipdno = $(elem).parents('table').find('tr:nth-child(1)').find('td:nth-child(3)').text();
			var pname = $(elem).parents('table').find('tbody tr:nth-child(1)').find('td:nth-child(7)').text();
			var age = $(elem).parents('table').find('tbody tr:nth-child(2)').find('td:nth-child(3)').text();
			var gender = $(elem).parents('table').find('tbody tr:nth-child(2)').find('td:nth-child(4)').text();
			var room = $(elem).parents('table').find('tbody tr:nth-child(2)').find('td:nth-child(8)').text();
			var admitUnder = $(elem).parents('table').find('tbody tr:nth-child(3)').find('td:nth-child(3)').text();
            var admitDate = $(elem).parents('table').find('tbody tr:nth-child(4)').find('td:nth-child(3)').find('span1').text();
            _DoctorId = $(elem).parents('table').find('tbody tr:nth-child(4)').find('td:nth-child(3)').find('span2').text();
			$('#modalIPDFeedback #txtpIPDNo').text(ipdno);
			$('#modalIPDFeedback #txtpPatientName').text(pname);
			$('#modalIPDFeedback #txtpAge').text(age);
			$('#modalIPDFeedback #txtpGender').text(gender);
			$('#modalIPDFeedback #txtpRoomNo').text(room);
			$('#modalIPDFeedback #txtpAdmittedUnder').text(admitUnder);
			$('#modalIPDFeedback #txtpAdmitDate span').text(admitDate);
			var color = "";
			$.each(data.ResultSet.Table, function (key, val) {
				if (val.IsCompleted == 'Y') $('#btnFinalSubmit').prop('disabled', true); else $('#btnFinalSubmit').prop('disabled', false);
				if (val.IsCompleted == 'Y') $('#txtIsCompletd').show(); else $('#txtIsCompletd').hide();
				color = "";
				if (val.rating == 1) color = "style='background:#e71515'";
				if (val.rating == 2) color = "style='background:#e95e5e'";
				if (val.rating == 3) color = "style='background:#ffa3a3'";
				if (val.rating == 4) color = "style='background:#e79315'";
				if (val.rating == 5) color = "style='background:#01a95c'";
				count++;
				tbody += "<tr>";
				tbody += "<th><b>" + count + "</b></th>";
				tbody += "<th>" + val.QInfo + "</th>";
				if (val.rating == 1)
					tbody += "<th><div class='ratecircle " + val.IsRate + "' " + color + ">1</div></th>";
				else
					tbody += "<th><div data-feedback='Very Poor' data-rating='1' class='ratecircle " + val.IsRate + "' onclick=InsertRating(this)>1</div></th>";

				if (val.rating == 2)
					tbody += "<th><div class='ratecircle " + val.IsRate + "' " + color + ">2</div></th>";
				else
					tbody += "<th><div data-feedback='Dissatisfied' data-rating='2' class='ratecircle " + val.IsRate + "' onclick=InsertRating(this)>2</div></th>";

				if (val.rating == 3)
					tbody += "<th><div class='ratecircle " + val.IsRate + "' " + color + ">3</div></th>";
				else
					tbody += "<th><div data-feedback='Natural' data-rating='3' class='ratecircle " + val.IsRate + "' onclick=InsertRating(this)>3</div></th>";

				if (val.rating == 4)
					tbody += "<th><div class='ratecircle " + val.IsRate + "' " + color + ">4</div></th>";
				else
					tbody += "<th><div data-feedback='Satisfied' data-rating='4' class='ratecircle " + val.IsRate + "'  onclick=InsertRating(this)>4</div></th>";

				if (val.rating == 5)
					tbody += "<th><div class='ratecircle " + val.IsRate + "' " + color + ">5</div></th>";
				else
					tbody += "<th><div data-feedback='Very Satisfied' data-rating='5' class='ratecircle " + val.IsRate + "' onclick=InsertRating(this)>5</div></th>";

				tbody += "<th style='display:none'>" + val.UseFor + "</b></th>";
				tbody += "<th style='display:none'>" + val.Qno + "</b></th>";
				tbody += "</tr>";
				$('#modalIPDFeedback #txtOverallFeedback').val(val.OverAllFeedback);
				$('#modalIPDFeedback #txtOverallRating').text(val.overAllRating);
			});
			$('#tblQuest tbody').append(tbody);
			$('#modalIPDFeedback').modal('show');
			TotalRating(objBO.Prm1);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function TotalRating(ipd) {
	var url = config.baseUrl + "/api/IPDNursing/IPD_FeedbackQuesries";
	var objBO = {};
	objBO.Prm1 = ipd;
	objBO.Prm2 = 'OPD-FEEDBACK';
	objBO.Logic = 'TotalRating';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var color = "";
			$.each(data.ResultSet.Table, function (key, val) {
				color = "";
				if (val.totalRating == 0) color = "#e71515";
				if (val.totalRating <= 1 && val.totalRating > 0) color = "#e71515";
				if (val.totalRating <= 2 && val.totalRating > 1) color = "#e95e5e";
				if (val.totalRating <= 3 && val.totalRating > 2) color = "#ffa3a3";
				if (val.totalRating <= 4 && val.totalRating > 3) color = "#e79315";
				if (val.totalRating <= 5 && val.totalRating > 4) color = "#01a95c";

				$('#txtOverallRating').text(val.totalRating);
				$('#txtOverallRating').css('background', color);
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertRating(elem) {
	var url = config.baseUrl + "/api/IPDNursing/IPD_InsertFeedback";
	var objBO = {};
	objBO.IPDNo = $('#txtpIPDNo').text();
	objBO.PatientName = $('#txtpPatientName').text();
	objBO.Age = $('#txtpAge').text().split(' ')[0];
	objBO.AgeType = $('#txtpAge').text().split(' ')[1];
    objBO.Gender = $('#txtpGender').text();
    objBO.AdmittedDoctorId = _DoctorId;
	objBO.AdmittDoctorName = $('#txtpAdmittedUnder').text();
    objBO.AdmitDate = "1900/01/01"; $('#txtpAdmitDate span').text();
	objBO.OverallFeedback = '-';
	objBO.OverallRating = '-';
	objBO.IsCompleted = 'N';
	objBO.FeedbackType = $(elem).closest('tr').find('th:eq(7)').text();
	objBO.QuestId = $(elem).closest('tr').find('th:eq(8)').text();
	objBO.Feedback = $(elem).data('feedback');
	objBO.Rating = $(elem).data('rating');
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'InsertOPDRating';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var color = "";
			if (data.includes('Success')) {
				color = "";
				if (objBO.Rating == 1) color = "#e71515";
				if (objBO.Rating == 2) color = "#e95e5e";
				if (objBO.Rating == 3) color = "#ffa3a3";
				if (objBO.Rating == 4) color = "#e79315";
				if (objBO.Rating == 5) color = "#01a95c";
				$(elem).closest('tr').find('div.ratecircle').addClass('Inactive');
				$(elem).css('background', color);
				TotalRating(objBO.IPDNo);
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
function FinalRating() {
	var url = config.baseUrl + "/api/IPDNursing/IPD_InsertFeedback";
	var objBO = {};
	objBO.IPDNo = $('#txtpIPDNo').text();
	objBO.PatientName = '-';
	objBO.Age = '-';
	objBO.AgeType = '-';
	objBO.Gender = '-';
	objBO.AdmittedDoctorId = '-';
	objBO.AdmittDoctorName = '-';
	objBO.AdmitDate = '1900/01/01';
	objBO.OverallFeedback = $('#txtOverallFeedback').val();
	objBO.OverallRating = $('#txtOverallRating').text();
	objBO.IsCompleted = '-';
	objBO.FeedbackType = 'OPD-FEEDBACK';
	objBO.QuestId = '-';
	objBO.Feedback = '-';
	objBO.Rating = '-';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'FinalIPDRating';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert(data)
				$('#txtOverallFeedback,#txtOverallRating').val('');
				$('#modalIPDFeedback').modal('hide');
			}
			else
				alert(data)
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetPatientDetails() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
	var today = year + "-" + month + "-" + day;

	$('#IPDPatientList').empty();
	var url = config.baseUrl + "/api/IPDNursing/GetOPDEvery10PatientList";
	var objBO = {};
	objBO.from = today;
	objBO.Logic = 'OPDLIstof10thPatient';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			var html = ""; var room = [];
            $.each(data.Table1, function (key, val) {
				html += "<div class='section' data-floor='" + val.row_number + "'>";
				html += "<table class='table'>";
				html += "<tr>";
				html += "<th>OPD No</th>";
				html += "<th>:</th>";
				html += "<td>" + val.App_id + "</td>";
				html += "<th>&nbsp</th>";
				html += "<th>Patient Name</th>";
				html += "<th>:</th>";
				html += "<td>" + val.PName + "</td>";
				html += "</tr>";
				html += "<tr>";
				html += "<th>Age</th>";
				html += "<th>:</th>";
				html += "<td>" + val.Age + "</td>";
				html += "<td style='display:none'>" + val.Sex + "</td>";
				html += "<th>&nbsp</th>";
				html += "<th>Gender</th>";
				html += "<th>:</th>";
				html += "<td>" + val.Sex + "</td>";
				html += "</tr>";
				html += "<tr>";
				html += "<th>Consultant Name</th>";
				html += "<th>:</th>";
				html += "<td colspan='5'>" + val.Doctor + "</td>";
				html += "</tr>";
				html += "<tr>";
				html += "<th>Contact No</th>";
				html += "<th>:</th>";
                html += "<td colspan='5'><span1><i class='fa fa-phone' style='color: #1f7cef;'>&nbsp;</i><a  style='color: #1f7cef;' href='tel:" + val.ContactNo + "'>" + val.ContactNo + "</a></span1><span2 style='display:none'>" + val.Doctor_ID + "</span2>";
				html += "<span class='text-right' style='margin: -4px 0;float:right'>";

                if (!_isContains(data.Table2, eval(val.App_id)))
                    html += "<button class='btn btn-warning btn-xs pull-right' onclick=QuestForIPD(this)><i class='fa fa-edit'>&nbsp;</i>Take Feedback</button>";
                else
                    html += "<button class='btn btn-success btn-xs pull-right' onclick=QuestForIPD(this)><i class='fa fa-edit'>&nbsp;</i>Take Feedback</button>";

                //html += "<button class='btn btn-warning btn-xs pull-right' onclick=QuestForIPD(this)><i class='fa fa-edit'>&nbsp;</i>Take Feedback</button>";
				html += "</span>";
				html += "</td>";
				html += "</tr>";
				html += "</table>";
				html += "</div>";
			});
			$('#IPDPatientList').append(html);			
		},
		error: function (response) {
			alert('Server Error...!');
		},
	});
}
function _isContains(json, value) {
    
    let contains = false;
    Object.keys(json).some(key => {
        contains = typeof json[key] === 'object' ?
            _isContains(json[key], value) : json[key] === value;
        return contains;
    });
    return contains;
}