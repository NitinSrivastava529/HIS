var _index;
var _elem;
var _selectedPackageId;
var _selectedPackageAutoId;
$(document).ready(function () {
    _section = 'Billing';
    $('#dash-dynamic-section').find('label.title').text('Patient Billing Info').show();
    $('#txtFrom').attr('value', _AdmitDate.split('T')[0]);
    FillCurrentDate('txtTo')
    $('select').select2();
    SummarisedBilling();
    GetComSeenCount();
    $('#tblBillingInfo thead').on('change', 'input', function () {
        var val = parseFloat($(this).val()) || 0;
        $(this).parents('table').find('tbody').find('input').val(val);
        CalculateDiscount();
    }).on('keyup', 'input', function () {
        var val = parseFloat($(this).val()) || 0;
        $(this).parents('table').find('tbody').find('input').val(val);
        CalculateDiscount();
    });
    $('#tblItemsInfo thead').on('change', 'input[type=number]', function () {
        var val = parseFloat($(this).val()) || 0;
        CalculateItem(val, $(this).closest('th').index() + 1, 'header');
    }).on('keyup', 'input[type=number]', function () {
        var val = parseFloat($(this).val()) || 0;
        CalculateItem(val, $(this).closest('th').index() + 1, 'header');
    });
    $('#tblItemsInfo tbody').on('change', 'input[type=number]', function () {
        var val = parseFloat($(this).val()) || 0;
        CalculateItem(val, $(this), 'row');
    }).on('keyup', 'input[type=number]', function () {
        var val = parseFloat($(this).val()) || 0;
        CalculateItem(val, $(this), 'row');
        });
    $('#tblItemsInfo tbody').on('mouseover', '.entryBy', function () {
        var entryBy ='<b>Entry By : </b>'+$(this).data('entryby');
        $(this).siblings('span').html(entryBy).show('fast');
    }).on('mouseleave', '.entryBy', function () {        
        $(this).siblings('span').empty().hide('fast');
    });
    $('#tblItemsInfo tbody').on('click', 'button[id=btnItemRemark]', function () {
        _elem = $(this);
        var remark = $(this).data('remark');
        $('#txtItemRemark').val(remark);
        $('#modalRemark').modal('show');
    });
    $('#tblItemsInfo tbody').on('click', 'a.IsPackage', function () {
        _selectedPackageAutoId = $(this).closest('tr').find('td:eq(0)').text();
        _selectedPackageId = $(this).data('itemid');
        _selectedPackageName = $(this).text();
        $('#txtPackageName').text(_selectedPackageName);
        NonPackagedPackagedItem(_selectedPackageId);
    });
    $('#tblItemsInfo tbody').on('click', 'button[id=btnCancelItem]', function () {
        _elem = $(this);
        $('#modalCancelItem').modal('show');
    });
    $('#tblItemsInfo thead').on('change', 'input[type=checkbox]', function () {
        var IsChk = $(this).is(':checked');
        if ($(this).closest('th').index() == 0) {
            if (IsChk)
                $(this).parents('table').find('tbody td:nth-child(' + ($(this).closest('th').index() + 2) + ')').find('input[type=checkbox]').prop('checked', true);
            else
                $(this).parents('table').find('tbody td:nth-child(' + ($(this).closest('th').index() + 2) + ')').find('input[type=checkbox]').prop('checked', false);
        }
        if (IsChk)
            $(this).parents('table').find('tbody td:nth-child(' + ($(this).closest('th').index() + 2) + ')').find('input[type=number]').removeAttr('readonly');
        else
            $(this).parents('table').find('tbody td:nth-child(' + ($(this).closest('th').index() + 2) + ')').find('input[type=number]').attr('readonly', '');
    })
    searchTable('txtSearchItem', 'tblItemsInfo');
    GetDoctor();
    $('#modalPackage thead').on('change', 'input[type=checkbox]', function () {
        var IsChk = $(this).is(':checked');
        if (IsChk)
            $(this).parents('table').find('tbody').find('input[type=checkbox]').prop('checked', true);
        else
            $(this).parents('table').find('tbody').find('input[type=checkbox]').prop('checked', false);
    });
    $('#modalPackage tbody').on('change', 'input[type=checkbox]', function () {
        var IsChk = $(this).is(':checked');
        if (IsChk)
            $(this).closest('tr.group').nextUntil('.group').find('td:eq(1)').find('input[type=checkbox]').prop('checked', true);
        else
            $(this).closest('tr.group').nextUntil('.group').find('td:eq(1)').find('input[type=checkbox]').prop('checked', false);

    });
});
function GetDoctor() {
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = '';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '';
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
            $('#ddlDoctor').empty().append($("<option data-id='Select'></option>").val('Select').html('Select')).select2();
            $.each(data.ResultSet.Table, function (key, val) {
                $("#ddlDoctor").append($("<option></option>").val(val.DoctorId).html(val.DoctorName));
            });
        },
        complete: function () {
            $('#ddlDoctor option').each(function () {
                if ($(this).val() == _doctorId) {
                    $('#ddlDoctor').prop('selectedIndex', '' + $(this).index() + '').change()
                }
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CalculateDiscount(elem) {
    RestrictMaxVal($(elem));
    var totalAdlDiscount = 0;
    $('#tblBillingInfo tbody tr').each(function () {
        var grossAmt = parseFloat($(this).find('td').eq(4).text());
        var panelDiscount = parseFloat($(this).find('td').eq(5).text());
        var adlPerc = parseFloat($(this).find('td').eq(6).find('input').val());
        var adlDiscount = (grossAmt - panelDiscount) * adlPerc / 100;
        $(this).find('td').eq(7).text(adlDiscount.toFixed(0));
        var netAmount = grossAmt - (panelDiscount + adlDiscount);
        $(this).find('td').eq(8).text(netAmount.toFixed(0));
        totalAdlDiscount += adlDiscount;
    });
    $('#txtAdlDiscount').val(totalAdlDiscount.toFixed(0));
    var totalDiscount = parseFloat($('#txtPDiscount').val()) + totalAdlDiscount;
    var netAmount = parseFloat($('#txtGrossAmt').val()) - totalDiscount;
    var netAmount = parseFloat($('#txtGrossAmt').val()) - totalDiscount;
    var balanceAmount = netAmount - parseFloat($('#txtAdvanceAmt').val());
    $('#txtDiscount').val(totalDiscount.toFixed(0));
    $('#txtNetAmt').val(netAmount.toFixed(0));
    $('#txtBalanceAmt').val(balanceAmount.toFixed(0));
}
function CalculateItem(val, elem, logic) {
    var _qty = 0; var _Rate = 0; var _panelDisPerc = 0; var _panelDis = 0; var _adlDisPerc = 0; var _adlDis = 0; var _netAmount = 0;
    if (logic == 'header') {
        $('#tblItemsInfo tbody tr').each(function () {
            if ($(this).find('td:eq(1)').find('input[type=checkbox]').is(':checked')) {
                $(this).find('td').eq(elem).find('input[type=number]').val(val);

                if (elem == 4) {
                    $(this).find('td').eq(elem + 1).find('input[type=number]').val(0);
                    $(this).find('td').eq(elem + 2).find('input[type=number]').val(0);
                    $(this).find('td').eq(elem + 3).find('input[type=number]').val(0);
                    $(this).find('td').eq(elem + 4).find('input[type=number]').val(0);
                }
                _qty = parseFloat($(this).find('td').eq(3).find('input[type=number]').val());
                _Rate = parseFloat($(this).find('td').eq(4).find('input[type=number]').val());
                _panelDisPerc = parseFloat($(this).find('td').eq(5).find('input[type=number]').val());
                _panelDis = parseFloat($(this).find('td').eq(6).find('input[type=number]').val());
                _adlDisPerc = parseFloat($(this).find('td').eq(7).find('input[type=number]').val());
                _adlDis = parseFloat($(this).find('td').eq(8).find('input[type=number]').val());
                _netAmount = parseFloat($(this).find('td').eq(9).find('input[type=number]').val());

                if (elem == 5) {
                    var panelDis = (_qty * _Rate) * _panelDisPerc / 100;
                    $(this).find('td').eq(6).find('input[type=number]').val(panelDis);
                }
                if (elem == 7) {
                    var adlDiscount = ((_qty * _Rate) - _panelDis) * _adlDisPerc / 100;
                    $(this).find('td').eq(8).find('input[type=number]').val(adlDiscount);
                }
                _panelDis = parseFloat($(this).find('td').eq(6).find('input').val());
                _adlDis = parseFloat($(this).find('td').eq(8).find('input').val());
                var netamount = (_qty * _Rate) - (_panelDis + _adlDis);
                $(this).find('td').eq(9).find('input[type=number]').val(netamount.toFixed(2));

                if ((_qty * _Rate) < (_panelDis + _adlDis)) {
                    $(this).addClass('bg-danger');
                    $(this).find('td:eq(1)').find('input[type=checkbox]').prop('checked', false);
                    $(this).find('td:eq(1)').find('input[type=checkbox]').prop('disabled', true);
                }
                else {
                    {
                        $(this).removeClass('bg-danger');
                        $(this).find('td:eq(1)').find('input[type=checkbox]').prop('checked', true);
                        $(this).find('td:eq(1)').find('input[type=checkbox]').prop('disabled', false);
                    }
                }
            }
        });
    }
    if (logic == 'row') {

        $('#tblItemsInfo tbody tr:eq(' + $(elem).closest('tr').index() + ')').each(function () {
            $(this).find('td').eq($(elem).closest('td').index()).find('input[type=number]').val(val);
            debugger
            if ($(elem).closest('td').index() == 4) {
                $(this).find('td').eq(5).find('input[type=number]').val(0);
                $(this).find('td').eq(6).find('input[type=number]').val(0);
                $(this).find('td').eq(7).find('input[type=number]').val(0);
                $(this).find('td').eq(8).find('input[type=number]').val(0);
            }
            _qty = parseFloat($(this).find('td').eq(3).find('input[type=number]').val());
            _Rate = parseFloat($(this).find('td').eq(4).find('input[type=number]').val());
            _panelDisPerc = parseFloat($(this).find('td').eq(5).find('input[type=number]').val());
            _panelDis = parseFloat($(this).find('td').eq(6).find('input[type=number]').val());
            _adlDisPerc = parseFloat($(this).find('td').eq(7).find('input[type=number]').val());
            _adlDis = parseFloat($(this).find('td').eq(8).find('input[type=number]').val());
            _netAmount = parseFloat($(this).find('td').eq(9).find('input[type=number]').val());
            if ($(elem).closest('td').index() == 5) {
                var panelDis = (_qty * _Rate) * _panelDisPerc / 100;
                $(this).find('td').eq(6).find('input[type=number]').val(panelDis.toFixed(2));
            }
            if ($(elem).closest('td').index() == 7) {
                var adlDiscount = ((_qty * _Rate) - _panelDis) * _adlDisPerc / 100;
                $(this).find('td').eq(8).find('input[type=number]').val(adlDiscount.toFixed(2));
            }
            _panelDis = parseFloat($(this).find('td').eq(6).find('input').val());
            _adlDis = parseFloat($(this).find('td').eq(8).find('input').val());
            var netamount = (_qty * _Rate) - (_panelDis + _adlDis);

            $(this).find('td').eq(9).find('input[type=number]').val(netamount.toFixed(2));

            if ((_qty * _Rate) < (_panelDis + _adlDis)) {
                $(elem).closest('tr').addClass('bg-danger');
                $('#tblItemsInfo tbody tr:eq(' + $(elem).closest('tr').index() + ')').find('td:eq(1)').find('input[type=checkbox]').prop('checked', false);
                $('#tblItemsInfo tbody tr:eq(' + $(elem).closest('tr').index() + ')').find('td:eq(1)').find('input[type=checkbox]').prop('disabled', true);
            }
            else {
                {
                    $(elem).closest('tr').removeClass('bg-danger');
                    $('#tblItemsInfo tbody tr:eq(' + $(elem).closest('tr').index() + ')').find('td:eq(1)').find('input[type=checkbox]').prop('checked', true);
                    $('#tblItemsInfo tbody tr:eq(' + $(elem).closest('tr').index() + ')').find('td:eq(1)').find('input[type=checkbox]').prop('disabled', false);
                }
            }
        });
    }
}
function GetComSeenCount() {
    $('#btnRemarkLog .count').empty();
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
    objBO.Prm1 = _section;
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetComSeenCount';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {                    
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (eval(val.pendingSeenCount) == 0) {
                            $('#btnRemarkLog .count').text(val.pendingSeenCount);
                            $('#btnRemarkLog .count').removeClass('blinkAnim');
                        }
                        else {
                            $('#btnRemarkLog .count').text(val.pendingSeenCount);
                            $('#btnRemarkLog .count').addClass('blinkAnim');
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
function SummarisedBilling() {
    $('#tblBillingInfo tbody').empty();
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingQuerries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = query()['IPDNo'];
    objBO.DoctorId = '';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = _section;
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'SummarisedBilling';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtGrossAmt').val(val.GrossAmount.toFixed(2));
                        $('#txtPDiscount').val(val.panel_discount.toFixed(2));
                        $('#txtAdlDiscount').val(val.adl_discount.toFixed(2));
                        $('#txtDiscount').val(val.Discount.toFixed(2));
                        $('#txtNetAmt').val(val.NetAmount.toFixed(2));
                        $('#txtAdvanceAmt').val(val.AdvanceAmount.toFixed(2));
                        $('#txtBalanceAmt').val(val.BalanceAmount.toFixed(2));
                        $('#txtApprovalAmt').val(val.ApprovalAmount.toFixed(2));
                    });
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbody = '';
                    var count = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td style='display:none'>" + val.CatID + "</td>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.CatName + "</td>";
                        tbody += "<td class='text-right'>" + val.ItemCount + "</td>";
                        tbody += "<td class='text-right'>" + val.GrossAmount.toFixed(2) + "</td>";
                        tbody += "<td class='text-right'>" + val.panel_discount.toFixed(2) + "</td>";
                        tbody += "<td style='padding: 0 6px;display: flex;'>";
                        tbody += "<input type='number' min='0' onchange=RestrictMaxVal(this) onkeyup=CalculateDiscount(this) class='form-control txtAdlDis' value=" + val.adlDisPer + " placeholder='%'/>";
                        tbody += "<button onclick=Calculation() class='btn btn-primary btn-xs btnAdlDis'>Calculate</button>";
                        tbody += "</td>";
                        tbody += "<td class='text-right'>" + val.adl_discount.toFixed(2) + "</td>";
                        tbody += "<td class='text-right'>" + val.NetAmount.toFixed(2) + "</td>";
                        tbody += "<td><button onclick=selectRow(this);ItemsInfo('" + val.CatID + "') style='height: 15px;line-height:0;' class='btn btn-warning btn-xs'><i class='fa fa-eye'>&nbsp;</i>View</button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblBillingInfo tbody').append(tbody);
                }
            }    
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ItemsInfo(cateId) {
    $('#tblItemsInfo tbody').empty();
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
    objBO.Prm1 = cateId;
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'ItemsInfoByCategory';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = '';
                    var count = 0;
                    var temp = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        if (temp != val.tnxDate) {
                            tbody += "<tr style='background:#ddd'>";
                            tbody += "<td colspan='11'><b>" + val.tnxDate + "</b></td>";
                            tbody += "</tr>";
                            temp = val.tnxDate;
                        }
                        tbody += "<tr>";
                        tbody += "<td style='display:none'>" + val.auto_id + "</td>";
                        tbody += "<td><input type='checkbox'/>";
                        if (val.IsIpdPackage == 'Y')
                            tbody += "<td><a data-itemid=" + val.ItemId + " href='#' class='IsPackage'>" + val.ItemName + "</a></td>";
                        else
                            tbody += "<td>" + val.ItemName + "<i class='fa fa-user-circle text-warning entryBy pull-right' data-entryby='" + val.EntryBy + "'></i><span class='entryByName'></span></td>";

                        tbody += "<td style='padding: 0 3px;'><input type='number' min='0' readonly='' class='form-control txtAdlDis' value='" + val.Qty + "'/></td>";
                        tbody += "<td style='padding: 0 3px;'><input type='number' min='0' readonly='' class='form-control txtAdlDis' value='" + val.GrossAmount + "'/></td>";
                        tbody += "<td style='padding: 0 3px;display: flex;'>";
                        tbody += "<input type='number' min='0' readonly='' class='form-control txtAdlDis' value='0' placeholder='%'/>";
                        tbody += "<button class='btn btn-primary btn-xs btnAdlDis'>%</button>";
                        tbody += "</td>";
                        tbody += "<td style='padding: 0 3px;'>";
                        tbody += "<div style='padding: 0 3px;display: flex;'>";
                        tbody += "<input type='number' min='0' class='form-control txtAdlDis' value='" + val.panel_discount + "'/>";
                        tbody += "<button class='btn btn-primary btn-xs btnAdlDis'>Rs</button>";
                        tbody += "</div>";
                        tbody += "</td>";
                        tbody += "<td style='padding: 0 3px;display: flex;'>";
                        tbody += "<input type='number' min='0' readonly='' class='form-control txtAdlDis' value='0' placeholder='%'/>";
                        tbody += "<button class='btn btn-primary btn-xs btnAdlDis'>%</button>";
                        tbody += "</td>";
                        tbody += "<td style='padding: 0 3px;'>";
                        tbody += "<div style='display: flex;'>";
                        tbody += "<input type='number' min='0' class='form-control txtAdlDis' value='" + val.adl_discount + "'/>";
                        tbody += "<button class='btn btn-primary btn-xs btnAdlDis'>Rs</button>";
                        tbody += "</div>";
                        tbody += "</td>";
                        //tbody += "<td><input type='number' min='0' readonly='' class='form-control txtAdlDis' value='" + val.adl_discount + "'/></td>";
                        tbody += "<td><input type='number' min='0' readonly='' class='form-control txtAdlDis' value='" + val.NetAmount + "'/></td>";
                        tbody += "<td>" + val.doctorName + "</td>";
                        tbody += "<td>";
                        tbody += "<div style='display:flex'>";
                        tbody += "<button id='btnCancelItem' class='btn btn-danger btn-xs'><i class='fa fa-trash'>&nbsp;</i></button>";
                        if (val.Remark != null)
                            tbody += "<button data-remark='" + val.Remark + "' id='btnItemRemark' class='btn btn-success btn-xs'><i class='fa fa-comment'>&nbsp;</i></button>";
                        else
                            tbody += "<button data-remark='" + val.Remark + "' id='btnItemRemark' class='btn btn-warning btn-xs'><i class='fa fa-comment'>&nbsp;</i></button>";

                        tbody += "</div>";
                        tbody += "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblItemsInfo tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Calculation() {
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingInsertModifyItems";
    var objBooking = {};
    var objRateList = [];
    $('#tblBillingInfo tbody tr').each(function () {
        objRateList.push({
            'AutoId': 0,
            'TnxId': '-',
            'RateListId': '-',
            'CatId': $(this).find('td:eq(0)').text(),
            'ItemId': '-',
            'RateListName': '-',
            'ItemSection': $(this).find('td:eq(2)').text(),
            'IsPackage': '-',
            'IsRateEditable': 'N',
            'IsPatientPayable': 'N',
            'IsDiscountable': 'N',
            'panel_discount': 0,
            'panel_rate': 0,
            'qty': 0,
            'mrp_rate': 0,
            'adl_disc_perc': $(this).find('td:eq(6)').find('input').val(),
            'adl_disc_amount': 0,
            'net_amount': 0,
            'IsUrgent': '-',
            'Remark': '-'
        });
    });
    objBooking.hosp_id = Active.HospId;
    objBooking.IPDNo = _IPDNo;
    objBooking.DoctorId = '-';
    objBooking.ipAddress = '-';
    objBooking.login_id = Active.userId;
    objBooking.Logic = "Adl_Discount:Calculation";
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
            if (data.includes('Success')) {
                SummarisedBilling();
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
function ItemWiseCalculation() {
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingInsertModifyItems";
    var objBooking = {};
    var objRateList = [];
    $('#tblItemsInfo tbody tr:not(.bg-danger)').each(function () {
        if ($(this).find('td:eq(1)').find('input[type=checkbox]').is(':checked')) {
            objRateList.push({
                'AutoId': $(this).find('td:eq(0)').text(),
                'TnxId': '-',
                'RateListId': '-',
                'CatId': '-',
                'ItemId': '-',
                'RateListName': '-',
                'ItemSection': '-',
                'IsPackage': '-',
                'IsRateEditable': 'N',
                'IsPatientPayable': 'N',
                'IsDiscountable': 'N',
                'qty': $(this).find('td:eq(3)').find('input').val(),
                'mrp_rate': 0,
                'panel_rate': $(this).find('td:eq(4)').find('input').val(),
                'panel_discount': $(this).find('td:eq(6)').find('input').val(),
                'adl_disc_perc': $(this).find('td:eq(7)').find('input').val(),
                'adl_disc_amount': $(this).find('td:eq(8)').find('input').val(),
                'net_amount': $(this).find('td:eq(9)').find('input').val(),
                'IsUrgent': '-',
                'Remark': '-'
            });
        }
    });
    objBooking.hosp_id = Active.HospId;
    objBooking.IPDNo = _IPDNo;
    objBooking.DoctorId = '-';
    objBooking.ipAddress = '-';
    objBooking.login_id = Active.userId;
    objBooking.Logic = "Itemwise:Re-Calculation";
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
            if (data.includes('Success')) {
                ItemsInfo($('#tblBillingInfo tbody tr.select-row').find('td:eq(0)').text());
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
function DoctorShift() {
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingInsertModifyItems";
    var objBooking = {};
    var objRateList = [];
    $('#tblItemsInfo tbody tr').each(function () {
        if ($(this).find('td:eq(1)').find('input[type=checkbox]').is(':checked')) {
            objRateList.push({
                'AutoId': $(this).find('td:eq(0)').text(),
                'TnxId': '-',
                'RateListId': '-',
                'CatId': '-',
                'ItemId': $('#ddlDoctor option:selected').val(),
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
                'adl_disc_perc': 0,
                'adl_disc_amount': 0,
                'net_amount': 0,
                'IsUrgent': '-',
                'Remark': '-'
            });
        }
    });
    objBooking.hosp_id = Active.HospId;
    objBooking.IPDNo = _IPDNo;
    objBooking.DoctorId = '-';
    objBooking.ipAddress = '-';
    objBooking.login_id = Active.userId;
    objBooking.Logic = "Shift:Doctor";
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
            if (data.includes('Success')) {
                alert(data);
                $('#tblItemsInfo tbody').find('input[type=checkbox]').prop('checked', false);
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
function CancelItem() {
    if ($('#txtCancelRemark').val() == '') {
        alert('Please Provide Remark.');
        return
    }
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingInsertModifyItems";
    var objBooking = {};
    var objRateList = [];
    objRateList.push({
        'AutoId': $(_elem).closest('tr').find('td:eq(0)').text(),
        'TnxId': '-',
        'RateListId': '-',
        'CatId': '-',
        'ItemId': '-',
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
        'adl_disc_perc': 0,
        'adl_disc_amount': 0,
        'net_amount': 0,
        'IsUrgent': '-',
        'Remark': $('#txtCancelRemark').val()
    });
    objBooking.hosp_id = Active.HospId;
    objBooking.IPDNo = _IPDNo;
    objBooking.DoctorId = '-';
    objBooking.ipAddress = '-';
    objBooking.login_id = Active.userId;
    objBooking.Logic = "Cancel:Items";
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
            if (data.includes('Success')) {
                $(_elem).closest('tr').remove();
                $('#modalCancelItem').modal('hide');
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
function SubmitRemark() {
    if ($('#txtItemRemark').val() == '') {
        alert('Please Provide Remark.');
        return
    }
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingInsertModifyItems";
    var objBooking = {};
    var objRateList = [];
    objRateList.push({
        'AutoId': $(_elem).closest('tr').find('td:eq(0)').text(),
        'TnxId': '-',
        'RateListId': '-',
        'CatId': '-',
        'ItemId': '-',
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
        'adl_disc_perc': 0,
        'adl_disc_amount': 0,
        'net_amount': 0,
        'IsUrgent': '-',
        'Remark': $('#txtItemRemark').val()
    });
    objBooking.hosp_id = Active.HospId;
    objBooking.IPDNo = _IPDNo;
    objBooking.DoctorId = '-';
    objBooking.ipAddress = '-';
    objBooking.login_id = Active.userId;
    objBooking.Logic = "SubmitRemark";
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
            if (data.includes('Success')) {
                $('#modalRemark').modal('hide');
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
function RestrictMaxVal(elem) {
    if (parseFloat($(elem).val()) > 100) {
        $(elem).css('border-color', 'red');
        $(elem).val(0);
    }
    else
        $(elem).removeAttr('style');
}
function FullPageHeight() {
    $('.catDiv').slideToggle('slow');
    $('.itemDiv #ProductList').toggleClass('height430', 'height235');
}
function NonPackagedPackagedItem(ItemId) {
    $('#tblNonPackaged tbody').empty();
    $('#tblPackaged tbody').empty();
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingQuerries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = query()['IPDNo'];
    objBO.DoctorId = '';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = ItemId;
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'NonPackaged_PackagedItem';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = '';
                    var count = 0;
                    var temp = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        if (temp != val.CatName) {
                            tbody += "<tr style='background:#ddd' class='group'>";
                            tbody += "<td colspan='5'><div class='flex'><input type='checkbox'/><b>" + val.CatName + "</b></div></td>";
                            tbody += "</tr>";
                            temp = val.CatName;
                        }
                        tbody += "<tr>";
                        tbody += "<td style='display:none'>" + val.auto_id + "</td>";
                        tbody += "<td><input type='checkbox'/></td>";
                        tbody += "<td>" + val.tnxDate + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td class='text-right'>" + val.Qty + "</td>";
                        tbody += "<td class='text-right'>" + val.amount.toFixed(2) + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblNonPackaged tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbody1 = '';
                    var count = 0;
                    var temp1 = "";
                    $.each(data.ResultSet.Table1, function (key, val) {
                        count++;
                        if (temp1 != val.CatName) {
                            tbody1 += "<tr style='background:#ddd' class='group'>";
                            tbody1 += "<td colspan='5'><div class='flex'><input type='checkbox'/><b>" + val.CatName + "</b></div></td>";
                            tbody1 += "</tr>";
                            temp1 = val.CatName;
                        }
                        tbody1 += "<tr>";
                        tbody1 += "<td style='display:none'>" + val.auto_id + "</td>";
                        tbody1 += "<td><input type='checkbox'/></td>";
                        tbody1 += "<td>" + val.tnxDate + "</td>";
                        tbody1 += "<td>" + val.ItemName + "</td>";
                        tbody1 += "<td class='text-right'>" + val.Qty + "</td>";
                        tbody1 += "<td class='text-right'>" + val.amount.toFixed(2) + "</td>";
                        tbody1 += "</tr>";
                    });
                    $('#tblPackaged tbody').append(tbody1);
                }
                $('#modalPackage').modal('show');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function MoveItemToPackage() {
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingInsertModifyItems";
    var objBooking = {};
    var objRateList = [];
    $('#tblNonPackaged tbody tr').each(function () {
        if ($(this).find('td:eq(1)').find('input[type=checkbox]').is(':checked')) {
            objRateList.push({
                'AutoId': $(this).find('td:eq(0)').text(),
                'TnxId': '-',
                'RateListId': '-',
                'CatId': '-',
                'ItemId': _selectedPackageId,
                'RateListName': '-',
                'ItemSection': '-',
                'IsPackage': 0,
                'IsRateEditable': 'N',
                'IsPatientPayable': 'N',
                'IsDiscountable': 'N',
                'qty': 0,
                'mrp_rate': 0,
                'panel_rate': 0,
                'panel_discount': 0,
                'adl_disc_perc': 0,
                'adl_disc_amount': 0,
                'net_amount': 0,
                'IsUrgent': '-',
                'Remark': '-'
            });
        }
    });
    objRateList.push({
        'AutoId': _selectedPackageAutoId,
        'TnxId': '-',
        'RateListId': '-',
        'CatId': '-',
        'ItemId': _selectedPackageId,
        'RateListName': '-',
        'ItemSection': '-',
        'IsPackage': 1,
        'IsRateEditable': 'N',
        'IsPatientPayable': 'N',
        'IsDiscountable': 'N',
        'qty': 0,
        'mrp_rate': 0,
        'panel_rate': 0,
        'panel_discount': 0,
        'adl_disc_perc': 0,
        'adl_disc_amount': 0,
        'net_amount': 0,
        'IsUrgent': '-',
        'Remark': '-'
    });
    objBooking.hosp_id = Active.HospId;
    objBooking.IPDNo = _IPDNo;
    objBooking.DoctorId = '-';
    objBooking.ipAddress = '-';
    objBooking.login_id = Active.userId;
    objBooking.Logic = "MoveItemToPackage";
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
            if (data.includes('Success')) {
                NonPackagedPackagedItem(_selectedPackageId);
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
function RemoveItemFromPackage() {
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingInsertModifyItems";
    var objBooking = {};
    var objRateList = [];
    $('#tblPackaged tbody tr').each(function () {
        if ($(this).find('td:eq(1)').find('input[type=checkbox]').is(':checked')) {
            objRateList.push({
                'AutoId': $(this).find('td:eq(0)').text(),
                'TnxId': '-',
                'RateListId': '-',
                'CatId': '-',
                'ItemId': '-',
                'RateListName': '-',
                'ItemSection': '-',
                'IsPackage': 0,
                'IsRateEditable': 'N',
                'IsPatientPayable': 'N',
                'IsDiscountable': 'N',
                'qty': 0,
                'mrp_rate': 0,
                'panel_rate': 0,
                'panel_discount': 0,
                'adl_disc_perc': 0,
                'adl_disc_amount': 0,
                'net_amount': 0,
                'IsUrgent': '-',
                'Remark': '-'
            });
        }
    });
    objRateList.push({
        'AutoId': _selectedPackageAutoId,
        'TnxId': '-',
        'RateListId': '-',
        'CatId': '-',
        'ItemId': _selectedPackageId,
        'RateListName': '-',
        'ItemSection': '-',
        'IsPackage': 1,
        'IsRateEditable': 'N',
        'IsPatientPayable': 'N',
        'IsDiscountable': 'N',
        'qty': 0,
        'mrp_rate': 0,
        'panel_rate': 0,
        'panel_discount': 0,
        'adl_disc_perc': 0,
        'adl_disc_amount': 0,
        'net_amount': 0,
        'IsUrgent': '-',
        'Remark': '-'
    });
    objBooking.hosp_id = Active.HospId;
    objBooking.IPDNo = _IPDNo;
    objBooking.DoctorId = '-';
    objBooking.ipAddress = '-';
    objBooking.login_id = Active.userId;
    objBooking.Logic = "RemoveItemFromPackage";
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
            if (data.includes('Success')) {
                NonPackagedPackagedItem(_selectedPackageId);
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