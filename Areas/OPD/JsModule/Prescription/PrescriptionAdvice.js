
$(document).ready(function () {
    $('.OPDPrintPreview .prescribedItem').on('focus', 'input:text', function (e) {
        $(this).select();
    });
    $('.circle-add').on('click', function () {
        var templateId = $(this).attr('id');
        $('#ddlDoctorTemplate option').each(function () {
            if ($(this).val() == templateId) {
                $('#ddlDoctorTemplate').prop('selectedIndex', '' + $(this).index() + '');
            }
        });
        Clear();
        $('#modalTemplate').modal('show');
    });
    $('.panel-body').on('click', 'a.fa-trash', function () {
        var templateId = $(this).data('templateid');
        var itemid = $(this).data('itemid');
        if (confirm('Are you sure want to delete this Item from Template..!')) {
            DeleteTemplateInfo(templateId, itemid);
        }
    });
    $('.panel-body').on('click', 'a.fa-pencil', function () {
        var templateId = $(this).data('templateid');
        var itemName = $(this).data('itemname');
        var itemid = $(this).data('itemid');
        var fav = $(this).data('fav');
        if (fav == true) {
            $('input[name=IsFavourite]').prop('checked', true);
        }
        else {
            $('input[name=IsFavourite]').prop('checked', false);
        }
        $('#ddlDoctorTemplate option').each(function () {
            if ($(this).val() == templateId) {
                $('#ddlDoctorTemplate').prop('selectedIndex', '' + $(this).index() + '').change();
            }
        });
        $('#hiddenDoctorTempItemId').text(itemid);
        $('#txtDoctorItemName').val(itemName);
        $('#btnSaveDoctorTemplate').switchClass('btn-success', 'btn-warning');
        $('#btnSaveDoctorTemplate i').switchClass('fa-plus', 'fa-edit');
        $('#modalTemplate').modal('show');
    });
    $('.panel-title a').on('click', function () {
        $('.panel-title a').find('span.circle').removeClass('circle-open');
        $(this).find('span.circle').addClass('circle-open');
        $('.panel-title a').find('span.circle i').removeClass('circle-open fa-minus-circle');
        $(this).find('span.circle i').addClass('circle-open fa-minus-circle');
    });
    $('.left-panel button').on('click', function () {
        $('.left-panel button').removeClass('active-item');
        $(this).addClass('active-item');
    });
    $('.search-box').on('click', 'button', function () {
        $('button').removeClass('rotate');
        $(this).addClass('rotate');
    });
    GetVitalSign();
    GetDepartment();
    FillHospitalTemplateItems();
    searchList('txtSearchProvisionalDiagnosis', 'ProvisionalDiagnosisList');
    searchList('txtSearchChiefComplaint', 'ChiefComplaintList');
    searchList('txtSearchSignSymptoms', 'SignSymptomsList');
    searchList('txtSearchLaboratoryRadiology', 'LaboratoryRadiologyList');
    searchList('txtSearchVaccinationStatus', 'VaccinationStatusList');
    searchList('txtSearchDoctorNotes', 'DoctorNotesList');
    $('#ddlTransferDept').on('change', function () {
        var DeptId = $(this).val();
        GetDoctor(DeptId);
    });

    $('.panel-body').on('click', 'a.fa-heart', function () {
        var templateId = $(this).data('templateid');
        var itemid = $(this).data('itemid');
        var fav = $(this).data('fav');
        var temp = $(this).data('temp');
        var ul = $(this).parents('ul').attr('id');
        var itemName = $(this).closest('li').find('label').text();
        var isfav = (fav == false) ? 1 : 0;
        MarkAsFavourite(templateId, itemid, itemName, isfav, temp, ul);
    });

    //Prescribed Medicine Add To Preview
    $('.panel-body').on('change', 'input:checkbox', function () {
        var template = $(this).parents('ul').attr('id');
        var TemplateId = $(this).data('templateid');
        PresMediInfoByTempId(TemplateId);
    });

    //select Checkbox Item from Template To Prev
    $('.panel-body').on('change', 'input:checkbox', function () {
        var template = $(this).parents('ul').attr('id');//get parent UL id on template item check
        var PrevTemplateId = template.replace('List', 'Items');//get id of related Template from Prev Side
        var itemId = $(this).data('itemid');//get item id on check
        var itemName = $(this).closest('li').find('label').text();//get item name on check
        var list = "";
        list += "<span id='" + itemId + "'>" + itemName + "</span><close class='remove'>X</close>";//create item list
        $('#' + PrevTemplateId).show();//show related template on prev side [default all template hide in prev side]
        if (this.checked)//on check
        {
            $('#' + PrevTemplateId).append(list);//add item to prev side template group
        }
        else//on un-check
        {
            $('#' + PrevTemplateId + ' span').each(function ()//on uncheck remove particular items from prev template group
            {
                if ($(this).text() == itemName) {
                    $(this).remove();
                }
            });
        }
    });
   
    //Add Items from textarea to prev     
    $('.panel-body').on('keypress', 'textarea', function (e) {   
        if ($(this).data('id') != '') {
            var PrevTemplateId = $(this).data('id');//get id of related Template 	
            var itemName = $(this).val();//get item name on check	
        }
        else {
            var template = $(this).parents('.panel-body').find('ul').attr('id');//get parent UL id on template item check
            var PrevTemplateId = template.replace('List', 'Items');//get id of related Template from Prev Side		
            var itemName = $(this).val();//get item name on check	
        }
        var list = "";
        if (e.keyCode === 13)//on press enter
        {
            e.preventDefault();
            list += "<span id='fromtxt'>" + itemName + "</span><close class='remove'>X</close>";
            $('#' + PrevTemplateId).append(list);
            $('#' + PrevTemplateId).show();
            $(this).val('');
        }
    });

    //Edit Item Inline
    $('.OPDPrintPreview .prescribedItem').on('mouseover', 'span', function () {
        $('.remove').hide();
        $(this).next('.remove').show();
    });
    $('.OPDPrintPreview').on('click', function () {
        $('.remove').hide();
    });
    $('.OPDPrintPreview .prescribedItem').on('click', 'close', function () {
        var itemid = $(this).prev('span').attr('id');//get item id of dbl clicked item
        var template = $(this).prev('span').parents('.prescribedItem').attr('id');//get templateGroup id of dbl clicked item
        var templateId = template.replace('Items', 'List');//get id of related Template from Template Side		
        $('.panel-body #' + templateId + ' li').each(function ()//uncheck related items from template side afetr remove item from prev side
        {
            if ($(this).find('input:checkbox').data('itemid') == itemid) {
                $(this).find('input:checkbox').prop('checked', false);
            }
        });
        $(this).prev('span').remove();
        $(this).remove();
    });
    $('.OPDPrintPreview .prescribedItem').on('click', 'span', function () {
        var itemid = $(this).attr('id');
        var itemName = $(this).text();
        $(this).replaceWith('<input type="text" value="' + itemName + '"/>');
        $('input:text').focus();
    });
    $('.OPDPrintPreview .prescribedItem').on('blur', 'input:text', function () {
        var itemName = $(this).val();
        $(this).replaceWith("<span id='fromtext'>" + itemName + "</span>");
        //$(this).remove()
    });
    $('.OPDPrintPreview .prescribedItem').on('keydown', 'input:text', function (e) {
        if (e.keyCode == 13) {
            var itemName = $(this).val();
            $(this).replaceWith("<span id='fromtext'>" + itemName + "</span>");
            //$(this).remove()
        }
    });
    //remove all slected items from prev side and uncheck from template side
    $('.OPDPrintPreview .prescribedItem').on('dblclick', 'TemplateGroup', function () {
        var template = $(this).parents('.prescribedItem').attr('id');//get template id
        var templateId = template.replace('Items', 'List');//get UL id of template list
        $(this).siblings('span').remove();//remove all this template group items
        $(this).closest('.prescribedItem').hide();//hide this template group of prev side
        $('.panel-body #' + templateId).find('input:checkbox').prop('checked', false);//uncheck all related items from template side
    });
    $('#PatientVisits #tblPatientVisits tbody').on('click', '.currentVisit', function () {
        var appno = $(this).closest('tr').find('td:eq(0)').text();
        AdvicePreview(appno);
        $('.nav-tabs li').removeClass('active')
        $('.tab-content div[id="PatientVisits1"]').removeClass('active in')
        $('a[href="#menu11"]').closest('li').addClass('active');
        $('.tab-content div[id="menu11"]').addClass('active in')
    });
});

function GetVitalSign() {
    var url = config.baseUrl + "/api/Prescription/CPOE_PrescriptionAdviceQueries";
    var objBO = {};
    objBO.app_no = Active.AppId;
    objBO.Logic = 'GetVitalSign';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('.OPDPrintPreview TemplateGroup[id=VitalSign] span').empty();
            var tbody = "";
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlTransferDept').append($('<option></option>').val(val.DeptId).html(val.DepartmentName)).select2();               
                    tbody += "<span>Weight :" + val.WT + " kg</span>";
                    tbody += "<span>Temperature : " + val.Temprarture + " °C</span>";
                    tbody += "<span>Pulse : " + val.Pulse + " p-m</span>";                
                    tbody += "<span>B/P : " + val.BP_ys + '/' + val.BP_Dys + " mm/Hg</span>";                
                    tbody += "<span>SPO2 : " + val.SPO2 + "</span>";
                    tbody += "<span>Height : " + val.HT + " CM</span>";
            });
            $('.OPDPrintPreview TemplateGroup[id=VitalSign]').append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDepartment() {
    var url = config.baseUrl + "/api/Prescription/CPOE_PrescriptionAdviceQueries";
    var objBO = {};
    objBO.Logic = 'GetDept';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#ddlTransferDept').empty().append($('<option></option>').val(00).html('Select Template'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlTransferDept').append($('<option></option>').val(val.DeptId).html(val.DepartmentName)).select2();
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDoctor(DeptId) {
    var url = config.baseUrl + "/api/Prescription/CPOE_PrescriptionAdviceQueries";
    var objBO = {};
    objBO.DeptId = DeptId;
    objBO.Logic = 'GetDoctor';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#ddlTransferReferTo').empty().append($('<option></option>').val(00).html('Select Refer To'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlTransferReferTo').append($('<option></option>').val(val.DoctorId).html(val.DoctorName)).select2();
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function FillHospitalTemplateItems() {
    var url = config.baseUrl + "/api/Prescription/CPOE_PrescriptionAdviceQueries";
    var objBO = {};
    objBO.DoctorId = 'DR00010';
    objBO.Logic = 'HospitalTemplateItems';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#ProvisionalDiagnosisList').empty();
            var li = "";
            $.each(data.ResultSet.Table, function (key, val) {
                li += "<li>";
                li += "<a><label><input type='checkbox' data-itemid='" + val.ItemId + "'/>&nbsp;" + val.ItemName + "</label></a>";
                li += "<a data-temp='HospitalList' data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " class='fa fa-heart' style='color:" + val.fav + "'></a>";
                li += "</li>";
            });
            $('#ProvisionalDiagnosisList').append(li);

            $('#ChiefComplaintList').empty();
            var li = "";
            $.each(data.ResultSet.Table1, function (key, val) {
                li += "<li>";
                li += "<a><label><input type='checkbox' data-itemid='" + val.ItemId + "'/>&nbsp;" + val.ItemName + "</label></a>";
                li += "<a data-temp='HospitalList' data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " class='fa fa-heart' style='color:" + val.fav + "'></a>";
                li += "</li>";
            });
            $('#ChiefComplaintList').append(li);

            $('#SignSymptomsList').empty();
            var li = "";
            $.each(data.ResultSet.Table2, function (key, val) {
                li += "<li>";
                li += "<a><label><input type='checkbox' data-itemid='" + val.ItemId + "'/>&nbsp;" + val.ItemName + "</label></a>";
                li += "<a data-temp='HospitalList' data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " class='fa fa-heart' style='color:" + val.fav + "'></a>";
                li += "</li>";
            });
            $('#SignSymptomsList').append(li);

            $('#VaccinationStatusList').empty();
            var li = "";
            $.each(data.ResultSet.Table3, function (key, val) {
                li += "<li>";
                li += "<a><label><input type='checkbox' data-itemid='" + val.ItemId + "'/>&nbsp;" + val.ItemName + "</label></a>";
                li += "<a data-temp='HospitalList' data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " class='fa fa-heart' style='color:" + val.fav + "'></a>";
                li += "</li>";
            });
            $('#VaccinationStatusList').append(li);

            $('#DoctorNotesList').empty();
            var li = "";
            $.each(data.ResultSet.Table4, function (key, val) {
                li += "<li>";
                li += "<a><label><input type='checkbox' data-itemid='" + val.ItemId + "'/>&nbsp;" + val.ItemName + "</label></a>";
                li += "<a data-temp='HospitalList' data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " class='fa fa-heart' style='color:" + val.fav + "'></a>";
                li += "</li>";
            });
            $('#DoctorNotesList').append(li);

            $('#LaboratoryRadiologyList').empty();
            var li = "";
            $.each(data.ResultSet.Table8, function (key, val) {
                li += "<li>";
                li += "<a><label><input type='checkbox' data-itemid='" + val.ItemId + "'/>&nbsp;" + val.ItemName + "</label></a>";
                li += "<a data-temp='HospitalList' data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " class='fa fa-heart' style='color:" + val.fav + "'></a>";
                li += "</li>";
            });
            $('#LaboratoryRadiologyList').append(li);

            $('#PrescribedMedicineList').empty();
            var li = "";
            $.each(data.ResultSet.Table9, function (key, val) {
                li += "<li>";
                li += "<a><label><input type='checkbox' data-templateid='" + val.med_TemplateId + "'/>&nbsp;" + val.med_TemplateName + "</label></a>";
                li += "</li>";
            });
            $('#PrescribedMedicineList').append(li);

            $('#PrescribedProcedureList').empty();
            var li = "";
            $.each(data.ResultSet.Table10, function (key, val) {
                li += "<li>";
                li += "<a><label><input type='checkbox' data-itemid='" + val.ItemId + "'/>&nbsp;" + val.ItemName + "</label></a>";
                li += "</li>";
            });
            $('#PrescribedProcedureList').append(li);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PresMediInfoByTempId(templateId) {
    var url = config.baseUrl + "/api/Prescription/CPOE_PrescriptionAdviceQueries";
    var objBO = {};
    objBO.TemplateId = templateId;
    objBO.DoctorId = 'DR00010';
    objBO.Logic = 'PresMediInfoByTempId';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('.MedicineTemplate tbody').empty();
            var tbody = "";
            $.each(data.ResultSet.Table, function (key, val) {
                tbody += "<tr data-itemid=" + val.Item_id + ">";
                tbody += "<td>" + val.Item_name + "</td>";
                tbody += "<td>" + val.med_dose + "</td>";
                tbody += "<td>" + val.med_times + "</td>";
                tbody += "<td>" + val.med_duration + " Days</td>";
                tbody += "<td>" + val.med_intake + "</td>";
                tbody += "<td>" + val.med_route + "</td>";
                tbody += "<td>" + val.qty + "</td>";
                tbody += "<td>" + val.remark + "</td>";
                tbody += "</tr>";
            });
            $('.MedicineTemplate tbody').append(tbody)
            $('.OPDPrintPreview #PrescribedMedicine').show();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function FilteredTemplate(FilterType, TemplateId, ul) {
    var url = config.baseUrl + "/api/Prescription/CPOE_PrescriptionAdviceQueries";
    var objBO = {};
    objBO.TemplateId = TemplateId;
    objBO.FilterType = FilterType;
    objBO.DoctorId = 'DR00010';
    objBO.Logic = 'FilteredTemplateOfDoctor';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#' + ul + '').empty();
            var li = "";
            $.each(data.ResultSet.Table, function (key, val) {
                li += "<li>";
                li += "<a><label><input type='checkbox' data-itemid=" + val.ItemId + "/>&nbsp;" + val.ItemName + "</label></a>";
                if (FilterType == 'HospitalList') {
                    li += "<a data-temp=" + FilterType + " data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " class='fa fa-heart' style='color:" + val.fav + "'></a>";
                }
                else if (FilterType == 'FavouriteList') {
                    li += "<a data-temp=" + FilterType + " data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " class='fa fa-heart' style='color:" + val.fav + "'></a>";
                }
                else {
                    li += "<a data-temp=" + FilterType + " data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " data-itemname='" + val.ItemName + "' class='fa fa-trash'></a>";
                    li += "<a data-temp=" + FilterType + " data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " data-itemname='" + val.ItemName + "' class='fa fa-pencil' style='color:#1483a5'></a>";
                    li += "<a data-temp=" + FilterType + " data-fav=" + val.IsFavourite + " data-templateid=" + val.TemplateId + " data-itemid=" + val.ItemId + " class='fa fa-heart' style='color:" + val.fav + "'></a>";
                }
                li += "</li>";
            });
            $('#' + ul + '').append(li);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertPrescAdvice() {
    var url = config.baseUrl + "/api/Prescription/CPOE_InsertUpdateAdviceProcess";
    var objBO = {};
    objBO.UHID = Active.app_no;
    objBO.app_no = Active.app_no;
    objBO.DoctorId = 'doctorId-Test';
    objBO.DeptId = $('#ddlTransferDept option:selected').val();;
    objBO.DoctorId_Trf = $('#ddlTransferReferTo option:selected').val();
    objBO.caseType = $('input[name=TransferRefertype]:checked').val();
    objBO.consultType = $('input[name=TransferConsultationType]:checked').val();
    objBO.doctor_diagnosis = $('#txtTransferDoctorDiagnosis').val();
    objBO.doctor_remark = $('#txtTransferDoctorRemark').val();
    objBO.login_id = Active.userId;
    objBO.Logic = 'InsertPrescAdvice';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('success')) {
                alert(data);

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
function MarkAsFavourite(TemplateId, ItemId, ItemName, IsFav, temp, ul) {
    var url = config.baseUrl + "/api/Prescription/CPOE_InsertUpdateAdviceProcess";
    var objBO = {};
    objBO.TemplateType = 'Doctor';
    objBO.DoctorId = 'DR00010';
    objBO.TemplateId = TemplateId;
    objBO.ItemId = ItemId;
    objBO.prm_1 = ItemName;
    objBO.IsFav = IsFav;
    objBO.login_id = Active.userId;
    objBO.Logic = 'ProvisionalDiagnosisMarkAsFav';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('success')) {
                if (temp.includes('HospitalList')) {
                    FillHospitalTemplateItems();
                }
                else {
                    FilteredTemplate(temp, TemplateId, ul);
                }
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
function searchList(txt, ul) {
    $('#' + txt).on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#' + ul + ' li').filter(function () {
            $(this).toggle($(this).find('a label').text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
}
function DeleteTemplateInfo(TemplateId, ItemId) {
    var url = config.baseUrl + "/api/master/CPOE_InsertUpdateMaster";
    var objBO = {};
    objBO.TemplateType = 'Doctor';
    objBO.DoctorId = 'DR00010';
    objBO.TemplateId = TemplateId;
    objBO.ItemId = ItemId;
    objBO.ItemName = '';
    objBO.IsFavourite = 0;
    objBO.login_id = Active.userId;
    objBO.Logic = 'DeleteTemplateInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                $('.panel-body').find('button.rotate').trigger('click');
                $('#modalTemplate').modal('hide');
            }
            else {
                alert(data);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AdvicePreview(appno) {
    $('#PresPreview').removeAttr('src');
    var url = "http://localhost:54687/opd/print/AdvicePreview?app_no=" + appno;    
    $('#PresPreview').attr('src', url);
}
function PresPreview() {
    $('#PresPreview').removeAttr('src');
    var url = "http://localhost:54687/opd/print/AdvicePreview?app_no=" + Active.AppId;   
    $('#PresPreview').attr('src', url);
}

