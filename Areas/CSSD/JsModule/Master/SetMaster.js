$(document).ready(function () {
    GetDepartment();
    GeSetMasterInfo();
    GetCSSDItems();
    GeSetItemInfo();
    searchTable('txtSearch', 'tblSetMaster')
    $('#btnSave').on('click', function () {
        var val = $(this).text().trim();
        debugger
        switch (val) {
            case (val = 'Submit'):
                InsertUpdateSet('Insert');
                break;
            case (val = 'Update'):
                InsertUpdateSet('Update');
                break;
            default:
                alert('error');
                break;
        }
    });
    $('#ddlItems').on('change', function () {
        var qty = $(this).find('option:selected').data('qty');
        $('#txtStock').val(qty);
    });
    //$('#txtNOS').on('keyup', function () {
    //    var qty = parseInt($('#txtStock').val());
    //    var nos = parseInt($(this).val());
    //    if (nos > qty) {
    //        $(this).val(0);
    //        alert('NOS should be less then Stock Qty');
    //    }
    //});
    $("#tblSetMaster tbody").on('click', 'button.btn-warning', function () {
        var setId = $(this).closest('tr').find('td:eq(1)').text();
        var setName = $(this).closest('tr').find('td:eq(2)').text();
        selectRow($(this));
        $('#txtSetId').text(setId);
        $('#txtLinkSetId').text(setId + '-' + setName);
        GeSetItemInfo(setId);
        GeSetMasterById(setId);
    });
    $('#tblSetMaster tbody').on('click', '.switch', function () {
        isCheck = $(this).find('input[type=checkbox]').is(':checked');
        var setid = $(this).find('input[type=checkbox]').data('setid');
        var IsActive = $(this).find('input[type=checkbox]').data('active');
        if (isCheck) {
            if (IsActive == '1') {
                UpdateStatus(setid, '0');
            }
            else {
                UpdateStatus(setid, '1');
            }
        }
    });
});

function GetDepartment() {
    var url = config.baseUrl + "/api/cssd/CSSD_MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetWebDept';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                console.log(data)
                $("#ddlDepartment").empty().append($('<option>Select</option>'));
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#ddlDepartment").append($("<option></option>").val(val.DeptId).html(val.dept_name)).select2();
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
function GeSetMasterInfo() {
    var url = config.baseUrl + "/api/cssd/CSSD_MasterQueries";
    var objBO = {};
    objBO.Logic = 'GeSetMasterInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#tblSetMaster tbody").empty();
                    var tbody = "";
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td><button class='btn bn btn-warning' style='height: 20px;'>Edit</button></td>";
                        tbody += "<td>" + val.SetId + "</td>";
                        tbody += "<td data-itemid='" + val.SetId + "'>" + val.SetName + "</td>";
                        tbody += '<td class="text-center">' +
                            '<label class="switch">' +
                            '<input type="checkbox" data-setid=' + val.SetId + ' data-active=' + val.IsActive + ' class="statusflag" id="chkActive" ' + val.checked + '>' +
                            '<span class="slider round"></span></label>' +
                            '</td>';
                        tbody += "</tr>";
                    });
                    $("#tblSetMaster tbody").append(tbody);
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
function GeSetMasterById(ItemId) {
    var url = config.baseUrl + "/api/cssd/CSSD_MasterQueries";
    var objBO = {};
    objBO.Prm_1 = ItemId;
    objBO.Logic = 'GeSetMasterById';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#txtSetName").val(val.SetName);
                        $("#txtSetId").text(val.SetId);
                        $("#txtExpiryDays").val(val.expiryDays);
                        $("#txtDescription").val(val.description);
                        $("#ddlItemType option").map(function () {
                            if ($(this).val().toLowerCase() == val.ItemType.toLowerCase()) {
                                $("#ddlItemType").prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                        });
                        $("#ddlDepartment option").map(function () {
                            if ($(this).val().toLowerCase() == val.DeptName.toLowerCase()) {
                                $("#ddlDepartment").prop('selectedIndex', '' + $(this).index() + '').change();
                            }
                        });
                        $('#btnSave').html('<i class="fa fa-edit">&nbsp;</i>Update').switchClass('btn-primary', 'btn-warning');
                        debugger
                        if (val.ItemType == 'SET')
                            $("#btnLink").prop('disabled', false);
                        else
                            $("#btnLink").prop('disabled', true);
                    });

                }
                else {
                    alert("Data Not Found");
                };
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertUpdateSet(logic) {
    if (Validation()) {
        var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateSetMaster";
        var objBO = {};
        objBO.DeptName = $('#ddlDepartment option:selected').val();
        objBO.SetId = $('#txtSetId').text();
        objBO.SetName = $('#txtSetName').val().trim();
        objBO.ItemType = $('#ddlItemType option:selected').text();
        objBO.expiryDays = $('#txtExpiryDays').val();
        objBO.description = $('#txtDescription').val();
        objBO.login_id = Active.userId;
        objBO.Logic = logic;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    GeSetMasterInfo();
                    Clear();
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
function UpdateStatus(itemid, IsActive) {
    var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateSetMaster";
    var objBO = {};
    objBO.SetId = itemid;
    objBO.IsActive = IsActive;
    objBO.login_id = Active.userId;
    objBO.Logic = 'UpdateStatus';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            GeSetMasterInfo();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Clear() {
    $('input:text').val('');
    $('textarea').val('');
    $('#btnSave').html('<i class="fa fa-plus">&nbsp;</i>Submit').switchClass('btn-warning', 'btn-primary');
    $("#ddlDepartment").prop('selectedIndex', '0').change();
    $("#ddlItems").prop('selectedIndex', '0').change();
}
function Validation() {
    var DeptName = $('#ddlDepartment option:selected').val();
    var SetName = $('#txtSetName').val();
    var ExpiryDays = $('#txtExpiryDays').val();


    if (DeptName == 'Select') {
        alert('Please Select Department Name');
        $('#ddlDepartment').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#ddlDepartment').removeAttr('style')
    }
    if (SetName == '') {
        alert('Please Provide Set Name');
        $('#txtSetName').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtSetName').removeAttr('style')
    }
    if (ExpiryDays == '') {
        alert('Please Provide Expiry Days');
        $('#txtExpiryDays').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtExpiryDays').removeAttr('style')
    }
    return true;
}

//Set Link
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
                        tbody += "<td><button class='btn btn-danger btn-xs' style='height: 20px;' onclick=DeleteItemLink(" + val.auto_id + ")><i class='fa fa-trash'></i></button></td>";
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
function SetItemLink() {
    if (ValidationLink()) {
        var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateSetMaster";
        var objBO = {};
        objBO.ItemId = $('#ddlItems option:selected').val();
        objBO.SetId = $('#txtSetId').text();
        objBO.nos = $('#txtNOS').val();
        objBO.login_id = Active.userId;
        objBO.Logic = 'SetItemLink';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    GeSetItemInfo($('#txtSetId').text());
                    Clear();
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
function DeleteItemLink(AutoId) {
    if (confirm('Are you Sure to Delete this?')) {
        var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateSetMaster";
        var objBO = {};
        objBO.AutoId = AutoId;
        objBO.Logic = 'DeleteItemLink';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                GeSetItemInfo($('#txtSetId').text());
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function ValidationLink() {
    var Items = $('#ddlItems option:selected').val();
    var SetId = $('#txtSetId').text();
    var NOS = $('#txtNOS').val();


    if (Items == 'Select') {
        alert('Please Select Item Name');
        $('#ddlItems').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#ddlItems').removeAttr('style')
    }
    if (SetId == '') {
        alert('Please Select Set Item To Link');
        return false;
    }
    if (NOS == '') {
        alert('Please Provide NOS');
        $('#txtNOS').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtNOS').removeAttr('style')
    }
    return true;
}