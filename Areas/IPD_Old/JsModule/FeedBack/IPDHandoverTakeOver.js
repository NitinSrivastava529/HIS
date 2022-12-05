var _SelectedFloor;
var _SelectedRoomType;
$(document).ready(function () {
    GetDataIPDHanover();
    GetPatientDetails();
    $('#ddlRoom').on('change', function () {
        _SelectedFloor = this.value;
        updateFilters();
    });
    $('#ddlRoomType').on('change', function () {
        _SelectedRoomType = this.value;
        updateFilters();
    });
    $('#txtSearchPatient').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#IPDPatientList .section').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('#btnSearch').on('click', function () {
        var name = $('#txtSearchStaff').val();
        GetStaffList(name);
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
function GetStaffList(name) {
    var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
    var objConsumpBO = {};
    objConsumpBO.prm_1 = name;
    objConsumpBO.Logic = "GetEmployeeList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("#ddlStaff").empty().append($("<option></option>").val(0).html('Select Staff'));
                $('#txtSearchStaff').val('');
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlStaff").append($("<option></option>").val(value.emp_code).html(value.emp_name)).select2();
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPatientDetails() {
    $('#IPDPatientList').empty();
    var url = config.baseUrl + "/api/IPDNursing/GetAdmittedIPDPatient";
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            var html = ""; var room = []; var roomType = [];
            $.each(data.ResultSet.Table, function (key, val) {
                var r = val.RoomName.split('/');
                room.push(r[3]);
                roomType.push(val.RoomType);
       
                html += "<div id='patientList' class='section' data-roomtype='" + val.RoomType+"' data-floor='" + r[3] + "'>";
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
                html += "<td colspan='5'><span1>" + val.AdmitDate + "</span1>";
                html += "<span class='text-right' style='margin: -4px 0;float:right'>";
                html += "<td><input type='checkbox' name='" + val.IPDNO + "' ></td>";
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
function InsertIPDHandover() {
    if ($('#ddlStaff option:selected').text() == 'Select Staff') {
        alert('Please Select Staff...');
        return;
    }
    if ($('#ddlShift option:selected').text() == 'Select') {
        alert('Please Select Shift...');
        return;
    }
    var url = config.baseUrl + "/api/IPDNursing/HandOverTakeOverInsert";
    var objBO = [];
    $('div#patientList input[type=checkbox]:checked').each(function () {
        var elem = this;
        var staffcode = $('#ddlStaff option:selected').val();
        var ShiftName = $('#ddlShift option:selected').text();
        var ipdno = $(elem).parents('table').find('tr:nth-child(1)').find('td:nth-child(3)').text();
        var pname = $(elem).parents('table').find('tbody tr:nth-child(1)').find('td:nth-child(7)').text();
        var age = $(elem).parents('table').find('tbody tr:nth-child(2)').find('td:nth-child(3)').text();
        var gender = $(elem).parents('table').find('tbody tr:nth-child(2)').find('td:nth-child(4)').text();
        var room = $(elem).parents('table').find('tbody tr:nth-child(2)').find('td:nth-child(8)').text();
        var admitUnder = $(elem).parents('table').find('tbody tr:nth-child(3)').find('td:nth-child(3)').text();
        var admitDate = $(elem).parents('table').find('tbody tr:nth-child(4)').find('td:nth-child(3)').find('span1').text();
        objBO.push({
            'IpdNo': ipdno,
            'PatientName': pname,
            'Age': age,
            'Gender': gender,
            'DoctorId': '-',
            'DoctorName': admitUnder,
            'AdmitDate': admitDate,
            'FloorName': room,
            'StaffCode': staffcode,
            'ShiftName': ShiftName,
            'login_id': Active.userId,
            'Logic': 'InsertStaffShift'
        });
    });
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            //
            if (data.includes('Success')) {
                alert(data);
                GetDataIPDHanover();
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


function GetDataIPDHanover() {
    var url = config.baseUrl + "/api/IPDNursing/IPD_FeedbackQuesries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.logic = "HandOverCurrentDateData";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = "";
            var shiftname = "";
            $.each(data.ResultSet.Table, function (key, val) {
                if (shiftname != val.ShiftName) {
                    tbody += "<tr class='sft-group'>";
                    tbody += "<td colspan='4' class='.sft-group'>" + val.ShiftName + "</td>";
                    tbody += "</tr>";
                    shiftname = val.ShiftName;
                }
                tbody += "<td>" + val.IpdNo + "</td>";
                tbody += "<td>" + val.PatientName + "</td>";
                tbody += "<td>" + val.DoctorName + "</td>";
                tbody += "<td>" + val.StaffName + "</td>";
                tbody += "</tr>";
            });
            $('#tblIPDPatientDetail tbody').append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}