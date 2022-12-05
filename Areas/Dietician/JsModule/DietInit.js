var _DoctorId;
var _FloorName;
var _SelectedFloor;
var _SelectedRoomType;
$(document).ready(function () {
    GetPatientDetails();
    GetDietType()
    $('select').select2();
    $('#ddlRoom').on('change', function () {
        _SelectedFloor = this.value;
        updateFilters();
    });
    $('#ddlRoomType').on('change', function () {
        _SelectedRoomType = this.value;
        updateFilters();
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
function GetDietType() {
    $('#ddlDietType').empty().append($('<option></option>').val('Select').html('Select'));
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetDietType';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlDietType').append($('<option></option>').val(val.DietTypeId).html(val.DietTypeName));
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPatientDetails() {
    $('#IPDPatientList').empty();
    var url = config.baseUrl + "/api/Dietician/PatientListForDietInit";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetIPDInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            var count = 0;
            var html = ""; var room = []; var roomType = [];
            $.each(data.Table1, function (key, val) {
                var r = val.RoomName.split('/');
                room.push(r[3]);
                roomType.push(val.RoomType);

                html += "<div  class='section' data-roomtype='" + val.RoomType + "' data-floor='" + r[3] + "'>";
                html += "<label style='display:none'>" + JSON.stringify(data.Table1[count]) + "</label>";
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
                    html += "<button class='btn btn-warning btn-xs pull-right' onclick=PatientInfo(this)><i class='fa fa-eye'>&nbsp;</i>View Info</button>";
                else
                    html += "<button class='btn btn-success btn-xs pull-right' onclick=PatientInfo(this)><i class='fa fa-eye'>&nbsp;</i>View Info</button>";

                html += "</span>";
                html += "</td>";
                html += "</tr>";
                html += "</table>";
                html += "</div>";
                count++;
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
function PatientInfo(elem) {
    $(elem).parents('#IPDPatientList').find('.section*').removeClass('selected');
    $(elem).parents('.section').addClass('selected');
    var patientInfo = JSON.parse($(elem).parents('.section').find('label').text());
    $('#txtUHID').text(patientInfo.Patient_ID);
    $('#txtIPDNo').text(patientInfo.IPDNO);
    $('#txtAdmitDate').text(patientInfo.AdmitDate);
    $('#txtPatientName').text(patientInfo.PName);
    $('#txtGender').text(patientInfo.Gender);
    $('#txtContactNo').text(patientInfo.Mobile);
    $('#txtAge').text(patientInfo.Age.split(' ')[0]);
    $('#txtAgeType').text(patientInfo.Age.split(' ')[1]);
    $('#txtDoctorName').text(patientInfo.DName);
    $('#txtDoctorId').text(patientInfo.DoctorId);
    $('#txtFloorName').text(patientInfo.Floor);
    $('#txtRoomType').text(patientInfo.RoomType);
    $('#txtRoomNo').text(patientInfo.BedNo.split('/')[0]);
    $('#txtBedNo').text(patientInfo.BedNo.split('/')[1]);
 
    GetPatientDataFromChandanServerSide(patientInfo.IPDNO);
}

function GetPatientDataFromChandanServerSide(IPDNo) {
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    $('#txtWeight').val("");
    $('#txtHeight').val("");
    $('input[name=IsDischarged]').prop('checked', false)
    $('#txtDischargeDateTime').val(null);
    $('#txtMedicalProcedure').val('');
    $('#txtProcedureDate').val(null);
    $('#txtPreExistingDisease').val('');

    $('#ddlDietType option').filter(function () { return this.id === val.DietTypeId }).prop('selected', true);



    objBO.IPDNo = IPDNo;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'PatientDetailOfIpd';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $.each(data.ResultSet.Table, function (key, val) {
                $('#txtWeight').val(val.Weight);
                $('#txtHeight').val(val.Height);

                if (val.IsDischarged=="Y")
                    $('input[name=IsDischarged]').prop('checked', true);
                else
                    $('input[name=IsDischarged]').prop('checked', false);

                $('#txtDischargeDateTime').val(val.DischargeDateTime);
                $('#txtMedicalProcedure').val(val.medicalProcedure);
                $('#txtProcedureDate').val(val.ProcedureDate);
                $('#txtPreExistingDisease').val(val.PreExistingDisease);

                $('#ddlDietType option').filter(function () { return this.id ===val.DietTypeId }).prop('selected', true);

              
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function InsertDietPatientInfo() {
    if (Validation()) {
        var url = config.baseUrl + "/api/Dietician/diet_InsertUpdateDiet";
        var objBO = {};
        objBO.UHID = $('#txtUHID').text();
        objBO.IPDNo = $('#txtIPDNo').text();
        objBO.AdmitDate = $('#txtAdmitDate').text();
        objBO.PatientName = $('#txtPatientName').text();
        objBO.Age = $('#txtAge').text();
        objBO.ageType = $('#txtAgeType').text();
        objBO.Gender = $('#txtGender').text();
        objBO.Weight = $('#txtWeight').val();
        objBO.Height = $('#txtHeight').val();
        objBO.DoctorId = $('#txtDoctorId').text();
        objBO.DoctorName = $('#txtDoctorName').text();
        objBO.FloorName = $('#txtFloorName').text();
        objBO.RoomType = $('#txtRoomType').text();
        objBO.RoomNo = $('#txtRoomNo').text();
        objBO.BedNo = $('#txtBedNo').text();
        objBO.IsDischarged = ($('input[name=IsDischarged]').is(':checked')) ? 'Y' : 'N';

        var dischargedateTime = $('#txtDischargeDateTime').val();
        if (dischargedateTime == "")
            dischargedateTime = null

        objBO.DischargeDateTime = dischargedateTime;
        objBO.MedicalProcedure = $('#txtMedicalProcedure').val();
        objBO.ProcedureDate = $('#txtProcedureDate').val();
        objBO.PreExistingDisease = $('#txtPreExistingDisease').val();
        objBO.DietTypeId = $('#ddlDietType option:selected').val();
        objBO.login_id = Active.userId;
        objBO.Logic = 'InsertDietPatientInfo';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    Clear();
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
function Validation() {
    var IPDNo = $('#txtIPDNo').text();
    var Weight = $('#txtWeight').val();
    var Height = $('#txtHeight').val();
    var IsDischarged = ($('input[name=IsDischarged]').is(':checked')) ? 'Y' : 'N';
    var DischargeDateTime = $('#txtDischargeDateTime').val();
    var MedicalProcedure = $('#txtMedicalProcedure').val();
    var PreExistingDisease = $('#txtPreExistingDisease').val();
    var DietTypeId = $('#ddlDietType option:selected').text();
    if (IPDNo == '') {
        alert('IPD No. Not Found.');
        $('#txtIPDNo').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtIPDNo').removeAttr('style');
    }
    if (Weight == '') {
        alert('Please Provide Weight.');
        $('#txtWeight').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtWeight').removeAttr('style');
    }
    if (Height == '') {
        alert('Please Provide Height.');
        $('#txtHeight').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtHeight').removeAttr('style');
    }
    if (IsDischarged == 'Y') {
        if (DischargeDateTime == '') {
            alert('Please Provide Discharge Date Time.');
            $('#txtDischargeDateTime').css('border-color', 'red');
            return false;
        }
        else {
            $('#txtDischargeDateTime').removeAttr('style');
        }
    }
    if (MedicalProcedure == '') {
        alert('Please Provide Medical Procedure.');
        $('#txtMedicalProcedure').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtMedicalProcedure').removeAttr('style');
    }
    if (PreExistingDisease == '') {
        alert('Please Provide Pre Existing Disease.');
        $('#txtPreExistingDisease').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtPreExistingDisease').removeAttr('style');
    }
    if (DietTypeId == 'Select') {
        alert('Please Select Diet Type.');
        $('#ddlDietType').css('border-color', 'red');
        return false;
    }
    else {
        $('#ddlDietType').removeAttr('style');
    }
    return true;
}
function Clear() {
    $('#txtUHID').text('');
    $('#txtIPDNo').text('');
    $('#txtAdmitDate').text('');
    $('#txtPatientName').text('');
    $('#txtAge').text('');
    $('#txtAgeType').text('');
    $('#txtGender').text('');
    $('#txtWeight').val('');
    $('#txtHeight').val('');
    $('#txtDoctorId').text('');
    $('#txtDoctorName').text('');
    $('#txtFloorName').text('');
    $('#txtContactNo').text('');
    $('#txtRoomType').text('');
    $('#txtRoomNo').text('');
    $('#txtBedNo').text('');
    $('input[name=IsDischarged]').prop('checked',false);
    $('#txtDischargeDateTime').val('');
    $('#txtMedicalProcedure').val('');
    $('#txtPreExistingDisease').val('');
    $('#ddlDietType').val(0).change();
}