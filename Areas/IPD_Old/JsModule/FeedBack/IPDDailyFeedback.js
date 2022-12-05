var _DoctorId;
var _FloorName;
var _SelectedFloor;
var _SelectedRoomType;
$(window).on('load', function () {
	var height = $(window).height();
	var height2 = parseInt($(window).height()) - 370;
	$('#IPDPatientList').css('min-height', height + 'px');
	$('#IPDPatientList2').css('min-height', height2 + 'px');
});
$(document).ready(function () {
	GetPatientDetails();
    $('#ddlRoom').on('change', function () {
        _SelectedFloor = this.value;
        updateFilters();
    });
    $('#ddlRoomType').on('change', function () {
        _SelectedRoomType = this.value;
        updateFilters();
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
function updateFilters() {
    $('#IPDPatientList .section').hide().filter(function () {
        var self = $(this),
            result = true;

        if (_SelectedFloor && (_SelectedFloor != 'ALL')) {
            result = result && _SelectedFloor === self.data('floor');
        }
        if (_SelectedRoomType && (_SelectedRoomType != 'ALL')) {
            result = result && _SelectedRoomType === self.data('roomtype');
        }
        return result;
    }).show();
}
function takeFeedback() {
	$('.pfeedbackList').hide();
	$('.pfeedback').show();
}
function QuestForDailyIPD(elem) {
	$('#tblQuest tbody').empty();
	var url = config.baseUrl + "/api/IPDNursing/IPD_FeedbackQuesries";
	var objBO = {};
	objBO.Prm1 = $(elem).parents('table').find('tr:nth-child(1)').find('td:nth-child(3)').text();
	objBO.Prm2 = '-';
	objBO.Logic = 'QuestForDailyIPD';
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
            _FloorName = $(elem).parents('table').find('tbody tr:nth-child(4)').find('td:nth-child(3)').find('span3').text();
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
				tbody += "<th></th>";
				tbody += "<th colspan='6'><b>" + val.QInfo + "</b></th>";
				tbody += "</tr>";
				tbody += "<tr>";
				tbody += "<th style='font-size: 13px;padding:7px'><b>" + count + "</b></th>";
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

				tbody += "<th><input type='text' class='form-control' value='" + val.remark + "' placeholder='Remark'/></th>";
				tbody += "<th style='display:none'>" + val.UseFor + "</b></th>";
				tbody += "<th style='display:none'>" + val.Qno + "</b></th>";
				tbody += "</tr>";
				$('#txtAttendantName').val(val.attendantName);
			});
			$('#tblQuest tbody').append(tbody);
			$('#modalIPDFeedback').modal('show');
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
    objBO.FloorName = _FloorName;
	objBO.AdmitDate = $('#txtpAdmitDate span').text();
	objBO.OverallFeedback = '-';
	objBO.OverallRating = '-';
	objBO.IsCompleted = 'N';
	objBO.FeedbackType = $(elem).closest('tr').find('th:eq(7)').text();
	objBO.QuestId = $(elem).closest('tr').find('th:eq(8)').text();
	objBO.Feedback = $(elem).data('feedback');
	objBO.Rating = $(elem).data('rating');
	objBO.Prm1 = $(elem).closest('tr').find('th:eq(6)').find('input').val();
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'InsertIPDRating';
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
function AttendRemark() {
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
	objBO.OverallFeedback = '-';
	objBO.OverallRating = '-';
	objBO.IsCompleted = 'N';
	objBO.FeedbackType = 'IPD-DAILY-FEEDBACK';
	objBO.QuestId = '-';
	objBO.Feedback = '-';
	objBO.Rating = '-';
	objBO.Prm1 = $('#txtAttendantName').val();
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'AttendRemarkForDailyRating';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert(data)
				$('#txtAttendantName').val('');
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
    $('#IPDPatientList').empty();
    var url = config.baseUrl + "/api/IPDNursing/PatientListForFeedBack";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = 'DailyFeedBackTaken';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var html = ""; var room = []; var roomType = [];
            $.each(data.Table1, function (key, val) {

                var r = val.RoomName.split('/');
                room.push(r[3]);
                roomType.push(val.RoomType);

                html += "<div  class='section' data-roomtype='" + val.RoomType +"' data-floor='" + r[3] + "'>";
                html += "<table class='table'>";
                html += "<tr>";
                html += "<th>IPD No</th>";
                html += "<th>:</th>";
                html += "<td>" + val.IPDNO + "</td>";
                html += "<th>&nbsp</th>";
                html += "<th>Patient Name</th>";
                html += "<th>:</th>";
                html += "<td>" + val.PName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th>Age</th>";
                html += "<th>:</th>";
                html += "<td>" + val.Age + "</td>";
                html += "<td style='display:none'>" + val.Gender + "</td>";
                html += "<th>&nbsp</th>";
                html += "<th>Room No</th>";
                html += "<th>:</th>";
                html += "<td>" + val.RoomName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th>Admitted Under</th>";
                html += "<th>:</th>";
                html += "<td colspan='5'>" + val.DName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th>Admit Date</th>";
                html += "<th>:</th>";
                html += "<td colspan='5'><span1>" + val.AdmitDate + "</span1><span2 style='display:none'>" + val.DoctorId + "</span2><span3 style='display:none'>" + val.Floor + "</span3>";
                html += "<span class='text-right' style='margin: -4px 0;float:right'>";

                if (!_isContains(data.Table2, val.IPDNO))
                    html += "<button class='btn btn-warning btn-xs pull-right' onclick=QuestForDailyIPD(this)><i class='fa fa-edit'>&nbsp;</i>Take Feedback</button>";
                else
                    html += "<button class='btn btn-success btn-xs pull-right' onclick=QuestForDailyIPD(this)><i class='fa fa-edit'>&nbsp;</i>Take Feedback</button>";

                html += "</span>";
                html += "</td>";
                html += "</tr>";
                html += "</table>";
                html += "</div>";
            });
            $('#IPDPatientList').append(html);
            $('#ddlRoom').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
            var unique = room.filter(function (itm, i, room) {
                return i == room.indexOf(itm);
            });
            for (i = 0; i < unique.length; i++) {
                var data = '<option>' + unique[i] + '</option>'
                $('#ddlRoom').append(data);
            }

            $('#ddlRoomType').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
            var unique1 = roomType.filter(function (itm, i, room) {
                return i == roomType.indexOf(itm);
            });
            for (i = 0; i < unique1.length; i++) {
                var data = '<option>' + unique1[i] + '</option>'
                $('#ddlRoomType').append(data);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
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
function PrintDoc() {
    var divContents = document.getElementById("IPDPatientList").innerHTML;
    var a = window.open('', '', 'height=500, width=500');
    a.document.write('<html>');
    a.document.write('<body > <h1>Div contents are <br>');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
}