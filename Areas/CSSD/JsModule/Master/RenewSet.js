var _set = '';
var _machine = '01';
var _load = '01';
var _date = '';
var _batch = '';
$(document).ready(function () {
    CloseSidebar()
    GetSetInfoForRenew()
    DateFillForNewStocking()
    $('select').select2();
    searchTable('txtSearch', 'tblItem')
    $("#ddlLoadNo,#ddlMacNo,#ddlDate,#txtSetId").on('change', function () {
        if ($(this).attr('id') == 'ddlMacNo')
            _machine = $(this).find('option:selected').text();
        else if ($(this).attr('id') == 'ddlLoadNo')
            _load = $(this).find('option:selected').text();
        else if ($(this).attr('id') == 'ddlDate')
            _date = $(this).find('option:selected').val();
        else if ($(this).attr('id') == 'txtSetId')
            _set = $(this).text();

        $('#txtBatchNo').val(_machine + '-' + _load + '-' + _date + '-' + _set);
    });
    $("#ddlSetName").on('change', function () {       
        var type = $("#ddlSetType option:selected").val();
        if (type == 'SET')
            $("#txtQty").val(1).prop('disabled', true);
        else
            $("#txtQty").val('').prop('disabled', false);
    });
    $("#tblPendingInfo tbody").on('click', 'button', function () {
        selectRow($(this))
        var setId = $(this).closest('tr').find('td:eq(0)').text();
        var setName = $(this).closest('tr').find('td:eq(1)').text();
        $('#txtSetId').val(setId)
        $('#txtSetName').val(setName).change()
    });
});
function AutoGenBatchNo() {
    $("#txtBatchNo").val('');
    if ($("#ddlSetName option:selected").text() == 'Select') {
        alert('Please Select Set Name');
        return;
    }
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = $('#txtSetId').val();
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
function GetSetInfoForRenew() {
    $("#tblPendingInfo tbody").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = '-';
    objBO.Prm_2 = '-';
    objBO.Logic = 'GetSetInfoForRenew';
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
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.SetId + "</td>";
                        tbody += "<td>" + val.SetName + "</td>";
                        tbody += "<td>" + val.batch_no + "</td>";
                        tbody += "<td>" + val.exp_date + "</td>";
                        tbody += "<td><button class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblPendingInfo tbody").append(tbody);
                }
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetStockingInfo() {
    $("#tblStockInfo tbody").empty();
    $("#txtBatchNo").val('');
    $("#txtExpDate").val('');
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = $("#txtSetId").val();
    objBO.Prm_2 = 'SET';
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
                        tbody += "<td><a href='#' onclick=TrackSetByBatchNo('" + val.batch_no + "')>" + val.batch_no + "</a></td>";
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
    objBO.Logic = 'GeSetMasterInfoForRenew';
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
        objBO.SetId = $("#txtSetId").val();
        objBO.BatchNo = $('#txtBatchNo').val();
        objBO.expDate = $('#txtExpDate').val();
        objBO.qty = 1;
        objBO.login_id = Active.userId;
        objBO.Logic = 'ReNewSet';
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
                    $("#txtSetId").val('');;
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
function TrackSetByBatchNo(batchNo) {
    $('#txtBatchInfo').text('');
    $("#tblTrackingInfo tbody").empty();
    $("#tblInspectionInfo thead").empty();
    $("#tblInspectionInfo tbody").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = batchNo;
    objBO.Logic = 'TrackSetByBatchNo';
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
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + val.trn_type + "</td>";
                        tbody += "<td>" + val.batch_no + "</td>";
                        tbody += "<td>" + val.doc_date + "</td>";
                        tbody += "<td>" + val.exp_date.substring(0, 10) + "</td>";
                        tbody += "<td>" + val.SetId + "</td>";
                        tbody += "<td>" + val.fromcart + "</td>";
                        tbody += "<td>" + val.tocART + "</td>";
                        tbody += "<td>" + val.IPDNo + "</td>";
                        tbody += "<td>" + val.patient_name + "</td>";
                        tbody += "<td>" + val.DoctorName + "</td>";
                        tbody += "<td>" + val.emp_name + "</td>";
                        tbody += "</tr>";
                    });
                    $("#tblTrackingInfo tbody").append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    var tbody1 = "";
                    var thead = "";
                    thead += "<tr>";
                    for (var col in data.ResultSet.Table1[0]) {
                        thead += "<th>" + col + "</th>";
                    }
                    thead += "</tr>";
                    var count = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        count++;
                        tbody1 += "<tr>";
                        for (var col in data.ResultSet.Table1[0]) {
                            tbody1 += "<td>" + val[col] + "</td>";
                        }
                        tbody1 += "</tr>";
                    });
                    $("#tblInspectionInfo tbody").append(tbody1);
                    $("#tblInspectionInfo thead").append(thead);
                }
            }
        },
        complete: function () { $("#modalTracking").modal('show'); },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Validation() {
    var setName = $("#txtSetId").val();
    var batchNo = $('#txtBatchNo').val();
    var expDate = $('#txtExpDate').val();

    if (setName == '') {
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