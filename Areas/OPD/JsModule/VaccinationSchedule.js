var planIndex;
$(document).ready(function () {
    GetTemplateInfo();
    $('#ulSchedule').on('click', '#btnChoose', function () {
        var from = $(this).data('from');
        var to = $(this).data('to');

        $('#tblVaccinationInfo tbody').find('tr:eq(' + planIndex + ')').find('input[type=date]:eq(0)').val(from);
        $('#tblVaccinationInfo tbody').find('tr:eq(' + planIndex + ')').find('input[type=date]:eq(1)').val(to);

        $('#tblVaccinationInfo tbody').find('tr:eq(' + planIndex + ')').nextUntil('.groupday').find('input[type=date]:eq(0)').val(from);
        $('#tblVaccinationInfo tbody').find('tr:eq(' + planIndex + ')').nextUntil('.groupday').find('input[type=date]:eq(1)').val(to);

        $('#modalHelp').modal('hide');
    });
    $('#tblVaccinationInfo tbody').on('change', '.groupday input[type=date]', function () {
        var val = $(this).val();
        var Tag = $(this).attr('id');
        var eq = 0;

        if (Tag == 'PlannedFrom')
            eq = $(this).closest('td').index() + 3;
        if (Tag == 'PlannedTo' || Tag == 'VaccinationDate')
            eq = $(this).closest('td').index() + 4;

        if (eq == 4) {
            $(this).closest('tr').nextUntil('.groupday').find('td:eq(' + eq + ')').find('input[type=date]').val(val);
            eq += 1;
            $(this).closest('tr').nextUntil('.groupday').find('td:eq(' + eq + ')').find('input[type=date]').val(val);
            $(this).closest('tr').find('input:eq(1)').val(val);
        }
        if (eq != 4) {
            $(this).closest('tr').nextUntil('.groupday').find('td:eq(' + eq + ')').find('input[type=date]').val(val);
        }
    });
    $('#tblVaccinationInfo tbody').on('keyup', '.groupday input[id=SalesInvoiceNo]', function () {
        var val = $(this).val();
        $(this).closest('tr').nextUntil('.groupday').find('td:eq(6)').find('input[type=text]').val(val);
    });
    $('#tblVaccinationInfo tbody').on('click', 'span', function () {
        planIndex = $(this).closest('tr').index();
        var plannedFromDate = $(this).closest('tr').find('#PlannedFrom').val();
        if (plannedFromDate == '') {
            alert('Please Provide Planned From Date.')
            $(this).closest('tr').find('#PlannedFrom').css('border-color', 'red');
            return;
        }
        GetTotalCount(plannedFromDate);
        $('#modalHelp').modal('show');
    });
    var index;
    $('#tblVaccinationInfo tbody').on('click', 'button', function () {
        var logic = $(this).closest('tr').attr('class');
        if (logic == 'groupday') {
            index = $(this);
            var tag = $(this).closest('td').index();
            var eq = $(this).closest('tr').index();
            if (tag == 2) {
                if (VaccineValidation()) { InsertVaccinationDetail(eq) };
            }
            if (tag == 1) {
                if (plannedValidation()) { InsertVaccinationDetail(eq) };
            }
        }
        else if (logic == 'addvaccine') {
            var eq = $(this).closest('tr').index();
            AddSingleVaccinationDetail(eq);
        }
    });
    function plannedValidation() {
        var plannedFrom = $(index).closest('tr').find('input:eq(0)').val();
        var plannedTo = $(index).closest('tr').find('input:eq(1)').val();
        if (plannedFrom == '') {
            alert('Please Provide Planned From Date.')
            $(index).closest('tr').find('input:eq(0)').css('border-color', 'red');
            return false;
        }
        else {
            $(index).closest('tr').find('input:eq(0)').removeAttr('css');
        }
        if (plannedTo == '') {
            alert('Please Provide Planned To Date.')
            $(index).closest('tr').find('input:eq(1)').css('border-color', 'red');
            return false;
        }
        else {
            $(index).closest('tr').find('input:eq(1)').removeAttr('css');
        }
        return true;
    }
    function VaccineValidation() {
        var vaccinationDate = $(index).closest('tr').find('#VaccinationDate').val();
        if (vaccinationDate == '') {
            alert('Please Provide Vaccination Date.')
            $(index).closest('tr').find('#VaccinationDate').css('border-color', 'red');
            return false;
        }
        else {
            $(index).closest('tr').find('#VaccinationDate').removeAttr('css');
        }
        return true;
    }
});

function GetPatientInfo() {
    if ($('#txtSearchUHID').val() == '') {
        alert('Please Provide Patient UHID.')
        return
    }
    $('#txtUHID').val('').prop('disabled', false);
    $('#txtPatientName').val('').prop('disabled', false);
    $('#txtDOB').val('').prop('disabled', false);
    $('#txtDistrict').val('').prop('disabled', false);
    $('#txtMobileNo').val('').prop('disabled', false);
    $('#ddlGender').val('Male').prop('disabled', false);
    $('#ddlTemplate').prop('disabled', false);
    $('#tblVaccinationInfo tbody').empty();
    $('#btnSubmitAll').prop('disabled', false);
    var url = config.baseUrl + "/api/Appointment/OPD_VaccineQueries";
    var objBO = {};
    objBO.UHID = $('#txtSearchUHID').val();
    objBO.app_no = '';
    objBO.DoctorId = '';
    objBO.Template = '';
    objBO.dob = '1900/01/01';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.VaccineId = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetPatientInfoByUHID';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtUHID').val(val.UHID).prop('disabled', true);
                        $('#txtPatientName').val(val.PatientName).prop('disabled', true);
                        $('#txtDistrict').val(val.District).prop('disabled', true);
                        $('#txtDOB').val(val.dob.split('T')[0]);
                        if (val.StartDate != 'ITDOSE')
                            $('#txtStartDate').val(val.StartDate.substring(0, 10));
                        else
                            $('#txtStartDate').val(val.dob.split('T')[0]);

                        $('#txtMobileNo').val(val.mobileNo).prop('disabled', true);
                        $('#ddlGender').val(val.Gender).prop('disabled', true);
                        if (val.TemplateName != '') {
                            $('#ddlTemplate option').map(function () {
                                if ($(this).text() == val.TemplateName) {
                                    $('#ddlTemplate').prop('selectedIndex', '' + $(this).index() + '').change();
                                    $('#ddlTemplate').prop('disabled', true);
                                    $('#tblVaccinationInfo tbody').removeClass('blockUI');
                                    $('#btnSubmitAll').prop('disabled', true);
                                    $('#txtDOB').prop('disabled', true);
                                    $('#txtStartDate').prop('disabled', true);
                                }
                                else {
                                    $('#ddlTemplate').prop('selectedIndex', '0').change();
                                    $('#ddlTemplate').prop('disabled', false);
                                    $('#btnSubmitAll').prop('disabled', false);
                                    $('#tblVaccinationInfo tbody').addClass('blockUI');
                                    $('#txtDOB').prop('disabled', false);
                                    $('#txtStartDate').prop('disabled', false);
                                }
                            });
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
function GetTemplateInfo() {
    var url = config.baseUrl + "/api/Appointment/OPD_VaccineQueries";
    var objBO = {};
    objBO.UHID = '';
    objBO.app_no = '';
    objBO.DoctorId = '';
    objBO.Template = '';
    objBO.dob = '1900/01/01';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.VaccineId = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetTemplateInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $('#ddlTemplate').empty().append($('<option></option>').val('Select').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlTemplate').append($('<option></option>').val(val.TemplateName).html(val.TemplateName));
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetGroupInfo(logic) {
    if ($('#txtDOB').val() == '') {
        /*alert('Please Choose DOB');*/
        return
    }
    $('#tblVaccinationInfo tbody').empty();
    var url = config.baseUrl + "/api/Appointment/OPD_VaccineQueries";
    var objBO = {};
    objBO.UHID = $('#txtSearchUHID').val();
    objBO.app_no = '';
    objBO.DoctorId = '';
    objBO.Template = $('#ddlTemplate option:selected').text();
    objBO.dob = $('#txtDOB').val();
    objBO.from = $('#txtStartDate').val();
    objBO.to = '1900/01/01';
    objBO.VaccineId = '';
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    var temp = "";
                    var count = 0;
                    var gcount = 0;
                    var index = 0;
                    var Schedule = '';
                    var ScheduleDay = '';
                    var PlanedFromDate = "";
                    var PlanedToDate = "";
                    var VaccinationDate = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        if (temp != val.VaccineGroup) {
                            gcount++;
                            if (gcount > 1) {
                                tbody += "<tr class='addvaccine'>";
                                tbody += "<td>";
                                tbody += "<select class='form-control'>";
                                tbody += "<option>Select</option>";
                                $.each(data.ResultSet.Table1, function (key, val) {
                                    tbody += "<option value=" + val.VaccineId + ">" + val.VaccineName + "</option>";
                                });
                                tbody += "</select>";
                                tbody += "</td>";
                                tbody += "<td><input type='date' disabled value=" + Schedule + " class='form-control'/></td>";
                                tbody += "<td><input type='date' class='form-control'></td>";
                                tbody += "<td><input type='date' class='form-control'></td>";
                                tbody += "<td class='flex'>";
                                tbody += "<input type='text' class='form-control' style='width:73 %;' placeholder='Sales Invoice No'>&nbsp;";
                                tbody += "<input type='date' class='form-control'>";
                                tbody += "<button id='btnAddVaccine' class='btn btn-success tblGet1 btn-xs'><i class='fa fa-plus'>&nbsp;</i>Add</button>";
                                tbody += "</td>";
                                tbody += "<td style='display:none'>" + ScheduleDay + "</td>";
                                tbody += "</tr>";
                            }

                            tbody += "<tr class='groupday'>";
                            tbody += "<td colspan='2'><b>" + val.VaccineGroup + "</b></td>";
                            if (val.PlanedFromDate != '1900-01-01T00:00:00') {
                                tbody += "<td colspan='2'>";
                                tbody += "<div class='plan-note'>You Need to Provide Both Date for Planning<span class='btn-danger btn-xs help'>?</span></div>";
                                tbody += "<div class='flex'><input type='date' value=" + val.PlanedFromDate.split('T')[0] + " id='PlannedFrom' class='form-control plandate'/>";
                                tbody += "<input type='date' value=" + val.PlanedToDate.split('T')[0] + " id='PlannedTo' class='form-control'/>";
                                tbody += "<button class='btn btn-warning tblGet btn-xs'><i class='fa fa-sign-in'>&nbsp;</i>Save</button></div></td>";
                            }
                            else {
                                tbody += "<td colspan='2'>";
                                tbody += "<div class='plan-note'>You Need to Provide Both Date for Planning<span class='btn-danger btn-xs help'>?</span></div>";
                                tbody += "<div class='flex'><input type='date' id='PlannedFrom' value=" + val.ScheduleDate.split('T')[0] + " class='form-control plandate'/>";
                                tbody += "<input type='date' id='PlannedTo' value=" + val.ScheduleDate.split('T')[0] + " class='form-control'/>";
                                tbody += "<button class='btn btn-warning tblGet btn-xs'><i class='fa fa-sign-in'>&nbsp;</i>Save</button></div></td>";
                            }

                            if (val.VaccinationDate != '1900-01-01T00:00:00') {
                                tbody += "<td>";
                                tbody += "<div class='plan-note'>Sales Invoice No. &nbsp;You Need to Provide Both</div><div class='flex'>";
                                tbody += "<a href=/IPD/Print/SalesBill?InvoiceNo=" + val.PharSaleInvNo + " target='_blank' style='width: 104%;' class='btn-barcode'><i class='fa fa-print'>&nbsp;</i>" + val.PharSaleInvNo + "</a>&nbsp;";
                                tbody += "<input type='date' id='VaccinationDate' value=" + val.VaccinationDate.split('T')[0] + " class='form-control'/>";
                                tbody += "<button class='btn btn-warning tblGet btn-xs'><i class='fa fa-sign-in'>&nbsp;</i>Save</button>";
                                tbody += "</div>";
                                tbody += "</td>";
                            }
                            else {
                                tbody += "<td>";
                                tbody += "<div class='plan-note'>Sales Invoice No. &nbsp;You Need to Provide Both</div><div class='flex'>";
                                tbody += "<input type='text' id='SalesInvoiceNo' placeholder='Sales Invoice No' class='form-control'/>&nbsp;";
                                tbody += "<input type='date' id='VaccinationDate' class='form-control'/>";
                                tbody += "<button class='btn btn-warning tblGet btn-xs'><i class='fa fa-sign-in'>&nbsp;</i>Save</button>";
                                tbody += "</div>";
                                tbody += "</td>";
                            }
                            tbody += "</tr>";
                            temp = val.VaccineGroup;
                            index++;
                        }
                        if (val.PlanedToDate != '1900-01-01T00:00:00')
                            tbody += "<tr class='planeDone'>";
                        else if (val.VaccinationDate != '1900-01-01T00:00:00')
                            tbody += "<tr class='vaccineDone'>";
                        else
                            tbody += "<tr>";
                        tbody += "<td style='display: none'>" + count + "</td>";
                        tbody += "<td style='display:none'>" + val.VaccineId + "</td>";
                        tbody += "<td>" + val.VaccineName + "</td>";
                        tbody += "<td><input type='date' disabled value=" + val.ScheduleDate.split('T')[0] + " class='form-control'/></td>";
                        if (val.PlanedFromDate != '1900-01-01T00:00:00')
                            tbody += "<td><input type='date' value=" + val.PlanedFromDate.split('T')[0] + " class='form-control'/></td>";
                        else tbody += "<td><input type='date' class='form-control'/></td>";

                        if (val.PlanedToDate != '1900-01-01T00:00:00')
                            tbody += "<td><input type='date' value=" + val.PlanedToDate.split('T')[0] + " class='form-control'/></td>";
                        else tbody += "<td><input type='date' class='form-control'/></td>";

                        if (val.VaccinationDate != '1900-01-01T00:00:00') {
                            tbody += "<td class='flex'>";
                            tbody += "<a href=/IPD/Print/SalesBill?InvoiceNo=" + val.PharSaleInvNo + " target='_blank' class='btn-barcode'><i class='fa fa-print'>&nbsp;</i>" + val.PharSaleInvNo + "</a>&nbsp;";
                            tbody += "<input type='date' value=" + val.VaccinationDate.split('T')[0] + " class='form-control' />";
                            tbody += "</td> ";
                        }
                        else {
                            tbody += "<td class='flex'>";
                            tbody += "<input type='text' class='form-control' style='width: 73%;' placeholder='Sales Invoice No' /> &nbsp;";
                            tbody += "<input type='date' class='form-control' />";
                            tbody += "</td > ";
                        }

                        tbody += "<td style='display:none'>" + val.ScheduleDay + "</td>";
                        tbody += "</tr>";

                        PlanedFromDate = "";
                        PlanedToDate = "";
                        VaccinationDate = "";
                        Schedule = val.ScheduleDate.split('T')[0];
                        ScheduleDay = val.ScheduleDay;
                    });
                    $('#tblVaccinationInfo tbody').append(tbody);
                    //$('.addvaccine select').select2();
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetTotalCount(plannedFromDate) {
    $('#ulSchedule').empty();
    var url = config.baseUrl + "/api/Appointment/OPD_VaccineQueries";
    var objBO = {};
    objBO.UHID = $('#txtUHID').val();
    objBO.app_no = '';
    objBO.DoctorId = '';
    objBO.Template = '';
    objBO.dob = $('#txtDOB').val();
    objBO.from = plannedFromDate;
    objBO.to = '1900/01/01';
    objBO.VaccineId = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetTotalScheduleCount';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    var temp = "";
                    var from = "";
                    var to = "";
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        from = val.PlanedFromDate.split('-')[2] + '-' + val.PlanedFromDate.split('-')[1] + '-' + val.PlanedFromDate.split('-')[0];
                        to = val.PlanedToDate.split('-')[2] + '-' + val.PlanedToDate.split('-')[1] + '-' + val.PlanedToDate.split('-')[0];
                        tbody += "<li>";
                        tbody += "" + val.PlanedFromDate + ' - ' + val.PlanedToDate + "<br />";
                        tbody += "<span>" + val.patientCount + "</span><br />";
                        tbody += "<b class='btn btn-warning btn-xs' id='btnChoose' data-from=" + from + " data-to=" + to + ">Choose Schedule</b>";
                        tbody += " </li>";
                    });
                    $('#ulSchedule').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertVaccinationDetail(group) {
    if (confirm('Are you sure to submit?')) {
        var url = config.baseUrl + "/api/Appointment/OPD_InsertVaccinationInfo";
        var objBO = [];
        if (group == 'ALL') {            
            $('#tblVaccinationInfo tbody tr:not(.groupday)').not('.addvaccine').each(function () {
                objBO.push({
                    'IPDNo': $('#txtSearchUHID').val(),
                    'UHID': $('#txtUHID').val(),
                    'PatientName': $('#txtPatientName').val(),
                    'Gender': $('#ddlGender option:selected').text(),
                    'DOB': $('#txtDOB').val(),
                    'StartDate': $('#txtStartDate').val(),
                    'AttendantName': '',
                    'mobileNo': $('#txtMobileNo').val(),
                    'TemplateName': $('#ddlTemplate option:selected').text(),
                    'VaccineId': $(this).find('td:eq(1)').text(),
                    'VaccineName': $(this).find('td:eq(2)').text(),
                    'ScheduleDay': $(this).find('td:eq(7)').text(),
                    'ScheduleDate': $(this).find('td:eq(3)').find('input[type=date]').val(),
                    'PlanedFromDate': $(this).find('td:eq(4)').find('input[type=date]').val(),
                    'PlanedToDate': $(this).find('td:eq(5)').find('input[type=date]').val(),
                    'PlanedBy': Active.userId,
                    'PharSaleInvNo': $(this).find('td:eq(6)').find('input[type=text]').val(),
                    'VaccinationDate': $(this).find('td:eq(6)').find('input[type=date]').val(),
                    'District': $('#txtDistrict').val(),
                    'Address': $('#txtAddress').val(),
                    'VaccineGivenBy': '-',
                    'VaccinationTime': $(this).find('td:eq(6)').find('input[type=date]').val(),
                    'login_id': Active.userId,
                    'Logic': 'InsertVaccinationDetail'
                });
            });
        }
        else {
            $('#tblVaccinationInfo tbody tr:eq(' + group + ')').nextUntil('.groupday').not('.addvaccine').each(function () {
                objBO.push({
                    'IPDNo': $('#txtSearchUHID').val(),
                    'UHID': $('#txtUHID').val(),
                    'PatientName': $('#txtPatientName').val(),
                    'Gender': $('#ddlGender option:selected').text(),
                    'DOB': $('#txtDOB').val(),
                    'StartDate': $('#txtStartDate').val(),
                    'AttendantName': '',
                    'mobileNo': $('#txtMobileNo').val(),
                    'TemplateName': $('#ddlTemplate option:selected').text(),
                    'VaccineId': $(this).find('td:eq(1)').text(),
                    'VaccineName': $(this).find('td:eq(2)').text(),
                    'ScheduleDay': $(this).find('td:eq(7)').text(),
                    'ScheduleDate': $(this).find('td:eq(3)').find('input[type=date]').val(),
                    'PlanedFromDate': $(this).find('td:eq(4)').find('input[type=date]').val(),
                    'PlanedToDate': $(this).find('td:eq(5)').find('input[type=date]').val(),
                    'PlanedBy': Active.userId,
                    'PharSaleInvNo': $(this).find('td:eq(6)').find('input[type=text]').val(),
                    'VaccinationDate': $(this).find('td:eq(6)').find('input[type=date]').val(),
                    'District': $('#txtDistrict').val(),
                    'Address': $('#txtAddress').val(),
                    'VaccineGivenBy': '-',
                    'VaccinationTime': $(this).find('td:eq(6)').find('input[type=date]').val(),
                    'login_id': Active.userId,
                    'Logic': 'InsertVaccinationDetail'
                });
            });
        }
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    //alert(data)
                    GetPatientInfo();
                    GetGroupInfo('GetVaccineInfo:ALL');
                }
                else {
                    alert(data)
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function AddSingleVaccinationDetail(elem) {
    if (confirm('Are you sure to Add?')) {
        var url = config.baseUrl + "/api/Appointment/OPD_InsertVaccinationInfo";
        var objBO = [];
        objBO.push({
            'IPDNo': $('#txtSearchUHID').val(),
            'UHID': $('#txtUHID').val(),
            'PatientName': $('#txtPatientName').val(),
            'Gender': $('#ddlGender option:selected').text(),
            'DOB': $('#txtDOB').val(),
            'StartDate': $('#txtStartDate').val(),
            'AttendantName': '',
            'mobileNo': $('#txtMobileNo').val(),
            'TemplateName': $('#ddlTemplate option:selected').text(),
            'VaccineId': $('#tblVaccinationInfo tbody tr:eq('+elem+')').find('select option:selected').val(),
            'VaccineName': $('#tblVaccinationInfo tbody tr:eq(' + elem + ')').find('select option:selected').text(),
            'ScheduleDay': $('#tblVaccinationInfo tbody tr:eq(' + elem + ')').find('td:eq(5)').text(),
            'ScheduleDate': $('#tblVaccinationInfo tbody tr:eq(' + elem + ')').find('td:eq(1)').find('input[type=date]').val(),
            'PlanedFromDate': $('#tblVaccinationInfo tbody tr:eq(' + elem + ')').find('td:eq(2)').find('input[type=date]').val(),
            'PlanedToDate': $('#tblVaccinationInfo tbody tr:eq(' + elem + ')').find('td:eq(3)').find('input[type=date]').val(),
            'PlanedBy': Active.userId,
            'PharSaleInvNo': $('#tblVaccinationInfo tbody tr:eq(' + elem + ')').find('td:eq(4)').find('input[type=text]').val(),
            'VaccinationDate': $('#tblVaccinationInfo tbody tr:eq(' + elem + ')').find('td:eq(4)').find('input[type=date]').val(),
            'District': $('#txtDistrict').val(),
            'Address': $('#txtAddress').val(),
            'VaccineGivenBy': '-',
            'VaccinationTime': $('#tblVaccinationInfo tbody tr:eq(' + elem + ')').find('td:eq(4)').find('input[type=date]').val(),
            'login_id': Active.userId,
            'Logic': 'InsertVaccinationDetail'
        });     
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    //alert(data)
                    GetPatientInfo();
                    GetGroupInfo('GetVaccineInfo:ALL');
                }
                else {
                    alert(data)
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}