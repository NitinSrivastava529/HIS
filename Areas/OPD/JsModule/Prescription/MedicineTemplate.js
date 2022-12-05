$(document).ready(function () {
    FreqAndIntake();
    $(document).find('.MedicineTemplate tbody').on('click', 'td', function () {
        var index = $(this).closest('tr').index();
        $(document).find('.MedicineTemplate tbody').find('tr:eq(' + index + ')').remove();
    });
    $('#TemplateMasterRight').on('keydown', '#txtRemark', function (e) {
        var keyCode = e.keyCode;
        switch (keyCode) {
            case (keyCode = 13):
                AddMedicineTemplatge();
                break;
            default:
                break;
        }        
    });
    $('#txtSearchProduct').keydown(function (e) {
        var tbody = $('#tblnavigate').find('tbody');
        var selected = tbody.find('.selected');
        var KeyCode = e.keyCode;
        switch (KeyCode) {
            case (KeyCode = 40):
                tbody.find('.selected').removeClass('selected');
                if (selected.next().length == 0) {
                    tbody.find('tr:first').addClass('selected');
                }
                else {
                    tbody.find('.selected').removeClass('selected');
                    selected.next().addClass('selected');
                }
                break;
            case (KeyCode = 38):
                tbody.find('.selected').removeClass('selected');
                if (selected.prev().length == 0) {
                    tbody.find('tr:last').addClass('selected');
                }
                else {
                    selected.prev().addClass('selected');
                }
                break;
            case (KeyCode = 13):
                var itemName = $('#tblnavigate').find('tbody').find('.selected').text().split('#')[0];
                var itemid = $('#tblnavigate').find('tbody').find('.selected').data('itemid');
                var IsCash = $('#tblnavigate').find('tbody').find('.selected').data('iscash');
                var msg = $('#tblnavigate').find('tbody').find('.selected').data('alertmsg');
                if (msg != '-') {
                    $('.msg').html('<p>' + msg + '</p><span>X</span>').show();
                }
                $('#txtFreqMaster').focus();
                $('#txtSearchProduct').val(itemName).blur();
                $('#txtItemID').val(itemid);
                $('#txtIsCash').val(IsCash);
                $('#ItemList').hide();
                break;
            default:
                var val = $('#txtSearchProduct').val();
                if (val == '') {
                    $('#ItemList').hide();
                }
                else {
                    $('#ItemList').show();
                    var key = $(this).val();
                    var type = $('#ddlSearchType option:selected').val();
                    if (ValidateSearch()) {
                        SearchMedicine(key, type);
                    };
                }
                break;
        }
    });
    $('#tblnavigate tbody').on('click', 'tr', function () {
        var itemName = $(this).text().split('#')[0];
        var itemid = $(this).data('itemid');
        var msg = $(this).data('alertmsg');
        var IsCash = $(this).data('iscash');
        if (msg != '-') {
            $('.msg').html('<p>' + msg + '</p><span>X</span>').show();
        }
        $('#txtSearchProduct').val(itemName).blur();
        $('#txtItemID').val(itemid);
        $('#txtIsCash').val(IsCash);
        $('#ItemList').hide();
    });
    $('.msg').on('click', 'span', function () {
        $('.msg').html('').hide();
    });

    $('#btnMediTemp').on('click', function () {
        $('#btnSaveMediTempInfo').hide();
        $('#btnPresMediItem').show();
        $('#TemplateMasterLeft').hide();
        $('#MedicineTemplate').show();
        $('#MedicineTemplateForDB').hide();
        $('#TemplateMasterRight').switchClass('col-md-8', 'col-md-12');
        $('#modalPresMediTemplate').modal('show');
    })
    $('#btnCPOEMediTemp').on('click', function () {
        $('#btnSaveMediTempInfo').show();
        $('#btnPresMediItem').hide();
        $('#TemplateMasterLeft').show();
        $('#MedicineTemplate').hide();
        $('#MedicineTemplateForDB').show();
        $('#TemplateMasterRight').switchClass('col-md-12', 'col-md-8');
        $('#modalPresMediTemplate').modal('show');
    });

});

function NextFocus(elem) {
    $(document).on('keydown', 'input, select', function (e) {        
        var keyCode = e.keyCode;
        switch (keyCode) {
            case (keyCode = 13):
                $(this).blur();
                $('#' + elem).focus().select();
                break;
            default:
                break;
        }
    });
}

function SearchMedicine(key, type) {
    disableLoading();
    var url = config.baseUrl + "/api/IPDNursing/SearchMedicine";
    var objBO = {};
    objBO.searchKey = key;
    objBO.searchType = type;
    objBO.PanelId = $('span[data-panelid]').text();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblnavigate tbody').empty();
            if (data != '') {

                $.each(data.ResultSet.Table, function (key, val) {
                    $('#tblnavigate').show();
                    $('<tr class="searchitems" data-AlertMsg="' + val.AlertMsg + '" data-itemid=' + val.item_id + ' data-iscash=' + val.IsCash + '><td>' + val.item_name + "</td></tr>").appendTo($('#tblnavigate tbody'));
                });
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            loading();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function FreqAndIntake() {
    var url = config.baseUrl + "/api/Prescription/CPOE_PrescriptionAdviceQueries";
    var objBO = {};
    objBO.Logic = 'FreqAndIntake';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#ddlFreMaster').empty().append($('<option></option>').val(00).html('Select'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlFreMaster').append($('<option></option>').val(val.qty).html(val.Descriptions)).select2();
            });
            $('#ddlIntake').empty().append($('<option></option>').val(00).html('Select'));
            $.each(data.ResultSet.Table1, function (key, val) {
                $('#ddlIntake').append($('<option></option>').val(val.instruction).html(val.instruction)).select2();
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AddMedicineTemplatge() {
    var itemid = $('#txtItemID').val();
    var itemName = $('#txtSearchProduct').val();
    var dose = $('#txtFreqMaster').val();
    var duration = $('#txtDuration').val();
    var days = $('#txtDays option:selected').text();
    var qty = $('#txtQty').val();
    var whenTake = $('#txtIntake').val();
    var route = $('#txtRoute').val();
    var remark = $('#txtRemark').val();
    var len = parseInt($('.MedicineTemplate tbody tr').length);
    var tbody = "";
    tbody += "<tr data-itemid=" + itemid + ">";
    tbody += "<td>" + itemName + "</td>";
    tbody += "<td>" + dose + "</td>";
    tbody += "<td>" + duration + "</td>";
    tbody += "<td>" + duration + " Days</td>";
    tbody += "<td>" + whenTake + "</td>";
    tbody += "<td>" + route + "</td>";
    tbody += "<td>" + qty + "</td>";
    tbody += "<td>" + remark + "</td>";
    tbody += "</tr>";
    if (ValidateProduct()) {
        var ids = $('.MedicineTemplate tbody').find('tr').filter(function () {
            if ($(this).data('itemid') == itemid) return true;
        });
        if (ids.length <= 0) {
            $('.MedicineTemplate tbody').append(tbody);
            $('.OPDPrintPreview #PrescribedMedicine').show();
            $('.modal-body').find('input:text').val('');
            $('.modal-body').find('select').prop('selectedIndex', '0').change();
        }
        else {
            alert('Product Already Selected...! Try Aother One.')
            $('.modal-body').find('input:text').val('');
            $('.modal-body').find('select').prop('selectedIndex', '0').change();
        }
    }
}
function QtyCalculate() {
    var dose = parseInt($('#ddlFreMaster option:selected').val());
    var duration = parseInt($('#txtDuration').val());
    var qty = (dose) * (duration);
    $('#txtQty').val(qty);

}
function ValidateSearch() {
    var searchType = $('#ddlSearchType option:selected').text();

    if (searchType == 'Choose Type') {
        $('#ddlSearchType').css({ 'border-color': 'red' });
        alert('Please Select Search Type..');
        $('#txtSearchProduct').val('');
        return false;
    }
    else {
        $('#ddlSearchType').removeAttr('style').siblings('span').empty();
    }
    return true;
}
function ValidateProduct() {
    var itemid = $('#txtItemID').val();
    var itemName = $('#txtSearchProduct').val();
    var dose = $('#ddlFreMaster option:selected').text();
    var duration = $('#txtDuration').val();
    var days = $('#txtDays option:selected').text();
    var qty = $('#txtQty').val();
    var whenTake = $('#ddlIntake option:selected').text();
    var route = $('#ddlRoute option:selected').text();
    var remark = $('#txtRemark').val();

    if (itemid == '') {
        alert('Please Choose Any Product..!');
        return false;
    }
    if (itemName == '') {
        $('#txtSearchProduct').css('border-color', 'red').focus();
        alert('Please Choose Any Product..!');
        return false;
    }
    else {
        $('#txtSearchProduct').removeAttr('style');
    }
    if (dose == 'Select') {
        alert('Please Choose Dose..!');
        return false;
    }
    if (duration == '') {
        $('#txtDuration').css('border-color', 'red').focus();
        alert('Please Provide Duration..!');
        return false;
    }
    else {
        $('#txtDuration').removeAttr('style');
    }
    if (qty == '') {
        $('#txtQty').css('border-color', 'red').focus();
        alert('Please Provide Quantity..!');
        return false;
    }
    else {
        $('#txtQty').removeAttr('style');
    }
    if (whenTake == 'Select') {
        alert('Please Choose when Take..!');
        return false;
    }
    if (route == 'Select Route') {
        alert('Please Choose Route..!');
        return false;
    }
    return true;
}