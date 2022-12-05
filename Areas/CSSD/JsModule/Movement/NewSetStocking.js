var _set = '';
var _machine = '01';
var _load = '01';
var _date = '';
var _batch = '';
$(document).ready(function () {
    DateFillForNewStocking();
    searchTable('txtSearch', 'tblItem'); 
    $('select').select2();
    $("#ddlLoadNo,#ddlMacNo,#ddlDate").on('change', function () {
        if ($(this).attr('id') == 'ddlMacNo')
            _machine = $(this).find('option:selected').text();
        else if ($(this).attr('id') == 'ddlLoadNo')
            _load = $(this).find('option:selected').text();
        else if ($(this).attr('id') == 'ddlDate')
            _date = $(this).find('option:selected').val();

        $('#txtBatchNo').val(_machine + '-' + _load + '-' + _date + '-' + _set);
    });
    $("#ddlSetName").on('change', function () {
        if ($(this).find("option:selected").text() != "Select") {
            _set = $("#ddlSetName option:selected").val();
            $('#txtBatchNo').val(_machine + '-' + _load + '-' + _date + '-' + _set);
        }

        var type = $("#ddlSetType option:selected").val();
        if (type == 'SET')
            $("#txtQty").val(1).prop('disabled', true);
        else
            $("#txtQty").val('').prop('disabled', false);
    });
});
function DateFillForNewStocking() {
    $("#ddlDate").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = '-';
    objBO.Logic = 'DateFillForNewStocking';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var count = 0;
            $.each(data.ResultSet.Table, function (key, val) {
                _date = val.currDate;
                $("#ddlDate").append($("<option></option>").val(val.dateVal).html(val.dateDis)).select2();
            });
            $("#ddlDate").val(_date).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AutoGenBatchNo() {
    if ($("#ddlSetName option:selected").text() == 'Select') {
        alert('Please Select Set Name');
        return;
    }
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = $("#ddlSetName option:selected").val();
    objBO.Logic = 'AutoGenBatchNo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $.each(data.ResultSet.Table, function (key, val) {
                $("#txtBatchNo").val(val.batch_no);
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetStockingInfo() {

    $("#tblStockInfo tbody").empty();
    $("#txtExpDate").val('');
    $("#txtSetIdName").val($("#ddlSetName option:selected").val());
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = $("#ddlSetName option:selected").val();
    objBO.Prm_2 = $("#ddlSetType option:selected").val();
    objBO.Logic = 'GetSetStockingInfo';
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
                    var item = "";
                    var qty = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        item = val.SetId;
                        qty += val.qty;
                        tbody += "<tr>";
                        tbody += "<td>" + val.SetId + "</td>";
                        tbody += "<td>" + val.SetName + "</td>";
                        tbody += "<td>" + val.batch_no + "</td>";
                        tbody += "<td>" + val.exp_date + "</td>";
                        tbody += "<td>" + val.rcpt_flag + "</td>";
                        tbody += "<td class='text-right'>" + val.qty + "</td>";
                        tbody += "</tr>";
                    });
                    if (objBO.Prm_2 == 'CONSUMABLE') {
                        tbody += "<tr style='background: #eee;font-size:14px'>";
                        tbody += "<td colspan='5'><b>Total Qty</b></td>";
                        tbody += "<td class='text-right'><b>" + qty + "</b></td>";
                        tbody += "</tr>";
                    }
                    $("#tblStockInfo tbody").append(tbody);
                }
                if (($("#ddlSetType option:selected").val() == 'SET'))
                    $("#txtQty").prop('disabled', true);
                else
                    $("#txtQty").prop('disabled', false);
            }
            else {
                $("#btnSave").prop('disabled', false);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GeSetInfo() {
    $("#tblStockInfo tbody").empty();
    $("#txtBatchNo").val('');
    $("#txtExpDate").val('');
    $("#ddlSetName").empty().append($('<option>Select</option>'));
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = $('#ddlSetType option:selected').text();
    objBO.Logic = 'GeSetMasterInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet.Table).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#ddlSetName").append($("<option data-type=" + val.ItemType + "></option>").val(val.SetId).html(val.SetName)).select2();
                });
            }
            else {
                //alert("Set Not Found..");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function NewSetStocking() {
    if ($('#txtBatchNo').val().length < 18) {
        alert('Batch No. not in proper.');
        return;
    }
    if (Validation()) {
        var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateMovement";
        var objBO = {};
        objBO.SetId = $('#ddlSetName option:selected').val();
        objBO.BatchNo = $('#txtBatchNo').val();
        objBO.expDate = $('#txtExpDate').val();
        objBO.qty = $('#txtQty').val();
        objBO.login_id = Active.userId;
        objBO.Logic = 'NewSetStocking';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert('Saved Successfully');
                    GetStockingInfo();
                    $('input:text').val('');
                    $('#txtExpDate').val('');
                    $('#ddlSetName').prop('selectedIndex', '0').change();
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
    var setName = $('#ddlSetName option:selected').val();
    var batchNo = $('#txtBatchNo').val();
    var expDate = $('#txtExpDate').val();

    if (setName == 'Select') {
        alert('Please Choose Set Name');
        return false;
    }
    if (batchNo == '') {
        alert('Please Provide Batch No');
        $('#txtBatchNo').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtBatchNo').removeAttr('style')
    }
    if (expDate == '') {
        alert('Please Provide Exp. Date');
        $('#txtExpDate').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtExpDate').removeAttr('style')
    }
    return true;
}