
$(document).ready(function () {

	GetPatientDetails();
	$('#txtSearchPatient').on('keyup', function () {
		var val = $(this).val().toLowerCase();
		$('#tblAdmittedIPDPatient tbody tr').filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
		});
	});
	$('#btnSearch').on('click', function () {
		var IPDNo = $('#txtIPDNo').val();
		$('#IPDNo').text(IPDNo);
		GetDiagnosticTestAnalysis(IPDNo,'');
	});
	$('#tblAdmittedIPDPatient tbody').on('click', '.getPatient', function () {
		selectRow($(this));
		$('#IPDNo').text($(this).data('ipd'));
		GetDiagnosticTestAnalysis($(this).data('ipd'),'')
	});
	$('#btnXLReport').on('click', function () {
		
		var IPDNo = $('#IPDNo').text();
		var OutPutType = "Excel";
		GetDiagnosticTestAnalysis(IPDNo, OutPutType);
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
function GetDiagnosticTestAnalysis(IPDNo, OutPutType) {
	var url = config.baseUrl + "/api/IPOPAudit/DiagnosticTestAnalysis";
	var objBO = {};
	objBO.OutPutType = OutPutType;
	objBO.IPDNo = IPDNo;
	if (OutPutType == "Excel") {
		Global_DownloadExcel(url, objBO, "IPDPrescribedReport.xlsx");
	}
	else {
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			contentType: 'application/json;charset=utf-8',
			dataType: "JSON",
			success: function (data) {
				
				var tbody = "";
				$('#tblIPDReport tbody').empty();
				$('#tblIPDReport thead tr').empty();
				if (data.ResultSet != null) {
					var th = "";
					for (x in data.ResultSet.Table[0]) {
						th = "<th style='width:80px !important;'>" + x + "</th>";
						$('#tblIPDReport thead tr').append(th);
					}
					var col = "";
					$.each(data.ResultSet.Table, function (key, val) {
						tbody += "<tr>";
						$('#tblIPDReport thead tr th').each(function () {
							col = $(this).text();
							if (val[col] == '0') {
								tbody += "<td></td>";
							}
							else {
								tbody += "<td>" + val[col] + "</td>";
							}

						});
						tbody += "</tr>";
					});
					$('#tblIPDReport tbody').append(tbody);
				}
				else {
					alert("Record Not Found..!");
				};
			},			
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
	
}