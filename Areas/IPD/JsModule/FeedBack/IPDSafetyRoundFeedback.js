var _SelectedFloor;
var _SelectedRoomType;
var _BedNo;
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
function QuestForIPDSafetyRound(elem) {
	$('#tblQuest tbody').empty();
	var url = config.baseUrl + "/api/IPDNursing/IPD_ClinicalSafetyRoundQuesries";
	var objBO = {};
	objBO.Prm1 = $(elem).parents('table').find('tr:nth-child(1)').find('td:nth-child(3)').text();
	objBO.Prm2 = '-';
	objBO.Logic = 'QuestForIPDSafetyRound';
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
            _BedNo = $(elem).parents('table').find('tbody tr:nth-child(4)').find('td:nth-child(3)').find('span5').text();
            $('#modalIPDFeedback #txtpIPDNo').text(ipdno);
			$('#modalIPDFeedback #txtpPatientName').text(pname);
			$('#modalIPDFeedback #txtpAge').text(age);
			$('#modalIPDFeedback #txtpGender').text(gender);
			$('#modalIPDFeedback #txtpRoomNo').text(room);
			$('#modalIPDFeedback #txtpAdmittedUnder').text(admitUnder);
			$('#modalIPDFeedback #txtpAdmitDate span').text(admitDate);
			var color = "";
			$.each(data.ResultSet.Table, function (key, val) {
				count++;
				if (val.IsCompleted == 'Y')
					tbody += "<tr class='Inactive'>";
				else
					tbody += "<tr>";
				tbody += "<th><b>" + count + "</b></th>";
				tbody += "<th>" + val.QInfo + "</th>";
				tbody += "<th style='width: 25%;'>";
				if (val.CheckupStatus == 'YES') {
					tbody += "<label><input type='radio' name=" + val.Qno + " checked='checked' value='YES'/>YES</label>&nbsp;";
					tbody += "<label><input type='radio' name=" + val.Qno + " value='NO'/>NO</label>";
				}
				else if (val.CheckupStatus == 'NO') {
					tbody += "<label><input type='radio' name=" + val.Qno + " value='YES'/>YES</label>&nbsp;";
					tbody += "<label><input type='radio' name=" + val.Qno + " checked='checked' value='NO'/>NO</label>";
				}
				else {
					tbody += "<label><input type='radio' name=" + val.Qno + " value='YES'/>YES</label>&nbsp;";
					tbody += "<label><input type='radio' name=" + val.Qno + " value='NO'/>NO</label>";
				}
				tbody += "</th>";
				tbody += "<th><input type='text' class='form-control' value='" + val.Remark + "' placeholder='Remark'/></th>";
				tbody += "<th style='display:none'>" + val.UseFor + "</b></th>";
				tbody += "<th style='display:none'>" + val.Qno + "</b></th>";
				tbody += "<th><button class='btn btn-warning btn-xs' onclick=InsertSafetyRound(this)><i class='fa fa-check-circle'>&nbsp;</i>Save</button></th>";
				tbody += "</tr>";
			});
			$('#tblQuest tbody').append(tbody);
			$('#modalIPDFeedback').modal('show');
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertSafetyRound(elem) {
	var url = config.baseUrl + "/api/IPDNursing/IPD_InsertClinicalSafetyRound";
	var objBO = {};
    objBO.IPDNo = $('#txtpIPDNo').text();
    objBO.PatientName = $('#txtpPatientName').text();
    objBO.Age = $('#txtpAge').text().split(' ')[0];
    objBO.AgeType = $('#txtpAge').text().split(' ')[1];
    objBO.Gender = $('#txtpGender').text();
    objBO.AdmittedDoctorId = _DoctorId;
    objBO.AdmittDoctorName = $('#txtpAdmittedUnder').text();
    objBO.FloorName = _FloorName;
    objBO.BedNo = _BedNo;
	objBO.CheckupType = $(elem).closest('tr').find('th:eq(4)').text();
	objBO.CheckupStatus = $(elem).closest('tr').find('input[type=radio]:checked').val();
	objBO.Remark = $(elem).closest('tr').find('th:eq(3)').find('input[type=text]').val();
	objBO.QuestId = $(elem).closest('tr').find('th:eq(5)').text();
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.attendantName = '-';
	objBO.Logic = 'InsertSafetyRound';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				$(elem).closest('tr').addClass('Inactive');
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
function GetPatientDetails() {
	$('#IPDPatientList').empty();
    var url = config.baseUrl + "/api/IPDNursing/PatientListForFeedBack";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = 'SafetyRoundCheckup';
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
                html += "<div class='section' data-roomtype='" + val.RoomType +"' data-floor='" + r[3] + "'>";
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
                html += "<td colspan='5'><span1>" + val.AdmitDate + "</span1> <span2 style='display:none'>" + val.DoctorId + "</span2><span3 style='display:none'>" + val.Floor + "</span3><span4 style='display:none'>" + val.Mobile + "</span4><span5 style='display:none'>" + val.BedNo + "</span5>";
				html += "<span class='text-right' style='margin: -4px 0;float:right'>";

                if (!_isContains(data.Table2, val.IPDNO))
                    html += "<button class='btn btn-warning btn-xs pull-right' onclick=QuestForIPDSafetyRound(this)><i class='fa fa-edit'>&nbsp;</i>Check</button>";
                else
                    html += "<button class='btn btn-success btn-xs pull-right' onclick=QuestForIPDSafetyRound(this)><i class='fa fa-edit'>&nbsp;</i>Check</button>";
          
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