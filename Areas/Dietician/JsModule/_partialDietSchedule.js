var _DoctorId;
var _FloorName;
var _SelectedFloor;
var _SelectedRoomType;
var _SelectedNew;
var dietLogic = 'GetDietInfoForReSchedule';
$(document).ready(function () {
    GetDietType()
    FillCurrentDate('txtReScheduleDate');
    FillCurrentDate('txtScheduleDate');
    $('#ddlRemarks').on('change', function () {
        $('#txtRemark').val($(this).find('option:selected').text());
    });
    $('#tblDietItemDetail tbody').on('change', 'select', function () {
        $(this).closest('tr').find('td:eq(2)').find('input:text').val($(this).find('option:selected').data('measuring'));
        $(this).closest('tr').find('td:eq(3)').find('input:text').val($(this).find('option:selected').data('calcount'));
    });
    $('#tblDietItemDetail tbody').on('click', 'button[id=Remove]', function () {
        $(this).closest('tr').remove();
        TotalCalCount();
    });
    $('#btnGetDietInfoForSchedule').on('click', function () {
        if ($('#ddlDietName option:selected').text() == 'Select') {
            alert('Please Select Diet.')
            return;
        }
        dietLogic = "GetDietInfoForSchedule";
        GetDietInfoForSchedule($('#ddlDietName option:selected').data('dietid'))
    });
    $('#tblDietItemDetail tbody').on('click', 'button[id=add]', function () {
        var ItemId = $(this).closest('tr').find('td:eq(0)').find('select option:selected').data('itemid');
        var ItemName = $(this).closest('tr').find('td:eq(0)').find('select option:selected').text();
        var Qty = $(this).closest('tr').find('td:eq(1)').find('input:text').val();
        var Measuring = $(this).closest('tr').find('td:eq(2)').find('input:text').val();
        var CalCount = $(this).closest('tr').find('td:eq(3)').find('input:text').val();
        var CategoryName = $('#ddlDietName option:selected').val();
        var DietId = $('#ddlDietName option:selected').data('dietid');
        if (eval(Qty) < 1 || Qty == '') {
            alert('Please Provide Quantity.');
            $(this).closest('tr').find('td:eq(1)').find('input:text').css('border-color', 'red');
            $(this).closest('tr').find('td:eq(1)').find('input:text').focus();
            return
        }
        else {
            $(this).closest('tr').find('td:eq(1)').find('input:text').removeAttr('style');
        }
        var tbody = "";
        var arrItemId = [];
        $('#tblDietItemDetail tbody tr:not(.AddItem)').each(function () { arrItemId.push($(this).find('td:eq(0)').text()) });
        if ($.inArray(ItemId, arrItemId) == -1) {
            tbody += "<tr>";
            tbody += "<td style='display:none'>" + ItemId + "</td>";
            tbody += "<td>" + ItemName + "</td>";
            tbody += "<td class='text-right'>" + Qty + "</td>";
            tbody += "<td>" + Measuring + "</td>";
            tbody += "<td class='text-right'>" + CalCount + "</td>";
            tbody += "<td><button id='Remove' style='height: 15px;line-height:0' class='btn btn-danger btn-xs'><i class='fa fa-trash'>&nbsp;</i></button></td>";
            tbody += "<td style='display:none'>" + CategoryName + "</td>";
            tbody += "<td style='display:none'>" + DietId + "</td>";
            tbody += "</tr>";

            $('#tblDietItemDetail tbody tr.AddItem').after(tbody);
            TotalCalCount();
        }
        else {
            alert('This Item Already Added.');
        }
    });
    $('#tblScheduledInfo tbody').on('mouseenter', 'td.remark', function () {
        var remark = "<div class='toolTipRemark'><b>Remark : </b>" + $(this).data('remark') + "</div>";
        $(this).append(remark);
        $(this).find('.toolTipRemark').css({ top: $(this).position().top, left: $(this).position().left });
    }).on('mouseleave', 'td.remark', function () {
        $('#tblScheduledInfo tbody').find('.toolTipRemark*').remove();
    });
    $('#txtScheduleDate').change(function () {
        GetAllDietForDietSchedule("ByDate");
        GetScheduledDietInfo($('#txtIPDNo').text());
    });
    GetAllDietForDietSchedule("ByDate");
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
        if (_SelectedNew && (_SelectedNew != 'ALL')) {
            result = result && _SelectedNew === self.data('new');
        }
        return result;
    }).show();  
}
function totalCount() {
    var totalLen = 0;
    $('#IPDPatientList .section').each(function () {
        if($(this).css('display') != 'none')
            totalLen++;
    });
    $('#totaFilterCount').text('Total : '+totalLen);  
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
function GetAllDietForDietSchedule(SelectionLogic) {
    $('#ddlDietName').empty().append($('<option></option>').val('Select').html('Select')).select2();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = $('#txtScheduleDate').val();
    objBO.to = '1900/01/01';
    objBO.Prm1 = SelectionLogic;//$('#ddlDietCategory option:selected').text();
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetAllDietForDietSchedule';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var categoryName = "";
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlDietName').append($('<option data-dietid="' + val.DietId + '"></option>').val(val.CategoryName).html(val.DietName));
            });
            $('#ddlDietName').val('Select').change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDietMasterForDietSchedule(dietTypeId) {
    $('#ddlDietName').empty().append($('<option></option>').val('Select').html('Select')).select2();
    $('#ddlDietCategory').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = dietTypeId;
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetDietMasterForDietSchedule';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var categoryName = "";
            $.each(data.ResultSet.Table, function (key, val) {
                if (categoryName != val.CategoryName) {
                    $('#ddlDietCategory').append($('<option></option>').val(val.CategoryName).html(val.CategoryName));
                    categoryName = val.CategoryName;
                }
            });
            $('#ddlDietCategory').val('ALL').change();
            $('#ddlDietName').val('Select').change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDietInfoForSchedule(dietId) {
    $('#tblDietItemDetail tbody').empty();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = $('#txtIPDNo').text();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = dietId;
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = dietLogic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var tbody1 = "";
            var count = 0;
            var itemInfo = "";
            $.each(data.ResultSet.Table, function (key, val) {
                count++;
                tbody += "<tr>";
                tbody += "<td style='display:none'>" + val.ItemId + "</td>";
                tbody += "<td>" + val.ItemName + "</td>";
                tbody += "<td class='text-right'>" + val.qty + "</td>";
                tbody += "<td>" + val.Measuring + "</td>";
                tbody += "<td class='text-right'>" + val.CalorieCount + "</td>";
                tbody += "<td><button id='Remove' style='height: 15px;line-height:0' class='btn btn-danger btn-xs'><i class='fa fa-trash'>&nbsp;</i></button></td>";
                tbody += "<td style='display:none'>" + val.CategoryName + "</td>";
                tbody += "<td style='display:none'>" + val.DietId + "</td>";
                tbody += "</tr>";
                $('#txtRemark').val(val.remarks);
            });
            itemInfo += "<option value='Select'>Select</option>";
            $.each(data.ResultSet.Table1, function (key, val) {
                itemInfo += "<option data-itemid=" + val.ItemId + " data-calcount=" + val.CalorieCount + " data-measuring=" + val.Measuring + ">" + val.ItemName + "</option>";
            });       
            $('#txtRemark').val('');
            if (count > 0) {
                tbody1 += "<tr class='AddItem'>";
                tbody1 += "<td style='padding:1px'>";
                tbody1 += "<select class='form-control'>";
                tbody1 += itemInfo;
                tbody1 += "</select>";
                tbody1 += "</td>";
                tbody1 += "<td style='padding:1px'><input type='text' class='form-control' placeholder='Quantity'></td>";
                tbody1 += "<td style='padding:1px'><input type='text' disabled  class='form-control' placeholder='Measurement'></td>";
                tbody1 += "<td style='padding:1px'><input type='text' disabled class='form-control' placeholder='Cal. Count'></td>";
                tbody1 += "<td><button id='add' style='height: 21px;line-height:0' class='btn btn-success btn-xs'><i class='fa fa-plus'>&nbsp;</i></button></td>";
                tbody1 += "</tr>";
                tbody = tbody1 + tbody;
            }

            $('#tblDietItemDetail tbody').append(tbody);
            $('#tblDietItemDetail tbody select').select2();
            TotalCalCount();
            dietLogic = 'GetDietInfoForReSchedule';
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function TotalCalCount() {
    var totalCal = 0;
    $('#tblDietItemDetail tbody tr:not(.AddItem)').each(function () {
        totalCal += eval($(this).find('td:eq(4)').text());
    });
    $('#TotalCalCount').text(totalCal.toFixed(1));
}
function GetScheduledDietInfo(ipdNo) {
    $('#tblScheduledInfo tbody').empty();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = ipdNo;
    objBO.from = $('#txtScheduleDate').val();
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetScheduledDietInfoByIPDNo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var temp = "";
            $.each(data.ResultSet.Table, function (key, val) {
                //if (temp != val.DietCategory) {
                //    tbody += "<tr style='background:#fff1be'>";
                //    tbody += "<td colspan='3'><b>Diet Category : </b>" + val.DietCategory + "</td>";
                //    tbody += "</tr>";
                //    temp = val.DietCategory;
                //}
                tbody += "<tr>";
                tbody += "<td  style='padding:0'><button id='btnView' onclick=DeleteScheduledItem('" + val.RequestId + "') class='btn btn-danger'><i class='fa fa-trash'>&nbsp;</i>Delete</button></td>";
                tbody += "<td class='remark' data-remark='"+val.remarks+"'>" + val.DietName + "</td>";
                tbody += "<td>" + val.DietCategory + "</td>";
                tbody += "<td>" + val.ServingDate + "</td>";               
                tbody += "</tr>";
            });
            $('#tblScheduledInfo tbody').append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function NutritionBreakup() {
    var itemId = [];
    $('#tblDietItemDetail tbody tr:not(.AddItem)').each(function () {
        itemId.push(
            $(this).find('td:eq(0)').text()
        )
    });
    if (itemId.length == 0) {
        alert('No Item Found.')
        return
    }
    $('#tblNutritionBreakup tbody').empty();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = 0;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = itemId.join(',');
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'NutritionBreakup';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var temp = "";
            $.each(data.ResultSet.Table, function (key, val) {
                tbody += "<tr>";
                tbody += "<td>" + val.NutritionName + "</td>";
                tbody += "<td class='text-center'>" + val.NutritionValue + "</td>";
                tbody += "<td>" + val.Measuring + "</td>";
                tbody += "</tr>";
            });
            $('#tblNutritionBreakup tbody').append(tbody);
            $('#modalNutritionBreakup').modal('show');
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
function PatientInfo(ipd) {
    Clear();
    TotalCalCount();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = ipd;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetPatientInfoByIPDNo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, patientInfo) {
                        $('#txtIPDNo').text(patientInfo.IPDNo);
                        $('#txtPatientName').text(patientInfo.PatientName);
                        $('#txtGender').text(patientInfo.Gender);
                        $('#txtContactNo').text(patientInfo.Mobile);
                        $('#txtAge').text(patientInfo.Age);
                        $('#txtDoctorName').text(patientInfo.DoctorName);
                        $('#txtDoctorId').text(patientInfo.DoctorId);
                        $('#txtMedicalProcedure').text(patientInfo.medicalProcedure);
                        $('#txtPreExistingDisease').text(patientInfo.PreExistingDisease);
                        $('#txtDietRecommended').html("<i class='fa fa-check-circle'>&nbsp;</i>" + patientInfo.DietType);
                        $('#txtFloorName').text(patientInfo.FloorName);
                        $('#txtRoomNo').text(patientInfo.RoomNo);
                        $('#txtBedNo').text(patientInfo.BedNo);
                        GetDietMasterForDietSchedule(patientInfo.DietTypeId);
                        GetScheduledDietInfo(patientInfo.IPDNo);
                    });
                    $('#ddlRemarks').empty().append($('<option></option>').val('Select').html('Select')).select2();
                    $.each(data.ResultSet.Table1, function (key, val) {
                        $('#ddlRemarks').append($('<option></option>').val(val.remarks).html(val.remarks)).select2();
                    });
                }
            }
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
        objBO.DischargeDateTime = $('#txtDischargeDateTime').val();
        objBO.MedicalProcedure = $('#txtMedicalProcedure').val();
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
function DeleteScheduledItem(RequestId) {
    if (confirm('Are you sure to delete?')) {
        var url = config.baseUrl + "/api/Dietician/diet_InsertUpdateDiet";
        var objBO = {};
        objBO.IPDNo = RequestId;
        objBO.AdmitDate = '1900/01/01';
        objBO.Age = 0;
        objBO.DischargeDateTime = '1900/01/01';
        objBO.login_id = Active.userId;
        objBO.Logic = 'DeleteScheduledItem';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {                    
                    var html = "";
                    var Diet = data.split('|')[1];
                    var DietCategory = Diet.split(',');
                    //alert(data.split('|')[0]);
                    GetScheduledDietInfo($('#txtIPDNo').text());
                    ClearDiet();
                    //GetPatientDetails();
                    if (DietCategory.length > 0) {
                        for (var i = 0; i < DietCategory.length; i++)
                            html += "<span class='dietScheduled'><i class='fa fa-check-circle'>&nbsp;</i>" + DietCategory[i] + "</span>";
                    }
                    $('#IPDPatientList .selected').find('table tbody tr').each(function () {
                        $(this).find('#dietscheduled').html(html);
                        $('#IPDPatientList .selected').addClass('bgLightGreen');
                    });
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
function ExitFromDiet(elem) {
    if (confirm('Are you sure to Exit this patient?')) {
        var url = config.baseUrl + "/api/Dietician/diet_InsertUpdateDiet";
        var objBO = {};
        objBO.IPDNo = $(elem).data('ipdno');
        objBO.AdmitDate = '1900/01/01';
        objBO.Age = 0;
        objBO.DischargeDateTime = '1900/01/01';
        objBO.login_id = Active.userId;
        objBO.Logic = 'ExitFromDiet';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                $(elem).closest('tr').parents('table').parents('div.dischargeInfo').remove();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function InsertDietSchedule() {
    if (ValidationDietSchedule()) {
        var url = config.baseUrl + "/api/Dietician/diet_InsertDietSchedule";
        var objBO = [];
        $('#tblDietItemDetail tbody tr:not(.AddItem)').each(function () {
            objBO.push({
                'IPDNo': $('#txtIPDNo').text(),
                'FloorName': $('#txtFloorName').text(),
                'RoomNo': $('#txtRoomNo').text(),
                'BedNo': $('#txtBedNo').text(),
                'ServingDate': $('#txtScheduleDate').val(),
                'DietCategory': $(this).find('td:eq(6)').text(),
                'DietId': $(this).find('td:eq(7)').text(),
                'ItemId': $(this).find('td:eq(0)').text(),
                'qty': $(this).find('td:eq(2)').text(),
                'medicalProcedure': $('#txtMedicalProcedure').text(),
                'Remark': $('#txtRemark').val(),
                'login_id': Active.userId,
                'Logic': 'InsertDietSchedule'
            });
        });
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    var html = "";
                    var Diet = data.split('|')[1];
                    var DietCategory = Diet.split(',');
                    //alert(data.split('|')[0]);
                    GetScheduledDietInfo($('#txtIPDNo').text());
                    ClearDiet();
                    //GetPatientDetails();
                    if (DietCategory.length > 0) {
                        for (var i = 0; i < DietCategory.length; i++)
                            html += "<span class='dietScheduled'><i class='fa fa-check-circle'>&nbsp;</i>" + DietCategory[i] + "</span>";
                    }
                    $('#IPDPatientList .selected').find('table tbody tr').each(function () {
                        $(this).find('#dietscheduled').html(html);
                        $('#IPDPatientList .selected').addClass('bgLightGreen');
                    });
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
function ValidationDietSchedule() {
    var IPDNo = $('#txtIPDNo').text();
    var ScheduleDate = $('#txtScheduleDate').val();
    var tblLength = $('#tblDietItemDetail tbody tr').length;

    if (IPDNo == '') {
        alert('IPD No. Not Found.');
        $('#txtIPDNo').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtIPDNo').removeAttr('style');
    }
    if (parseInt(tblLength) == 0) {
        alert('Diet Items Not Found.');
        return false;
    }
    if (ScheduleDate == '') {
        alert('Please Provide ScheduleDate.');
        $('#txtScheduleDate').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtScheduleDate').removeAttr('style');
    }
    return true;
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
    $('#txtPreExistingDisease').text('');
    $('#txtDietRecommended').html('');
    $('#txtDoctorId').text('');
    $('#txtDoctorName').text('');
    $('#txtFloorName').text('');
    $('#txtContactNo').text('');
    $('#txtRoomType').text('');
    $('#txtRoomNo').text('');
    $('#txtBedNo').text('');
    $('#txtMedicalProcedure').text('');
    $('#tblDietItemDetail tbody').empty();
}
function ClearDiet() {
    $('#txtMedicalProcedure').text('');
    $('#tblDietItemDetail tbody').empty();
}