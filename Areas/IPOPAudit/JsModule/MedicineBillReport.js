
$(document).ready(function () {
	GetPatientDetails();
	$('#txtSearchPatient').on('keyup', function () {
		var val = $(this).val().toLowerCase();
		$('#tblAdmittedIPDPatient tbody tr').filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
		});
	});
	$('#btnSearch').on('click', function () {
		var msg = "Welcome To Message Box..! Message Box Example from HIS....";
		MsgBox(msg);
	});
	$('#tblAdmittedIPDPatient tbody').on('click', '.getPatient', function () {
		selectRow($(this));
		$('#IPDNo').text($(this).data('ipd'));
		BillReport($(this).data('ipd'))
	});
});

function GetPatientDetails() {
	var url = config.baseUrl + "/api/IPDNursing/GetAdmittedIPDPatient";
	$.ajax({
		method: "GET",
		url: url,
		dataType: "json",
		success: function (data) {
			if (data != '') {
				$("#tblAdmittedIPDPatient tbody").empty();
				$('#ddlRoom').empty().append('<option>Select Room</option>');
				
				var room = [];
				$.each(data.ResultSet.Table, function (key, val) {
					var r = val.RoomName.split('/');
					room.push(r[3]);
					$('<tr><td data-room="' + r[3] + '">' + val.IPDNO + '</td><td>' + val.PName + '</td><td>' + val.Patient_ID + '</td><td>' + val.DName + '</td>' +
						'<td class="btn text-green getPatient" data-PName="' + val.PName + '" data-Gender="' + val.Gender + '" data-Age="' + val.Age + '" data-AdmitedDate="' + val.AdmitDate + '" data-Doctor="' + val.DName + '"data-UHID="' + val.Patient_ID + '"data-IPD="' + val.IPDNO + '"data-RoomNo="' + val.RoomName + '"data-panelid="' + val.Panel_ID + '"data-companyname="' + val.Company_Name + '" data-department="' + val.Department + '">' +
						'<span class="fa fa-arrow-right"></span></td></tr>').appendTo($("#tblAdmittedIPDPatient tbody"));

				});
				var unique = room.filter(function (itm, i, room) {
					return i == room.indexOf(itm);
				});
				for (i = 0; i < unique.length; i++) {
					var data = '<option>' + unique[i] + '</option>'
					$('#ddlRoom').append(data);
				}
				////$("#tblAdmittedIPDPatient").tableHeadFixer();
				//$('#tblAdmittedIPDPatient').tableScroll({ height: 200 });
				////$('#thetable').tableScroll({ height: 200 });
				////$('#thetable').tableScroll({ width: 400 });
				////$('#thetable').tableScroll({ containerClass: 'myCustomClass' });
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
function BillReport(IPDNo) {
	var url = "../Print/MedicineBillReport?IPDNo=" + IPDNo;
	window.open(url, '_blank');
}



//var IPDNo = $('#txtIPDNo').val();
//$('#IPDNo').text(IPDNo);
//BillReport(IPDNo);