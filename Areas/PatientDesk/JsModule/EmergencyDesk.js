var _RequestId = "";
$(document).ready(function () {
    FillCurrentDate("txtFrom")
    FillCurrentDate("txtTo")
    $('select').select2();
    $('input:text').prop('autocomplete', 'off');
    $('#btnAddEmployee').on('click', function () {
        var tbody = "";
        var EmployeeType = $('#ddlEmployeeType option:selected').text();
        var EmpCode = $('#ddlEmployee option:selected').val();
        var EmpName = $('#ddlEmployee option:selected').text();
        var empId = [];
        $('#tblEmployee tbody tr').each(function () {
            empId.push($(this).find('td:eq(0)').text());
        });
        if (EmployeeType == 'Select') {
            alert('Select Employee Type.');
            return;
        }
        if ($.inArray(EmpCode, empId) > -1) {
            alert('Employee Already Added.');
            return;
        }
        else {
            tbody += "<tr>";
            tbody += "<td>" + EmpCode + "</td>";
            tbody += "<td>" + EmpName + "</td>";
            tbody += "<td>" + EmployeeType + "</td>";
            tbody += "<td class='text-center'><button class='btn-danger' onclick=removeRow(this)><i class='fa fa-trash'></i></button></td>";
            tbody += "</tr>";
            $('#tblEmployee tbody').append(tbody);
        }

    });
    //FillCurrentDate("txtPickupDate");
    //FillCurrentTime("txtPickupTime");
    FillCurrentDate("txtPickupDate");
    FillCurrentTime("txtPickupTime");

    OnLoadEmergencyDesk();
    GetEmergencyRequest('GetAllRequest');
});
function removeRow(elem) {
    $(elem).closest('tr').remove();
}
function InputLatLong() {
    var latLong = $('#txtPatientLatlong').val();
    var str = latLong.split(',');
    $('#txtPatientLat').val(str[0]);
    $('#txtPatientLong').val(str[1]);
    $('#txtPatientLatlong').val('');

}
function OnLoadEmergencyDesk() {
    var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyQueries";
    var objBO = {};
    objBO.RequestId = '-';
    objBO.DriverId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Logic = "OnLoadEmergencyDesk";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {

                    $('#ddlAmbulance').empty().append($('<option></option>').val('Select').text('Select'));
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlAmbulance').append($('<option></option>').val(val.AmbulanceId).text(val.AmbulanceName));
                    });

                    $('#ddlDriver').empty().append($('<option></option>').val('Select').text('Select'));
                    $.each(data.ResultSet.Table1, function (key, val) {
                        $('#ddlDriver').append($('<option></option>').val(val.DriverId).text(val.DriverName));
                    });
                    $('#ddlDistrict').empty().append($('<option></option>').val('Select').text('Select'));
                    $.each(data.ResultSet.Table2, function (key, val) {
                        $('#ddlDistrict').append($('<option></option>').val(val.distt_name).text(val.distt_name));
                    });
                    $('#ddlDistrict option').each(function () {
                        if ($(this).text() == 'Lucknow') {
                            $('#ddlDistrict').prop('selectedIndex', '' + $(this).index() + '').change();
                        }
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetEmergencyRequest(logic) {
    $('#EmergencyRequest').empty();
    var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyQueries";
    var objBO = {};
    objBO.RequestId = '-';
    objBO.DriverId = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var html = "";
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        html += "<div class='section'>";
                        html += "<table class='table'>";
                        html += "<tr>";
                        html += "<th>Req Id</th>";
                        html += "<th>:</th>";
                        html += "<td>" + val.RequestId + "</td>";
                        html += "<th>&nbsp</th>";
                        html += "<th>Date</th>";
                        html += "<th>:</th>";
                        html += "<td>" + val.EntryDate + "</td>";
                        html += "</tr>";
                        html += "<tr>";
                        html += "<th>Pickup Date</th>";
                        html += "<th>:</th>";
                        html += "<td>" + val.PickupDate + "</td>";
                        html += "<th>&nbsp</th>";
                        html += "<th>Pickup Time</th>";
                        html += "<th>:</th>";
                        html += "<td>" + val.PickupTime + "</td>";
                        html += "</tr>";

                        html += "<tr>";
                        html += "<th>Req Type</th>";
                        html += "<th>:</th>";
                        html += "<td colspan='2'>" + val.RequestType + "</td>";
                        html += "<th>Req By</th>";
                        html += "<th>:</th>";
                        html += "<td>" + val.RequestBy + "</td>";
                        html += "</tr>";

                        html += "<tr>";
                        html += "<th>Name</th>";
                        html += "<th>:</th>";
                        html += "<td colspan='3'>" + val.PatientName + "-" + val.MobileNo + "</td>";
                        html += "<td colspan='2'><button class='btn btn-warning btn-xs' onclick=GetRequestByReqId('" + val.RequestId + "')><i class='fa fa-eye'>&nbsp;</i>View Request</button></td>";
                        html += "</tr>";

                        html += "<tr>";
                        html += "<td colspan='3' style='font-size:10px' >R.START : " + val.AmbulanceMoveStartTime + "</th>";
                        html += "<td colspan='3' style='font-size:10px' >R.CLOSE : " + val.RequestClosedDate + "</th>";
                        html += "<td colspan='2' style='font-size:10px' >" + val.TAT + "</th>";
                        html += "</tr>";

              
                        html += "</table>";
                        html += "</div>";
                    });
                    $('#EmergencyRequest').append(html);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetEmergencyQuest() {
    $('#AllQuestionnair').empty();
    var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyQueries";
    var objBO = {};
    objBO.RequestId = '-';
    objBO.DriverId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Logic = 'GetEmergencyQuest';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var html = "";
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++
                        html += "<div class='col-md-12 form-group'>";
                        html += "<label>Question-" + count + " : " + val.Questions + "</label>";
                        html += "<textarea id='txtAns" + count + "' data-autoid=" + val.AutoId + " class='form-control' placeholder='Write your Answer'></textarea>";
                        html += "</div>";
                    });
                    $('#AllQuestionnair').append(html);
                    $('#modalQuestionnaire').modal('show');
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetRequestByReqId(RequestId) {
    _RequestId = RequestId;
    $('#btnEmergencyQuest').hide();
    $('#tblEmployee tbody').empty();
    var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyQueries";
    var objBO = {};
    objBO.RequestId = RequestId;
    objBO.DriverId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Logic = "GetEmergencyRequestByReqId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        _RequestId = val.RequestId;
                        $('#txtUHID').val(val.UHID);
                        $('#txtIPDNo').val(val.IPDNo);
                        $('#txtPatientName').val(val.PatientName);
                        $('#txtNote').val(val.RequestNote);
                        $('#txtLandMark').val(val.LandMark);
                        $('#txtAddress').val(val.PatientAddress);
                        $('#txtMobileNo').val(val.MobileNo);
                        $('#txtPatientLat').val(val.PatientGeoLat);
                        $('#txtPatientLong').val(val.PatientGeoLong);
                        var PickupDate = "";
                        if (val.PickupDate == null)
                            PickupDate = null;
                        else
                            PickupDate = val.PickupDate.toString().replace(/\./g, '-');

                        $('#txtPickupDate').val(PickupDate);
                        $('#txtPickupTime').val(val.PickupTime);
                        $('#ddlReqBy option').each(function () {
                            if ($(this).text() == val.RequestBy) {
                                $('#ddlReqBy').prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                            else {
                                $('#ddlReqBy').prop('selectedIndex', '0').change();
                            }
                        });
                        $('#ddlReqType option').each(function () {
                            if ($(this).text() == val.RequestType) {
                                $('#ddlReqType').prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                            else {
                                $('#ddlReqType').prop('selectedIndex', '0').change();
                            }
                        });
                        $('#ddlDistrict option').each(function () {
                            if ($(this).text() == val.District) {
                                $('#ddlDistrict').prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                            else {
                                $('#ddlDistrict').prop('selectedIndex', '0').change();
                            }
                        });

                        $('#ddlAmbulance option').each(function () {
                            
                            if ($(this).text() == val.AmbulanceName) {
                                $('#ddlAmbulance').prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                            else {
                                $('#ddlAmbulance').prop('selectedIndex', '0').change();
                            }
                        });
                        $('#ddlDriver option').each(function () {
                            if ($(this).text() == val.DriverName) {
                                $('#ddlDriver').prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                            else {
                                $('#ddlDriver').prop('selectedIndex', '0').change();
                            }
                        });
                        $('#btnSubmit').text('Update').removeClass('btn-suceess').addClass('btn-warning');
                    });
                    var html = "";
                    $.each(data.ResultSet.Table1, function (key, val) {
                        html += "<tr>";
                        html += "<td>" + val.UserId + "</td>";
                        html += "<td>" + val.emp_name + "</td>";
                        html += "<td>" + val.EmpType + "</td>";
                        html += "<td class='text-center'><button class='btn-danger' onclick=removeRow(this)><i class='fa fa-trash'></i></button></td>";
                        html += "</tr>";
                    });
                    $('#tblEmployee tbody').append(html);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function SearchEmployee() {
    if ($('#txtSearchEmployee').val().length < 3) {
        return
    }
    var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyQueries";
    var objBO = {};
    objBO.RequestId = '-';
    objBO.DriverId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#txtSearchEmployee').val();
    objBO.Prm2 = '-';
    objBO.Logic = "SearchEmployee";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $('#ddlEmployee').empty().append($('<option></option>').val("Select").html("Select")).change();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlEmployee').append($('<option></option>').val(val.emp_code).html(val.emp_name));
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertRequest() {
    if (confirm('Are you sure to Submit?')) {
        if (Validation()) {
            var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyRequest";
            var objBO = {};
            var empInfo = [];
            var QuestAns = [];
            $('#tblEmployee tbody tr').each(function () {
                empInfo.push({
                    'UserId': $(this).find('td:eq(0)').text(),
                    'EmpType': $(this).find('td:eq(2)').text()
                });
            });
            $('#AllQuestionnair textarea').each(function () {
                if ($(this).val() != '') {
                    QuestAns.push({
                        'QuestId': $(this).data('autoid'),
                        'Answer': $(this).val()
                    });
                }
            });
            objBO.RequestId = _RequestId;
            objBO.UHID = $('#txtUHID').val();
            objBO.IPDNo = $('#txtIPDNo').val();
            objBO.PatientName = $('#txtPatientName').val();
            objBO.RequestBy = $('#ddlReqBy option:selected').text();
            objBO.RequestType = $('#ddlReqType option:selected').text();
            objBO.RequestNote = $('#txtNote').val();
            objBO.District = $('#ddlDistrict option:selected').text();
            objBO.LandMark = $('#txtLandMark').val();
            objBO.PatientAddress = $('#txtAddress').val();
            objBO.PatientGeoLat = $('#txtPatientLat').val();
            objBO.PatientGeoLong = $('#txtPatientLong').val();
            objBO.MobileNo = $('#txtMobileNo').val();
            objBO.RequestTakenBy = Active.userId;
            objBO.PickupDate = $('#txtPickupDate').val();
            objBO.PickupTime = $('#txtPickupTime').val();
            objBO.AmbulanceTrackingLink = '-';
            objBO.AmbulanceId = $('#ddlAmbulance option:selected').val();
            objBO.AllotedDriverId = $('#ddlDriver option:selected').val();
            objBO.Prm1 = JSON.stringify(empInfo);
            objBO.Prm2 = JSON.stringify(QuestAns);
            objBO.login_id = Active.userId;
            objBO.Logic = ($('#btnSubmit').text() == "Submit") ? "InsertRequest" : "UpdateRequest";
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(objBO),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.includes('Success')) {
                        alert(data);
                        GetEmergencyRequest('GetAllRequest');
                        Clear();
                        $('#tblEmployee tbody').empty();
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
}
function CheckSchedule() {
    $('#tblSchedule tbody').empty();
    var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyQueries";
    var objBO = {};
    objBO.AmbulanceId = $('#ddlAmbulance option:selected').val();
    objBO.Logic = "GetAmbulanceSchedule";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var html = "";
            $.each(data.ResultSet.Table, function (key, val) {
                html += "<tr>";
                html += "<td>" + val.RequestId + "</td>";
                html += "<td>" + val.AmbulanceId + "</td>";
                html += "<td>" + val.AmbulanceName + "</td>";
                html += "<td>" + val.PickupDate + "</td>";
                html += "<td>" + val.PickupTime + "</td>";
                html += "<td>" + val.PatientAddress + "</td>";
                html += "<td>" + val.status + "</td>";
                html += "</tr>";
            });
            $('#tblSchedule tbody').append(html);
            $('#modalSchedule').modal('show');
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PrintSlip() {
    var url = "../Print/BookingSlip?RequestId=" + _RequestId;
    window.open(url, '_blank');
}
function CancelRequest() {
    if (confirm('Are you sure to cancel?')) {
        var url = config.baseUrl + "/api/Patient/AmbulanceAndEmergencyRequest";
        var objBO = {};
        objBO.RequestId = _RequestId;
        objBO.login_id = Active.userId;
        objBO.Logic = "CancelRequest";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    GetEmergencyRequest('GetAllRequest');
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
function InformToAmbulanceDriver() {

        var url = config.baseUrl + "/api/Patient/InformToAmbulanceDriver";
        var objBO = {};
        objBO.RequestId = _RequestId;
        objBO.login_id = Active.userId;
        objBO.Logic = "GetDataToInformDriver";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                alert(data);
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
}

function SendTrackingLink(elem) {
    if (confirm('Are You Sure to Send Change Password Link?')) {
        var url = config.baseUrl + "/api/Patient/SendTrackingLink";
        objBO = {};
        objBO.PatientName = $('#txtPatientName').val();
        objBO.RequestId = _RequestId;
        objBO.MobileNo = $('#txtMobileNo').val();
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            //data: { 'mobile': mobileno, 'otp': otp },
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                
                if (data.includes('Sent'))
                    alert('Link sent successfully.');
                else
                    alert('Link sending Failed.');
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function fullScreenTrack() {
    $('.mSchedule').toggleClass('hide');
    if ($('#map').height() == '200') {
        $('#map').height('500');
    }
    else {
        $('#map').height('200');
    }
}
function Clear() {
    FillCurrentDate("txtPickupDate");
    FillCurrentTime("txtPickupTime");
    $('input:text').val('');
    $('textarea').val('');
    $('table select:not("#ddlDistrict")').prop('selectedIndex', '0').change();
    $('#tblEmployee tbody').empty();
    $('#btnSubmit').text('Submit').removeClass('btn-warning').addClass('btn-suceess');
    $('#btnEmergencyQuest').hide();
}
function Validation() {
    var UHID = $('#txtUHID').val();
    var IPDNo = $('#txtIPDNo').val();
    var PatientName = $('#txtPatientName').val();
    var RequestBy = $('#ddlReqBy option:selected').text();
    var RequestType = $('#ddlReqType option:selected').text();
    var RequestNote = $('#txtNote').val();
    var District = $('#ddlDistrict option:selected').text();
    var LandMark = $('#txtLandMark').val();
    var PatientAddress = $('#txtAddress').val();
    var MobileNo = $('#txtMobileNo').val();
    var PickupDate = $('#txtPickupDate').val();
    var PickupTime = $('#txtPickupTime').val();
    var AmbulanceId = $('#ddlAmbulance option:selected').text();
    var AllotedDriverId = $('#ddlDriver option:selected').text();
  
    if (PatientName == '') {
        alert('Please Provide Patient Name');
        $('#txtPatientName').css('border-color', 'red').focus();
        return false;
    } else {
        $('#txtPatientName').removeAttr('style');
    }
    return true;
}
