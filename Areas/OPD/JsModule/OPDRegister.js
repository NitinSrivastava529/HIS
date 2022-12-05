$(document).ready(function () {
 
	CloseSidebar();
	GetDoctor();
	$('select').select2();
	FillCurrentDate("txtSearchFrom");
	FillCurrentDate("txtSearchTo");

	$('#btnSearchByOption').click(function () {
		SearchByKey();
	});

	$('#btnSearchByDate').click(function () {
		SearchByDate();
	});

	$('#tblOPDRegister tbody').on('click', 'button.Reschedule', function () {
		selectRow($(this));
		var doctor = $(this).data('doctorid');
		var date = $(this).closest('tr').find('td:eq(9)').text();
		var d = date.split('-');
		var newDate = d[2] + '-' + d[1] + '-' + d[0];
		var doctorName = $(this).closest('tr').find('td:eq(2)').text();
		var appTime = $(this).closest('tr').find('td:eq(8)').text();
		DoctorTimeSlots(date, doctor, doctorName, appTime);
		$('#txtDrTimeSlots').text(doctorName + '(' + doctor + ')');
		$('#txtTimeSlotsByDate').val(newDate);
	});

	$('#tblOPDRegister tbody').on('click', 'button.Cancelled', function () {
		selectRow($(this));
		var appNo = $(this).data('app_no');
		CancelBooking(appNo);
	});

	$('#txtTimeSlotsByDate').on('change', function () {

		var date = $(this).val();
		var dr = $('#txtDrTimeSlots').text().split('(');
		var doctor = dr[1].split(')');
		var appTime = $('#tblOPDRegister tbody').find('tr.select-row').find('td:eq(8)').text();
		DoctorTimeSlots(date, doctor[0], dr[0], appTime);

	});

	$('.TimeFrame').on('click', 'span.TimeSlot:not([disabled])', function () {
		var time = $(this).text().substring(0, 17);
		$('#txtNewAppointmentTime').text(time);
		$('span.TimeSlot:not([disabled])').removeClass('slot-selected');
		$(this).addClass('slot-selected');
	});


	$('#btnReschedule').on('click', function () {
		if (confirm('Are you sure to Reschedule?')) {
			RescheduleBooking();
		}
	});

});

function DoctorTimeSlots(date, doctor, doctorName, appTime) {
	var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
	var objBO = {};
	objBO.from = date;
	objBO.DoctorId = doctor;
	objBO.Logic = 'DoctorTimeSlots';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		async: false,
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length) {
					$('#modalTimeAvailability .TimeFrame').empty();
					var slots = "";
					//$('#txtDrTimeSlots').text(doctorName);
					//$('.TimeSlot-Title input[id=btnReschedule]').data('doctorid', doctor);
					$('#txtAppointmentTime').text(appTime);
					$('#txtNewAppointmentTime').text('00.00');
					$.each(data.ResultSet.Table, function (key, val) {
						if (val.slotStatus == 'Booked') {
							slots += "<span class='TimeSlot' disabled>" + val.Final_InShift + "-" + val.Final_outShift + "<br/><span class='TimeSlot-Status'>" + val.slotStatus + "</span></span>";
						}
						else if (val.slotStatus == 'OnLeave') {
							slots += "<span class='TimeSlot' disabled>" + val.Final_InShift + "-" + val.Final_outShift + "<br/><span class='TimeSlot-Status' style='background:#de2424 !important'>" + val.slotStatus + "</span></span>";
						}
						else if ((val.slotStatus == 'Available') && (val.allowBooking == 1)) {
							slots += "<span class='TimeSlot' style='background:#036f98'>" + val.Final_InShift + "-" + val.Final_outShift + "<br/><span class='TimeSlot-Status'>" + val.slotStatus + "</span></span>";
						}
						else {
							slots += "<span disabled class='TimeSlot'>" + val.Final_InShift + "-" + val.Final_outShift + "<br/><span class='TimeSlot-Status'>Time Elapsed</span></span>";
						}
					});
					$('#modalTimeAvailability .TimeFrame').append(slots);
					$('#modalTimeAvailability').modal('show');
				}
			}
			else {
				alert('No Record Found..');
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function RescheduleBooking() {
	if (ValidateReschedule()) {
		var url = config.baseUrl + "/api/Appointment/Opd_AppointmentUpdate";
		var objBO = {};
		//Value
		var appNo = $('#tblOPDRegister tbody').find('tr.select-row').find('td:eq(6)').text();
		var date = $('#txtTimeSlotsByDate').val();
		var time = $('#txtNewAppointmentTime').text().split('-');
		objBO.app_no = appNo;
		objBO.AppDate = date;
		objBO.AppInTime = time[0];
		objBO.AppOutTime = time[1];
		objBO.Logic = 'RescheduleBooking';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			contentType: "application/json;charset=utf-8",
			dataType: "JSON",
			async: false,
			success: function (data) {
				
				if (data.includes('Success')) {
					alert(data);
					var d = date.split('-');
					$('#tblOPDRegister tbody').find('tr.select-row').find('button.Reschedule ').addClass('disabled');
					$('#tblOPDRegister tbody').find('tr.select-row').find('td:eq(9)').text(d[2] + '-' + d[1] + '-' + d[0]);
					$('#tblOPDRegister tbody').find('tr.select-row').find('td:eq(8)').text(time[0].substring(0, 5) + '-' + time[1].substring(0, 5));
					$('#modalTimeAvailability .TimeFrame').empty();
					$('#modalTimeAvailability').modal('hide');
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
}
function CancelBooking(appNo) {
	if (confirm('Are you sure to cancel this OPD Booking..!')) {
		var url = config.baseUrl + "/api/Appointment/Opd_AppointmentUpdate";
		var objBO = {};
		//Value
		var date = new Date();
		objBO.app_no = appNo;
		objBO.AppDate = date;
		objBO.AppInTime = '01:00';
		objBO.AppOutTime = '01:00';
		objBO.Logic = 'CancelBooking';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			contentType: "application/json;charset=utf-8",
			dataType: "JSON",
			async: false,
			success: function (data) {
				
				if (data.includes('Success')) {
					alert(data);
					$('#tblOPDRegister tbody').find('tr.select-row').find('button.Cancelled ').addClass('disabled');
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
} 
function GetDoctor() {
	var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
	var objBO = {};
	objBO.Logic = 'All';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		async: false,
		success: function (data) {
			
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table2).length) {
					$('#ddlDoctor').empty().append($('<option value="ALL">ALL</option>'));
					$.each(data.ResultSet.Table2, function (key, val) {
						$('#ddlDoctor').append($('<option></option>').val(val.DoctorId).html(val.DoctorName));
					});
				}
			}
			else {
				alert('No Record Found..');
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function SearchByKey() {
	var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
	var objBO = {};
	objBO.SearcKey = '';
	objBO.SearchValue = $('#txtSearchValue').val();
	objBO.from = $('#txtSearchFrom').val();
	objBO.to = $('#txtSearchTo').val();
	objBO.prm_1 = $('#ddlVisitType option:selected').val();
	objBO.Logic = 'SearchByKey';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		async: false,
		success: function (data) {
			
			if (data.ResultSet.Table.length > 0) {
				$('#tblOPDRegister tbody').empty();
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.UHID + "</td>";
					tbody += "<td>" + val.patient_name + "</td>";
					tbody += "<td>" + val.DoctorName + "</td>";
					tbody += "<td>" + val.Age + "</td>";
					tbody += "<td>" + val.mobile_no + "</td>";
					tbody += "<td>" + val.visitType + "</td>";
					tbody += "<td>" + val.app_no + "</td>";
					tbody += "<td class='text-right'>" + val.NetAmount + "</td>";
					tbody += "<td>" + val.AppTime + "</td>";
					tbody += "<td>" + val.AppDate + "</td>";
					tbody += "<td>" + val.TnxId + "</td>";
					tbody += "<td>" + val.trnstatus + "</td>"; 
					tbody += "<td class='flex'>";
					if (val.IsReschedule == '1') {
						tbody += "<button style='margin-right:10px;' data-doctorid=" + val.DoctorId + " class='Reschedule btn-success btn-flat disabled'>Reschedule</button>";
					}
					else {
						tbody += "<button style='margin-right:10px;' data-doctorid=" + val.DoctorId + " class='Reschedule btn-success btn-flat'>Reschedule</button>";
					}
					if ((val.IsCancelled == '0') && (val.visitType != 'Walk-In')) {
						tbody += "<button style='margin-right:10px;' data-app_no=" + val.app_no + " class='Cancelled btn-danger btn-flat'>Cancel</button>";
					}
					else {
						tbody += "<button style='margin-right:10px;' data-app_no=" + val.app_no + " class='Cancelled btn-danger btn-flat disabled'>Cancel</button>";
					}
					tbody += "<button style='margin-right:10px;' class='btn-success btn-flat " + val.IsConfirmed + "' onclick=Confirm('" + val.app_no + "')>Confirm</button>";
					tbody += "<button class='btn-info btn-flat " + val.IsTnxId + "' onclick=Receipt('" + val.TnxId + "')>Print</button>";
					tbody += "</td>";
					tbody += "</tr>";
				});
				$('#tblOPDRegister tbody').append(tbody);
			}
			else {
				$('#tblOPDRegister tbody').empty();
				alert("Data Not Found..");
			};
		},
		complete: function (data) {
			$.each(data.responseText.ResultSet.Table, function (key, val) {
				alert(val.IsTnxId)
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function SearchByDate() {
	var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
	var objBO = {};
	objBO.SearcKey = '';
	objBO.DoctorId = $('#ddlDoctor option:selected').val();
	objBO.SearchValue = $('#txtSearchValue').val();
	objBO.from = $('#txtSearchFrom').val();
	objBO.to = $('#txtSearchTo').val();
	objBO.prm_1 = $('#ddlVisitType option:selected').val();
	objBO.Logic = 'SearchByDate';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		async: false,
		success: function (data) {
			
			if (data.ResultSet.Table.length > 0) {
				$('#tblOPDRegister tbody').empty();
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.UHID + "</td>";
					tbody += "<td>" + val.patient_name + "</td>";
					tbody += "<td>" + val.DoctorName + "</td>";
					tbody += "<td>" + val.Age + "</td>";
					tbody += "<td>" + val.mobile_no + "</td>";
					tbody += "<td>" + val.visitType + "</td>";
					tbody += "<td>" + val.app_no + "</td>";
					tbody += "<td class='text-right'>" + val.NetAmount + "</td>";
					tbody += "<td>" + val.AppTime + "</td>";
					tbody += "<td>" + val.AppDate + "</td>";
					tbody += "<td>" + val.TnxId + "</td>";
					tbody += "<td>" + val.trnstatus + "</td>";
					tbody += "<td class='flex'>";
					if (val.IsReschedule == '1') {
						tbody += "<button style='margin-right:10px;' data-doctorid=" + val.DoctorId + " class='Reschedule btn-success btn-flat disabled'>Reschedule</button>";
					}
					else {
						tbody += "<button style='margin-right:10px;' data-doctorid=" + val.DoctorId + " class='Reschedule btn-success btn-flat'>Reschedule</button>";
					}
					if ((val.IsCancelled == '0') && (val.visitType != 'Walk-In')) {
						tbody += "<button style='margin-right:10px;' data-app_no=" + val.app_no + " class='Cancelled btn-danger btn-flat'>Cancel</button>";
					}
					else {
						tbody += "<button style='margin-right:10px;' data-app_no=" + val.app_no + " class='Cancelled btn-danger btn-flat disabled'>Cancel</button>";
					}
					tbody += "<button style='margin-right:10px;' class='btn-success btn-flat " + val.IsConfirmed + "' onclick=Confirm('" + val.app_no + "')>Confirm</button>";
					tbody += "<button class='btn-info btn-flat " + val.IsTnxId + "' onclick=Receipt('" + val.TnxId + "')>Print</button>";
					tbody += "</td>";
					tbody += "</tr>";
				});
				$('#tblOPDRegister tbody').append(tbody);
			}
			else {
				$('#tblOPDRegister tbody').empty();
				alert("Data Not Found..");
			};
		},
		complete: function (data) {
			$.each(data.responseJSON.ResultSet.Table, function (key, val) {
				if (val.IsReschedule == '1')
					$('#tblOPDRegister tbody').find('tr:eq(' + key + ')').find('td:eq(0),td:eq(1),td:eq(2),td:eq(3),td:eq(4),td:eq(5),td:eq(6),td:eq(7),td:eq(8),td:eq(9),td:eq(10),td:eq(11)').addClass('row-green');
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
 function Receipt(tnxid) {
	var url = "../Print/AppointmentReceipt?TnxId=" + tnxid + "&ActiveUser=" + Active.userName;
	window.open(url, '_blank');
}
function Confirm(appno) {
	var url = "BookAppointment?appno=" + btoa(appno);
	window.open(url, '_blank');
}
function ValidateReschedule() {
	var NewAppTime = $('#txtNewAppointmentTime').text().length;
	if (NewAppTime < 6) {
		alert('Please Choose New Time-Slot..!');
		return false;
	}
	return true;
}
