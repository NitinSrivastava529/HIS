/// <reference path="../../../jsmodule/filesaver.min.js" />

$(document).ready(function () {
    CloseSidebar();    
    var AppId = sessionStorage.getItem('AppId');
    if (AppId != null) {
        PatientHeaderInfo();
    }
    else {
        window.location.href = "OPD_ViewConsultation";
    }
    $('#listChiefComplaint').on('change', 'input:checkbox', function () {
        var isCheck = $(this).is(':checked');
        var val = $(this).closest('label:not(input)').text();
        if (isCheck) {
            $('#ChiefComplaintPrintPreview').show();
            $('#ChiefComplaintPrintPreview .desc').append(val);
            isDesc();
        }
        else {
            $('#ChiefComplaintPrintPreview').remove(val);
        }
    });
    $('#ChiefComplaintRemark').on('keyup', function () {
        $('#ChiefComplaintPrintPreview').show();
        var val = $(this).val();
        $('#ChiefComplaintPrintPreview .desc').text(val);
        isDesc();
    });   
});

function removeChiefComplaint() {
    $('#ChiefComplaintPrintPreview .desc').text('');
    $('#ChiefComplaintPrintPreview').hide();
}
function isDesc() {
    var len = $('.desc').text().length;
    if (len < 1) {
        $('.prescribedItem').hide();
    }
}
function loadBody(page) {
    $.ajax({
        type: 'POST',
        url: 'AdviceBody',
        data: { page: page },
        success: function (data) {
            $('#dash-dynamic-section').empty();
            $('#dash-dynamic-section').html(data);
        }
    });
}
function downloadFile(ele) {
    var url = config.baseUrl + "/api/Appointment/Base64";
    var objBO = {};
    objBO.AppointmentId = Active.AppId;
    objBO.Logic = 'PatientForAdvice';
    Global_DownloadPdf(url, '', 'test.pdf')
}
function PatientHeaderInfo() {
    var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
    var objBO = {};
    objBO.AppointmentId = Active.AppId;
    objBO.Logic = 'PatientForAdvice';
    $.ajax({
        method: "POST", 
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {           
            if (Object.keys(data.ResultSet).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#tblAdviceHeader tbody').find('tr:eq(0)').find('td:eq(3)').text(val.patient_name);
                    $('#tblAdviceHeader tbody').find('tr:eq(0)').find('td:eq(6)').text(val.Age);
                    $('#tblAdviceHeader tbody').find('tr:eq(0)').find('td:eq(9)').text(val.app_no);
                    $('#tblAdviceHeader tbody').find('tr:eq(0)').find('td:eq(12)').text(val.AppDate);

                    $('#tblAdviceHeader tbody').find('tr:eq(1)').find('td:eq(2)').text(val.DoctorName);
                    $('#tblAdviceHeader tbody').find('tr:eq(1)').find('td:eq(5)').text(val.UHID);
                    $('#tblAdviceHeader tbody').find('tr:eq(1)').find('td:eq(8)').text(val.PanelName);

                    //OPD Preview
                    $('#lblPreviewPatientName').text(val.patient_name);
                    $('#lblPreviewUHID').text(val.UHID);
                    $('#lblPreviewAgeSex').text(val.Age);
                    $('#lblAppDate').text(val.AppDate);
                    $('#lblPreviewDoctorName').text(val.DoctorName);
                    $('#lblVisitType').text(val.appType);
                    $('#lblMobileNo').text(val.mobile_no);
                    $('#lblPreviewPanel').text(val.PanelName);
                    if (val.IsLocked == 1) {
                        $('button[id=btnCloseApp]').attr('disabled', true);
                        $('button[id=btnSaveApp]').attr('disabled', true);
                    }
                });
            }
            else {
                alert('No Record Found..');
            }
        },
        complete: function () { PatientForAdvice(); },
        error: function (response) {
            alert('Server Error...!');
        },
    });
}
function PatientForAdvice() {
    var url = config.baseUrl + "/api/Appointment/Opd_AppointmentQueries";
    var objBO = {};
    objBO.UHID = $('#tblAdviceHeader tbody').find('tr:eq(1)').find('td:eq(5)').text();
    objBO.AppointmentId = $('#tblAdviceHeader tbody').find('tr:eq(0)').find('td:eq(9)').text();
    objBO.DoctorId = 'DR00033';
    objBO.Logic = 'PatientForAdvice';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(objBO.DoctorId)
            console.log(data)
            if (Object.keys(data.ResultSet).length > 0) {
                var TemplateId = "";
                $.each(data.ResultSet.Table1, function (key, val) {
                    if (val.TemplateId == 'T00001') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#ProvisionalDiagnosisItems').append(item).show();
                    }
                    if (val.TemplateId == 'T00002') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#ChiefComplaintItems').append(item).show();
                    }
                    if (val.TemplateId == 'T00003') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#SignSymptomsItems').append(item).show();
                    }
                    if (val.TemplateId == 'T00004') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#VaccinationStatusItems').append(item).show();
                    }
                    if (val.TemplateId == 'T00005') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#DoctorNotesItems').append(item).show();
                    }
                    if (val.TemplateId == 'T00006') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#AllergiesItems').append(item).show();
                    }
                    if (val.TemplateId == 'T00007') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#PastMedicationItems').append(item).show();
                    }
                    if (val.TemplateId == 'T00008') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#DoctorAdviceItems').append(item).show();
                    }
                    if (val.TemplateId == 'T00009') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#LaboratoryRadiologyItems').append(item).show();
                    }
                    if (val.TemplateId == 'T00010') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#PrescribedProcedureItems').append(item).show();
                    }
                    if (val.TemplateId == 'T00015') {
                        var item = "<span id='" + val.ItemId + "'>" + val.ItemName + "</span><close class='remove'>X</close>";
                        $('#HistoryItems').append(item).show();
                    }
                });

                $('.MedicineTemplate tbody').empty();
                var tbody = "";
                $.each(data.ResultSet.Table2, function (key, val) {
                    tbody += "<tr data-itemid=" + val.Item_id + ">"
                    tbody += "<td>" + val.Item_name + "</td>";
                    tbody += "<td>" + val.med_dose + "</td>";
                    tbody += "<td>" + val.med_times + "</td>";
                    tbody += "<td>" + val.med_duration + "</td>";
                    tbody += "<td>" + val.med_intake + "</td>";
                    tbody += "<td>" + val.med_route + "</td>";
                    tbody += "<td>" + val.qty + "</td>";
                    tbody += "<td>" + val.remark + "</td>";
                    tbody += "</tr>"
                    $('div[id=PrescribedMedicine]:eq(1)').show();
                });
                $('.MedicineTemplate tbody').append(tbody);

                $('#PatientVisits #tblPatientVisits tbody').empty();
                var currentvisits = "";
                var visits = "";
                var tbody = "";
                $.each(data.ResultSet.Table6, function (key, val) {
                    //if (val.app_no == Active.AppId) {
                    //	currentvisits += "<label class='currentVisit' style='background:#349016;color:#fff'>Current Visit<b onclick=AdvicePreview('" + val.app_no + "') class='fa fa-print'></b></label>";
                    //}
                    //else {
                    //	visits += "<label class='currentVisit'>" + val.PatientVisits + "<b onclick=AdvicePreview('" + val.app_no + "') class='fa fa-print'></b></label>";
                    //}	
                    tbody += "<tr>";
                    tbody += "<td>" + val.app_no + "</td>";
                    tbody += "<td>" + val.PatientVisits + "</td>";
                    tbody += "<td class='currentVisit'><i class='fa fa-print'></i></td>";
                    tbody += "</tr>";

                });
                currentvisits += visits;
                $('#PatientVisits #tblPatientVisits tbody').append(tbody);
            }
            else {
                alert('No Record Found..');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        },
    });
}
function AdvicePreview(appno) {
    var url = "../Print/AdvicePreview?app_no=" + appno;
    window.open(url, '_blank');
}