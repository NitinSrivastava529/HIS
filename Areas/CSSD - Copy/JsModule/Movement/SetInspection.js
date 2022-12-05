
$(document).ready(function () {
    //$('select').select2()
    CloseSidebar();
    GetCSSDItems();
    searchTable('txtSearch', 'tblSetInfo');
    $('#ddlItems').on('change', function () {
        var qty = $(this).find('option:selected').data('qty');
        $('#txtStock').val(qty);
    });
});

function GetCSSDItems() {
    var url = config.baseUrl + "/api/cssd/CSSD_MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetCSSDItems';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                console.log(data)
                $("#ddlItems").empty().append($('<option>Select</option>'));
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#ddlItems").append($("<option data-qty='" + val.qty + "'></option>").val(val.ItemId).html(val.ItemName)).select2();
                });
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetSetInfoForInspection() {
    $("#tblSetInfo tbody").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = Active.CSSDInspectionCartId;
    objBO.Logic = 'GetSetInfoForInspection';
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
                    var count = 0;
                    var tranId = '';
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (tranId != val.tranId) {
                            tbody += "<tr class='bg1'>";
                            tbody += "<td colspan='6'>" + val.tran_id + "</td>";
                            tbody += "</tr>";
                            tranId = val.tranId;
                        }
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td style='display:none'>" + val.tran_id + "</td>";
                        tbody += "<td>" + val.SetId + "</td>";
                        tbody += "<td>" + val.SetName + "</td>";
                        tbody += "<td>" + val.batch_no + "</td>";
                        tbody += "<td>" + val.exp_date.substr(0, 10) + "</td>";
                        tbody += "<td><button onclick=selectRow(this);SetInfo('" + val.SetId + "') class='btn btn-warning tbl-btn'>View</button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblSetInfo tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetSetInfoForContemination() {
    $("#tblConteminationInfo tbody").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = Active.CSSDContaminationCartId;
    objBO.Logic = 'GetSetInfoForContemination';
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
                    var count = 0;
                    var tranId = '';
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (tranId != val.tranId) {
                            tbody += "<tr class='bg1'>";
                            if (val.rcv_status == '0')
                                tbody += "<td colspan='6'>" + val.tran_id + " <button onclick=ReceiveInContamination('" + val.tran_id + "') class='btn btn-warning tbl-btn pull-right'>Receive</button></td>";
                            else
                                tbody += "<td colspan='6'>" + val.tran_id + "</td>";

                            tbody += "</tr>";
                            tranId = val.tranId;
                        }
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td style='display:none'>" + val.tran_id + "</td>";
                        tbody += "<td>" + val.SetId + "</td>";
                        tbody += "<td>" + val.SetName + "</td>";
                        tbody += "<td>" + val.batch_no + "</td>";
                        tbody += "<td>" + val.exp_date.substr(0, 10) + "</td>";
                        if (val.rcv_status == '0')
                            tbody += "<td>-</td>";
                        else
                            tbody += "<td><button onclick=selectRow(this);GeSetItemInfo('" + val.SetId + "') class='btn btn-warning tbl-btn'>View</button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblConteminationInfo tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SetInfo(setid) {
    $("#tblSetItemInfo tbody").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = setid;
    objBO.Logic = 'GetSetItemInfo';
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
                    var count = 0;
                    var BatchNo = "";
                    var setInfo = '';
                    $.each(data.ResultSet.Table, function (key, val) {
                        setInfo = val.SetName + ' [' + val.SetId + '] ';
                        count++;
                        if (eval(val.MinQty) != eval(val.nos))
                            tbody += "<tr style='background:#fde0e0'>";
                        else
                            tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td style='display:none'>" + val.auto_id + "</td>";
                        tbody += "<td>" + val.ItemId + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td>" + val.MinQty + "</td>";
                        tbody += "<td>" + val.nos + "</td>";
                        tbody += "<td><input type='text' placeholder='Qty' class='text-right' style='width:100%'/></td>";
                        tbody += "<td><select>";
                        tbody += "<option>Damage</option>";
                        tbody += "<option>Missing</option>";
                        tbody += "</select></td>";
                        tbody += "<td><input type='text' placeholder='Remark'/></td>";
                        tbody += "<td><button class='btn btn-success tbl-btn text11' onclick=InspectionLog(this)>Submit</button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblSetItemInfo tbody").append(tbody);
                    $("#txtSetInfo").text(setInfo);
                    $("#txtBatchNo").val($('#tblSetInfo tbody tr.select-row').find('td:eq(4)').text());
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GeSetItemInfo(setId) {
    $("#tblSetItemLink tbody").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MasterQueries";
    var objBO = {};
    objBO.Prm_1 = setId;
    objBO.Logic = 'GeSetItemInfo';
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
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.ItemId + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td class='text-right'>" + val.nos + "</td>";
                        tbody += "<td>" + val.cr_date + "</td>";
                        tbody += "</tr>";
                    });
                    $("#tblSetItemLink tbody").append(tbody);
                }
                else {
                    //alert("Data Not Found");
                };
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InspectionLog(elem) {
    if (confirm('Are you sure to Submit?')) {

        var Remark = $(elem).closest('tr').find('td:eq(8)').find('input:text').val();
        if (Remark == '') {
            alert('Please Provide Remark..');
            return;
        }
        var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateMovement";
        var objBO = {};
        objBO.SetId = $("#tblSetInfo tbody").find('tr.select-row').find('td:eq(2)').text();
        objBO.CartdId = Active.CSSDInspectionCartId;
        objBO.ItemId = $(elem).closest('tr').find('td:eq(2)').text();
        objBO.qty = $(elem).closest('tr').find('td:eq(6)').find('input').val();
        objBO.Prm_1 = $(elem).closest('tr').find('td:eq(7)').find('select option:selected').text();
        objBO.Prm_2 = $('#txtBatchNo').val();
        objBO.Remark = $(elem).closest('tr').find('td:eq(8)').find('input:text').val();
        objBO.expDate = "1900/01/01";
        objBO.login_id = Active.userId;
        objBO.Logic = 'InspectionLog';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert('Submited Successfully..');
                    var setid = $("#tblSetInfo tbody tr.select-row").find('td:eq(2)').text();
                    SetInfo(setid);
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
function ReceiveInContamination(trnNo) {
    if (confirm('Are you sure to Receive?')) {
        var url = config.baseUrl + "/api/cssd/CSSD_ItemDispatchAndReceive";
        var objBO = [];
        $('#tblConteminationInfo tbody tr:not(.bg1)').each(function () {
            if ($(this).find('td:eq(1)').text() == trnNo) {
                objBO.push({
                    'TrnNo': $(this).find('td:eq(1)').text(),
                    'FromCart': Active.CSSDContaminationCartId,
                    'ToCart': Active.CSSDContaminationCartId,
                    'SetId': $(this).find('td:eq(2)').text(),
                    'BatchNo': $(this).find('td:eq(4)').text(),
                    'expDate': $(this).find('td:eq(5)').text(),
                    'SetKey': '-',
                    'qty': 1,
                    'ItemType': '-',
                    'Remark': '-',
                    'hosp_id': Active.unitId,
                    'login_id': Active.userId,
                    'Logic': "Receive"
                });
            }
        });
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert('Received Successfully.')
                    GetSetInfoForContemination();
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
}
function OutContaminationToInspection() {
    if ($('#ddlMethod option:selected').text() == 'Select Method') {
        alert('Please Choose Method.');
        return;
    }
    if (confirm('Are you sure to Out?')) {
        var url = config.baseUrl + "/api/cssd/CSSD_ItemDispatchAndReceive";
        var objBO = [];
        $('#tblConteminationInfo tbody tr.select-row').each(function () {
            objBO.push({
                'TrnNo': $(this).find('td:eq(1)').text(),
                'FromCart': Active.CSSDContaminationCartId,
                'ToCart': Active.CSSDInspectionCartId,
                'SetId': $(this).find('td:eq(2)').text(),
                'BatchNo': $(this).find('td:eq(4)').text(),
                'expDate': $(this).find('td:eq(5)').text(),
                'SetKey': '-',
                'qty': 1,
                'ItemType': 'SET',
                'Remark': '-',
                'Prm_1': $('#ddlMethod option:selected').text(),
                'hosp_id': Active.unitId,
                'login_id': Active.userId,
                'Logic': "ContaminationToInspection"
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
                    alert(data);
                    GetSetInfoForContemination();
                    GetSetInfoForInspection();
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
}
function OutInspectionToCSSDCart() {
    if (confirm('Are you sure to Out?')) {
        var url = config.baseUrl + "/api/cssd/CSSD_ItemDispatchAndReceive";
        var objBO = [];
        $('#tblSetInfo tbody tr.select-row').each(function () {
            objBO.push({
                'TrnNo': $(this).find('td:eq(1)').text(),
                'FromCart': Active.CSSDInspectionCartId,
                'ToCart': Active.CSSDCartId,
                'SetId': $(this).find('td:eq(2)').text(),
                'BatchNo': $(this).find('td:eq(4)').text(),
                'expDate': $(this).find('td:eq(5)').text(),
                'SetKey': '-',
                'qty': 1,
                'ItemType': 'SET',
                'Remark': '-',
                'Prm_1': '-',
                'hosp_id': Active.unitId,
                'login_id': Active.userId,
                'Logic': "InspectionToCSSDCart"
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
                    alert(data);
                    GetSetInfoForInspection();
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
}
function SetItemLink() {
    var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateSetMaster";
    var objBO = {};
    objBO.SetId = $('#txtSetId').text();
    objBO.ItemId = $('#ddlItems option:selected').val();
    objBO.nos = $('#txtNOS').val();
    objBO.login_id = Active.userId;
    objBO.Logic = "SetItemLink";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                //alert(data);
                SetInfo(objBO.SetId);
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