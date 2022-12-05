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
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetPatientInfo';
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
            $.each(data.ResultSet.Table, function (key, val) {
                room.push(val.FloorName);
                roomType.push(val.RoomType);

                if (val.IsDischarged=="Y")
                    html += "<div  class='section discharge' data-ipd='" + val.IPDNo + "' data-roomtype='" + val.RoomType + "' data-floor='" + val.FloorName + "'>";
                else
                    html += "<div  class='section' data-ipd='" + val.IPDNo + "' data-roomtype='" + val.RoomType + "' data-floor='" + val.FloorName + "'>";

                html += "<label style='display:none'>" + JSON.stringify(data.ResultSet.Table[count]) + "</label>";
                html += "<table class='table'>";

                if (val.IsDietscheduled == "N") {
                    html += "<tr>";
                    html += "<td colspan='7' style='text-align:left'><span class='NewPatientBlock'><i class='fa fa-check-circle'>&nbsp;</i>New Admission</span></td>";
                    html += "<tr>";
                }
           
                html += "<tr>";
                html += "<td>IPD No</th>";
                html += "<td>:</th>";
                html += "<td>" + val.IPDNo + "</td>";
                html += "<td>&nbsp</th>";
                html += "<td>Patient Name</th>";
                html += "<td>:</th>";
                html += "<td>" + val.PatientName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Age</th>";
                html += "<td>:</th>";
                html += "<td>" + val.Age + "</td>";
                html += "<td style='display:none'>" + val.Gender + "</td>";
                html += "<td>&nbsp</th>";
                html += "<td>Room No</th>";
                html += "<td>:</th>";
                html += "<td>" + val.RoomName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Admitted Under</th>";
                html += "<td>:</th>";
                 html += "<td colspan='5'>" + val.DoctorName + "</td>";
            
                html += "</tr>";
                html += "<tr>";
                html += "<td>Admit Date</th>";
                html += "<td>:</th>";
                html += "<td colspan='5'><span1>" + val.AdmitDate + "</span1> Dicharge : <span1>" + val.DischargeDateTime + "</span1><span2 style='display:none'>" + val.DoctorId + "</span2><span3 style='display:none'>" + val.FloorName + "</span3>";
                html += "<span class='text-right' style='margin: -4px 0;float:right'>";
                html += "<button class='btn btn-success btn-xs pull-right' onclick=PatientInfo(this)><i class='fa fa-eye'>&nbsp;</i>Select</button>";
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

    $('#txtUHID').text(patientInfo.UHID);
    $('#txtIPDNo').text(patientInfo.IPDNo);
    $('#txtPatientName').text(patientInfo.PatientName);
    $('#txtGender').text(patientInfo.Gender);
    $('#txtAge').text(patientInfo.Age);
    $('#txtAgeType').text(patientInfo.ageType);
    $('#txtDoctorName').text(patientInfo.DoctorName);
    $('#txtDoctorId').text(patientInfo.DoctorId);
    $('#txtMedicalProcedure').text(patientInfo.medicalProcedure);
    $('#txtPreExistingDisease').text(patientInfo.PreExistingDisease);
    $('#txtDietRecommended').html("<i class='fa fa-check-circle'>&nbsp;</i>" + patientInfo.DietType);
    $('#txtFloorName').text(patientInfo.FloorName);
    $('#txtRoomNo').text(patientInfo.RoomNo);
    $('#txtBedNo').text(patientInfo.BedNo);
    $('#txtRoomType').text(patientInfo.RoomType);
 
    GetPatientDataFromChandanServerSide(patientInfo.IPDNo);
    GetScheduledDietInfo(patientInfo.IPDNo);
}

function GetPatientDataFromChandanServerSide(IPDNo) {
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    $('#txtWeight').val("");
    $('#txtHeight').val("");
    $('#txtMedicalProcedure').val('');
    $('#txtProcedureDate').val(null);
    $('#txtPreExistingDisease').val('');
    $("#ddlDietType option").each(function () {
        if ($(this).text() == "Select") {
            $("#ddlDietType").prop('selectedIndex', '' + $(this).index() + '').change();
        }
    });

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

                $('#txtMedicalProcedure').val(val.medicalProcedure);
                $('#txtProcedureDate').val(val.ProcedureDate);
                $('#txtPreExistingDisease').val(val.PreExistingDisease);

                    $("#ddlDietType option").each(function () {
                        if ($(this).val() == val.DietTypeId) {
                            $("#ddlDietType").prop('selectedIndex', '' + $(this).index() + '').change();
                        }
                    });
            
              
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetScheduledDietInfo(ipdNo) {
 
    //$('#tblScheduledInfo tbody').empty();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = ipdNo;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'TodayPlanedDiets';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var temp = "";
            var counter = 1;
            var acdNo = 1;
            $.each(data.ResultSet.Table, function (key, val) {
                  if(temp != val.DietName) {
                    if (counter != 1) {
                        tbody += "</table>";
                        tbody += "</div>";
                        tbody += "</div>";
                        tbody += "</div>";
                        tbody += "</div>";
                    }
                    tbody += "<div class='panel panel-default'>";
                    tbody += "<div class='panel-heading'>";
                    tbody += "<h4 class='panel-title'>";
                    tbody += "<a data-toggle='collapse' data-parent='#accordion' href='#collapse"+acdNo+"'>";
                    tbody += val.DietName + '[' + val.DietCategory + ']';
                    tbody += "</a>";
                    tbody += "</h4>";
                    tbody += "</div>";
                    tbody += "<div id='collapse"+acdNo+"' class='panel-collapse collapse in'>";
                    tbody += "<div class='panel-body'>";
                    tbody += "<table id='tblScheduledInfo' class='table table-bordered'>";
                    tbody += "<tr>";
                    tbody += "<th>S.N.</th>";
                    tbody += "<th>Item Name</th>";
                    tbody += "<th>Qty</th>";
                    tbody += "<th>Measuring</th>";
                    tbody += "<th>CalorieCount</th>";
                    tbody += "</tr>";
                    temp = val.DietName
                    acdNo++;
                }
                tbody += "<tr>";
                tbody += "<td>" + counter + "</td>";
                tbody += "<td>" + val.ItemName + "</td>";
                tbody += "<td>" + val.qty + "</td>";
                tbody += "<td>" + val.Measuring + "</td>";
                tbody += "<td>" + val.CalorieCount + "</td>";
                tbody += "</tr>";
                counter++;
            });
            $('#divScheduledDiet').html(tbody);
            //$('#tblScheduledInfo tbody').append(tbody);
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