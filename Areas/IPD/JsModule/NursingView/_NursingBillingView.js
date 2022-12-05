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
 
    $('#tblItemsInfo tbody').on('mouseover', '.entryBy', function () {
        var entryBy ='<b>Entry By : </b>'+$(this).data('entryby');
        $(this).siblings('span').html(entryBy).show('fast');
    }).on('mouseleave', '.entryBy', function () {        
        $(this).siblings('span').empty().hide('fast');
    });
    searchTable('txtSearchItem', 'tblItemsInfo');
 });
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
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td style='padding: 0 3px;'><input type='number' min='0' readonly='' class='form-control txtAdlDis' value='" + val.Qty + "'/></td>";
                         tbody += "<td>" + val.doctorName + "</td>";
                        tbody += "<td>";
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
