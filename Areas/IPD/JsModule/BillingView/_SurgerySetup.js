var _DoctorList = [];
$(document).ready(function () {
    $('#dash-dynamic-section').find('label.title').text('Surgery Setup').show();
    SubCatList();
    $('table thead').on('change', 'input[type=checkbox]', function () {
        var IsChk = $(this).is(':checked');
        if (IsChk)
            $(this).parents('table').find('tbody').find('input[type=checkbox]').prop('checked', true);
        else
            $(this).parents('table').find('tbody').find('input[type=checkbox]').prop('checked', false);
    });
    $('#tblSurguryItemCalculation tbody').on('change', 'select', function (e) {
        var val = $(this).find('option:selected').val();
        var count = 0;
        $('#tblSurguryItemCalculation tbody tr').each(function () {
            if ($(this).find('td:eq(3)').find('select option:selected').val() == val) {
                count++;
            }
        });
        if (count > 1) {
            e.preventDefault();
            alert('This Doctor Already Selected');
            $(this).prop('selectedIndex', '0').trigger('change.select2');
        }
    });
    if (_DoctorList.length == 0)
        GetDoctor();
});
function GetDoctor() {
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingQuerries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.DoctorId = '';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'DoctorList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log('doctorList', data)
            _DoctorList = data.ResultSet.Table;
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SubCatList() {
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingQuerries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.DoctorId = '';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'IpdPackage:SubCatList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $('#ddlSubCategory').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlSubCategory').append($('<option></option>').val(val.SubCatID).html(val.SubCatName));
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ItemListBySubCatId() {
    $('#tblSurgeryInfo tbody').empty();
    $('#tblItemInfo tbody').empty();
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingQuerries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.DoctorId = '';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#ddlSubCategory option:selected').val();
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'IpdPackage:ItemListBySubCatId';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    var temp = "";
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td class='hide'>" + val.ItemId + "</td>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td>" + val.SubCatName + "</td>";
                        tbody += "<td class='text-right'>" + val.panel_rate + "</td>";
                        tbody += "<td class='text-right'>" + val.surgeon_rate + "</td>";
                        tbody += "<td><button onclick=SurguryItemCalculation(this) class='btn btn-warning btn-xs'><i class='fa fa-sign-in'>&nbsp;</i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblSurgeryInfo tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbody1 = "";
                    $.each(data.ResultSet.Table1, function (key, val) {
                        tbody1 += "<tr>";
                        tbody1 += "<td class='hide'>" + val.ItemId + "</td>";
                        tbody1 += "<td><input type='checkbox'/></td>";
                        tbody1 += "<td>" + val.ItemName + "</td>";
                        tbody1 += "<td style='padding: 0 3px;'><input type='number' min='0' class='form-control' value='" + val.distr_perc + "'/></td>";
                        tbody1 += "</tr>";
                    });
                    $('#tblItemInfo tbody').append(tbody1);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CalSurgeryAmount(elem) {
    $('#tblSurguryItemCalculation tbody').empty();
    var url = config.baseUrl + "/api/IPDBilling/IPD_CalculateAndInsertSurguryAmount";
    var objBooking = {};
    var objRateList = [];
    $('#tblItemInfo tbody tr').each(function () {
        if ($(this).find('td:eq(1)').find('input[type=checkbox]').is(':checked')) {
            objRateList.push({
                'AutoId': 0,
                'TnxId': '-',
                'RateListId': '-',
                'CatId': '-',
                'ItemId': $(this).find('td:eq(0)').text(),
                'RateListName': '-',
                'ItemSection': '-',
                'IsPackage': '-',
                'IsRateEditable': 'N',
                'IsPatientPayable': 'N',
                'IsDiscountable': 'N',
                'qty': 0,
                'mrp_rate': 0,
                'panel_rate': 0,
                'panel_discount': 0,
                'adl_disc_perc': $(this).find('td:eq(3)').find('input[type=number]').val(),
                'adl_disc_amount': 0,
                'net_amount': 0,
                'IsUrgent': '-',
                'Remark': '-'
            });
        }
    });
    var Surgery_amt = 0;
    var Surgeon_amt = 0;
    var logic = "";
    if ($(elem).siblings('input').attr('id') == 'txtAmount') {
        Surgery_amt = $(elem).siblings('input').val();
        Surgeon_amt = 0;
        logic = "CalculateBy:SurgeryAmount";
    }
    if ($(elem).siblings('input').attr('id') == 'txtSurgeonCharge') {
        Surgery_amt = 0;
        Surgeon_amt = $(elem).siblings('input').val();
        logic = "CalculateBy:SurgeonAmount";
    }
    objBooking.hosp_id = Active.HospId;
    objBooking.DoctorId = _doctorId;
    objBooking.IPDNo = _IPDNo;
    objBooking.ipAddress = '-';
    objBooking.Surgery_amt = Surgery_amt;
    objBooking.Surgeon_amt = Surgeon_amt;
    objBooking.login_id = Active.userId;
    objBooking.Logic = logic;
    var MasterObject = {};
    MasterObject.objBooking = objBooking;
    MasterObject.objRateList = objRateList;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(MasterObject),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        traditional: true,
        success: function (data) {
            var tbody = "";
            var option = "";
            var count = 0;
            var SurgeryCharge = 0;
            var NetAmount = 0;
            $.each(data.ResultSet.Table, function (key, val) {
                SurgeryCharge += val.Charges;
                NetAmount += val.Charges;
                option = "";
                option += "<option value='select'>select</option>";
                count++;
                tbody += "<tr>";
                tbody += "<td class='hide'>" + val.ItemId + "</td>";
                tbody += "<td>" + count + "</td>";
                tbody += "<td>" + val.ItemName + "</td>";
                if (val.IsDoctor == 'Y') {
                    $.each(_DoctorList, function (key, val1) {
                        option += "<option value=" + val1.DoctorId + ">" + val1.DoctorName + "</option>";
                    });
                    tbody += "<td><div class='doctorInfo'><select class='form-control'>" + option + "</select></div></td>";
                }
                else {
                    tbody += "<td><div class='doctorInfo hide'><select class='form-control'><option>-</option></select></td>";
                }
                tbody += "<td style='padding: 0 3px;'><input type='number' disabled min='0' class='form-control' value='" + val.adl_disc_perc.toFixed(2) + "'/></td>";
                tbody += "<td style='padding: 0 3px;'><input onkeyup=CalculateDiscount(this) type='number' min='0' class='form-control' value='" + val.Charges.toFixed(2) + "'/></td>";
                tbody += "<td style='padding: 0 3px;'><input onkeyup=CalculateDiscount(this) type='number' min='0' class='form-control' value='0'/></td>";
                tbody += "<td style='padding: 0 3px;'><input onkeyup=CalculateDiscount(this) type='number' min='0' class='form-control' value='0'/></td>";
                tbody += "<td style='padding: 0 3px;'><input onkeyup=CalculateDiscount(this) type='number' min='0' class='form-control' value='" + val.Charges.toFixed(2) + "'/></td>";
                tbody += "</tr>";
            });
            tbody += "<tr class='total' style='background:#f5e1bd;font-size: 13px;'>";
            tbody += "<td colspan='4'><b>Total</b></td>";
            tbody += "<td class='text-right'><b>" + SurgeryCharge.toFixed(2) + "</b></td>";
            tbody += "<td><b></b></td>";
          tbody += "<td class='text-right'><b>-</b></td>";
            tbody += "<td class='text-right'><b>" + NetAmount.toFixed(2) + "</b></td>";
            tbody += "</tr>";
            $('#tblSurguryItemCalculation tbody').append(tbody);
            $('select').select2();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CalculateDiscount(elem) {
    var _totalCharges = 0;
    var _disAmount = 0;
    var _netAmount = 0;
    $('#tblSurguryItemCalculation tbody tr:not(.total)').each(function () {        
        var charges = parseFloat($(this).find('td').eq(5).find('input').val());
        var disPerc = parseFloat($(this).find('td').eq(6).find('input').val());
        var disAmount = parseFloat($(this).find('td').eq(7).find('input').val());
        var netAmount = parseFloat($(this).find('td').eq(8).find('input').val());
        if ($(elem).closest('td').index() == 6) {
            disAmount = (charges * disPerc) / 100;
            $(this).find('td').eq(7).find('input').val(disAmount.toFixed(2));
        }
        if ($(elem).closest('td').index() == 7) {
            $(this).find('td').eq(6).find('input').val(0);
        }
        netAmount = charges - disAmount;
        $(this).find('td').eq(8).find('input').val(netAmount.toFixed(2));
        _totalCharges += parseFloat($(this).find('td').eq(5).find('input').val());
        _disAmount += parseFloat($(this).find('td').eq(7).find('input').val());
        _netAmount += parseFloat($(this).find('td').eq(8).find('input').val());       
    });
    $(elem).parents('table').find('tbody').find('tr:last').find('td:eq(1)').find('b').text(_totalCharges);
    $(elem).parents('table').find('tbody').find('tr:last').find('td:eq(3)').find('b').text(_disAmount);
    $(elem).parents('table').find('tbody').find('tr:last').find('td:eq(4)').find('b').text(_netAmount);
}
function ItemInsert() {
    if (confirm('Are you sure to Save?')) {
        var count = 0;
        var totalCharges = parseFloat($('#tblSurguryItemCalculation tbody tr:last').find('td:eq(1)').find('b').text());
        var netAmount = parseFloat($('#tblSurguryItemCalculation tbody tr:last').find('td:eq(4)').find('b').text());
        $('#tblSurguryItemCalculation tbody').find('.doctorInfo .select2-selection').removeAttr('style');
        $('#tblSurguryItemCalculation tbody tr:not(.total)').each(function () {
            if ($(this).find('td:eq(3)').find('select option:selected').val() == 'select') {
                count++;
                $(this).find('td:eq(3)').find('.doctorInfo .select2-selection').css('border-color', 'red');
            }
        });
        if (count > 0) { alert('Please Select Doctor.'); return }
        var url = config.baseUrl + "/api/IPDBilling/IPD_CalculateAndInsertSurguryAmount";
        var objBooking = {};
        var objRateList = [];
        $('#tblSurguryItemCalculation tbody tr:not(.total)').each(function () {
            objRateList.push({
                'AutoId': 0,
                'TnxId': _SelectedPackageItem,
                'RateListId': $(this).find('td:eq(3)').find('select option:selected').val(),
                'CatId': 'SurgeryItem',
                'ItemId': $(this).find('td:eq(0)').text(),
                'RateListName': '-',
                'ItemSection': '-',
                'IsPackage': 0,
                'IsRateEditable': 'N',
                'IsPatientPayable': 'N',
                'IsDiscountable': 'N',
                'mrp_rate': $(this).find('td:eq(5)').find('input').val(),
                'panel_rate': $(this).find('td:eq(5)').find('input').val(),
                'panel_discount': 0,
                'qty': 1,
                'adl_disc_perc': 0,
                'adl_disc_amount': $(this).find('td:eq(7)').find('input').val(),
                'net_amount': $(this).find('td:eq(8)').find('input').val(),
                'IsUrgent': 'N',
                'Remark': '-'
            });
        });
        objRateList.push({
            'AutoId': 0,
            'TnxId': _SelectedPackageItem,
            'RateListId': '-',
            'CatId': 'SurgeryPackage',
            'ItemId': _SelectedPackageItem,
            'RateListName': '-',
            'ItemSection': '-',
            'IsPackage': 1,
            'IsRateEditable': 'N',
            'IsPatientPayable': 'N',
            'IsDiscountable': 'N',
            'mrp_rate': totalCharges,
            'panel_rate': totalCharges,
            'panel_discount': 0,
            'qty': 1,
            'adl_disc_perc': 0,
            'adl_disc_amount': totalCharges - netAmount,
            'net_amount': netAmount,
            'IsUrgent': 'N',
            'Remark': '-'
        });
        objBooking.hosp_id = Active.HospId;
        objBooking.DoctorId = _doctorId;
        objBooking.IPDNo = _IPDNo;
        objBooking.ipAddress = '-';
        objBooking.login_id = Active.userId;
        objBooking.Logic = "Insert:SurgeryCharges";
        var MasterObject = {};
        MasterObject.objBooking = objBooking;
        MasterObject.objRateList = objRateList;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(MasterObject),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            traditional: true,
            success: function (data) {
                if (data.Msg.includes('Success')) {
                    alert('Successfully Submited');
                    $('#tblSurguryItemCalculation tbody').empty();
                    $('#ddlSubCategory').prop('selectedIndex', '0').change();
                }
                else {
                    alert(data.Msg);
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }  
}

function SurguryItemCalculation(elem) {
    selectRow($(elem));
    _SelectedPackageItem = $(elem).closest('tr').find('td:eq(0)').text();
    var Amount = $(elem).closest('tr').find('td:eq(4)').text();
    var SurgeonCharge = $(elem).closest('tr').find('td:eq(5)').text();
    $('#txtAmount').val(Amount);
    $('#txtSurgeonCharge').val(SurgeonCharge);
    $('#tblSurguryItemCalculation tbody').empty();
}